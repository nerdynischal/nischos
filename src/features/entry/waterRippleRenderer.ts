const MAX_RIPPLES = 10
const RIPPLE_LIFETIME_MS = 1_800
const RIPPLE_LIFETIME_SECONDS = RIPPLE_LIFETIME_MS / 1_000
const INACTIVE_RIPPLE_OFFSET_SECONDS = RIPPLE_LIFETIME_SECONDS + 1
const DEFAULT_GRID_SIZE = 40
const DEFAULT_GRID_OPACITY = 0.045

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;

  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_pixel_ratio;
  uniform float u_time;
  uniform vec3 u_background;
  uniform float u_grid_size;
  uniform float u_grid_opacity;
  uniform vec3 u_ripples[${MAX_RIPPLES}];

  const float RIPPLE_LIFETIME = ${RIPPLE_LIFETIME_SECONDS};

  void main() {
    vec2 point = vec2(
      gl_FragCoord.x / u_pixel_ratio,
      u_resolution.y - (gl_FragCoord.y / u_pixel_ratio)
    );
    vec2 displacement = vec2(0.0);

    for (int index = 0; index < ${MAX_RIPPLES}; index++) {
      vec2 delta = point - u_ripples[index].xy;
      float distanceFromOrigin = length(delta);
      float age = u_time - u_ripples[index].z;

      if (age >= 0.0 && age <= RIPPLE_LIFETIME) {
        float progress = age / RIPPLE_LIFETIME;
        float waveFront = 22.0 + age * 150.0;
        float phase = distanceFromOrigin - waveFront;
        float envelope = exp(-abs(phase) * 0.018);
        float damping = pow(1.0 - progress, 1.7);
        float originFade = smoothstep(3.0, 20.0, distanceFromOrigin);
        float wave = sin(phase * 0.115);
        float strength = wave * envelope * damping * originFade * 5.8;

        displacement += (delta / max(distanceFromOrigin, 1.0)) * strength;
      }
    }

    vec2 warpedPoint = point + clamp(displacement, vec2(-12.0), vec2(12.0));
    vec2 gridCell =
      abs(fract((warpedPoint / u_grid_size) + 0.5) - 0.5) * u_grid_size;
    float distanceToGrid = min(gridCell.x, gridCell.y);
    float gridLine = 1.0 - smoothstep(0.35, 1.05, distanceToGrid);

    vec2 normalizedPoint = ((point / u_resolution) - 0.5) * 2.0;
    float distanceFromCenter = length(normalizedPoint);
    float gridMask = clamp((0.94 - distanceFromCenter) / 0.74, 0.0, 1.0);

    float gridOpacity = gridLine * gridMask * u_grid_opacity;
    vec3 color = mix(u_background, vec3(1.0), gridOpacity);
    gl_FragColor = vec4(color, 1.0);
  }
`

export type WaterRippleRenderer = {
  addRipple: (x: number, y: number, now: number) => void
  clearRipples: (now: number) => void
  dispose: () => void
  render: (now: number) => void
  resize: (width: number, height: number, pixelRatio: number) => void
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }

  return shader
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE)
  const fragmentShader = compileShader(
    gl,
    gl.FRAGMENT_SHADER,
    FRAGMENT_SHADER_SOURCE,
  )
  if (!vertexShader || !fragmentShader) {
    if (vertexShader) gl.deleteShader(vertexShader)
    if (fragmentShader) gl.deleteShader(fragmentShader)
    return null
  }

  const program = gl.createProgram()
  if (!program) {
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    return null
  }

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.deleteShader(vertexShader)
  gl.deleteShader(fragmentShader)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }

  return program
}

function readBackgroundColor(canvas: HTMLCanvasElement) {
  const surface = canvas.parentElement ?? canvas
  const channels = getComputedStyle(surface).backgroundColor.match(/[\d.]+/g)
  if (!channels || channels.length < 3) return [0.02, 0.02, 0.02] as const

  return [
    Number(channels[0]) / 255,
    Number(channels[1]) / 255,
    Number(channels[2]) / 255,
  ] as const
}

function readCssNumber(
  element: Element,
  propertyName: string,
  fallback: number,
) {
  const value = Number.parseFloat(
    getComputedStyle(element).getPropertyValue(propertyName),
  )
  return Number.isFinite(value) ? value : fallback
}

export function createWaterRippleRenderer(
  canvas: HTMLCanvasElement,
): WaterRippleRenderer | null {
  const context = canvas.getContext('webgl', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    stencil: false,
  })
  if (!context) return null
  const gl = context

  const program = createProgram(gl)
  if (!program) return null

  const positionBuffer = gl.createBuffer()
  const positionLocation = gl.getAttribLocation(program, 'a_position')
  const resolutionLocation = gl.getUniformLocation(program, 'u_resolution')
  const pixelRatioLocation = gl.getUniformLocation(program, 'u_pixel_ratio')
  const timeLocation = gl.getUniformLocation(program, 'u_time')
  const backgroundLocation = gl.getUniformLocation(program, 'u_background')
  const gridSizeLocation = gl.getUniformLocation(program, 'u_grid_size')
  const gridOpacityLocation = gl.getUniformLocation(program, 'u_grid_opacity')
  const ripplesLocation = gl.getUniformLocation(program, 'u_ripples[0]')

  if (
    !positionBuffer ||
    positionLocation < 0 ||
    !resolutionLocation ||
    !pixelRatioLocation ||
    !timeLocation ||
    !backgroundLocation ||
    !gridSizeLocation ||
    !gridOpacityLocation ||
    !ripplesLocation
  ) {
    if (positionBuffer) gl.deleteBuffer(positionBuffer)
    gl.deleteProgram(program)
    return null
  }

  const epoch = performance.now()
  const backgroundColor = readBackgroundColor(canvas)
  const gridSize = readCssNumber(
    canvas,
    '--lock-screen-grid-size',
    DEFAULT_GRID_SIZE,
  )
  const gridOpacity = readCssNumber(
    canvas,
    '--lock-screen-grid-opacity',
    DEFAULT_GRID_OPACITY,
  )
  const rippleData = new Float32Array(MAX_RIPPLES * 3)
  for (let index = 0; index < MAX_RIPPLES; index += 1) {
    rippleData[index * 3 + 2] = -INACTIVE_RIPPLE_OFFSET_SECONDS
  }
  let nextRippleIndex = 0
  let cssWidth = 1
  let cssHeight = 1
  let renderPixelRatio = 1

  gl.useProgram(program)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  )
  gl.enableVertexAttribArray(positionLocation)
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
  gl.clearColor(0, 0, 0, 0)

  function render(now: number) {
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.uniform2f(resolutionLocation, cssWidth, cssHeight)
    gl.uniform1f(pixelRatioLocation, renderPixelRatio)
    gl.uniform1f(timeLocation, (now - epoch) / 1_000)
    gl.uniform3f(backgroundLocation, ...backgroundColor)
    gl.uniform1f(gridSizeLocation, gridSize)
    gl.uniform1f(gridOpacityLocation, gridOpacity)
    gl.uniform3fv(ripplesLocation, rippleData)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  return {
    addRipple(x, y, now) {
      const offset = nextRippleIndex * 3
      rippleData[offset] = x
      rippleData[offset + 1] = y
      rippleData[offset + 2] = (now - epoch) / 1_000
      nextRippleIndex = (nextRippleIndex + 1) % MAX_RIPPLES
    },
    clearRipples(now) {
      const inactiveStart =
        (now - epoch) / 1_000 - INACTIVE_RIPPLE_OFFSET_SECONDS
      for (let index = 0; index < MAX_RIPPLES; index += 1) {
        rippleData[index * 3 + 2] = inactiveStart
      }
      nextRippleIndex = 0
      render(now)
    },
    dispose() {
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.deleteBuffer(positionBuffer)
      gl.deleteProgram(program)
    },
    render,
    resize(width, height, pixelRatio) {
      cssWidth = Math.max(1, width)
      cssHeight = Math.max(1, height)
      renderPixelRatio = pixelRatio
      const nextWidth = Math.max(1, Math.round(cssWidth * renderPixelRatio))
      const nextHeight = Math.max(1, Math.round(cssHeight * renderPixelRatio))

      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
        gl.viewport(0, 0, nextWidth, nextHeight)
      }
    },
  }
}

export { RIPPLE_LIFETIME_MS }
