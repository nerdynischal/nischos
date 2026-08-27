import { useEffect, useRef } from 'react'
import {
  createWaterRippleRenderer,
  RIPPLE_LIFETIME_MS,
  type WaterRippleRenderer,
} from './waterRippleRenderer'
import { calculateWaterRipplePixelRatio } from './waterRippleSizing'

const RIPPLE_MEDIA_QUERY =
  '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
const MIN_RIPPLE_DISTANCE_SQUARED = 42 * 42
const FRAME_INTERVAL_MS = 1_000 / 45

export function LockScreenWaterRipple({
  isInteractive,
}: {
  isInteractive: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isInteractiveRef = useRef(isInteractive)
  const resetRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const canvasElement = canvas

    const mediaQuery = window.matchMedia(RIPPLE_MEDIA_QUERY)
    const lockScreen = canvasElement.closest<HTMLElement>('.lock-screen')
    let renderer: WaterRippleRenderer | null = null
    let resizeObserver: ResizeObserver | null = null
    let frameId: number | null = null
    let settleAt = 0
    let lastFrameAt = 0
    let lastRipplePoint: { x: number; y: number } | null = null
    let latestBounds = canvasElement.getBoundingClientRect()
    let isPointerListening = false

    function resize() {
      if (!renderer) return
      latestBounds = canvasElement.getBoundingClientRect()
      renderer.resize(
        latestBounds.width,
        latestBounds.height,
        calculateWaterRipplePixelRatio(
          latestBounds.width,
          latestBounds.height,
          window.devicePixelRatio,
        ),
      )
      renderer.render(performance.now())
    }

    function drawFrame(now: number) {
      frameId = null
      if (!renderer) return

      if (now - lastFrameAt >= FRAME_INTERVAL_MS || now >= settleAt) {
        renderer.render(now)
        lastFrameAt = now
      }

      if (now < settleAt) frameId = window.requestAnimationFrame(drawFrame)
    }

    function requestFramesThrough(endTime: number) {
      settleAt = Math.max(settleAt, endTime)
      if (frameId === null) frameId = window.requestAnimationFrame(drawFrame)
    }

    function handlePointerMove(event: PointerEvent) {
      if (
        !renderer ||
        !isInteractiveRef.current ||
        event.pointerType !== 'mouse'
      ) {
        return
      }

      const point = {
        x: event.clientX - latestBounds.left,
        y: event.clientY - latestBounds.top,
      }
      if (lastRipplePoint) {
        const deltaX = point.x - lastRipplePoint.x
        const deltaY = point.y - lastRipplePoint.y
        if (
          deltaX * deltaX + deltaY * deltaY <
          MIN_RIPPLE_DISTANCE_SQUARED
        ) {
          return
        }
      }

      const now = performance.now()
      lastRipplePoint = point
      renderer.addRipple(point.x, point.y, now)
      requestFramesThrough(now + RIPPLE_LIFETIME_MS)
    }

    function addPointerListener() {
      if (isPointerListening) return
      window.addEventListener('pointermove', handlePointerMove, { passive: true })
      isPointerListening = true
    }

    function removePointerListener() {
      if (!isPointerListening) return
      window.removeEventListener('pointermove', handlePointerMove)
      isPointerListening = false
    }

    function stopAnimation() {
      if (frameId !== null) window.cancelAnimationFrame(frameId)
      frameId = null
      settleAt = 0
      lastFrameAt = 0
      lastRipplePoint = null
    }

    function resetRipples() {
      stopAnimation()
      renderer?.clearRipples(performance.now())
    }

    function destroyRenderer({ contextLost = false } = {}) {
      stopAnimation()
      removePointerListener()
      resizeObserver?.disconnect()
      resizeObserver = null
      if (!contextLost) renderer?.dispose()
      renderer = null
      canvasElement.dataset.ready = 'false'
      lockScreen?.removeAttribute('data-ripple-ready')
    }

    function initializeRenderer() {
      if (renderer || !mediaQuery.matches) return
      renderer = createWaterRippleRenderer(canvasElement)
      if (!renderer) return

      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvasElement)
      resize()
      addPointerListener()
      canvasElement.dataset.ready = 'true'
      lockScreen?.setAttribute('data-ripple-ready', 'true')
    }

    function syncRenderer() {
      if (mediaQuery.matches) initializeRenderer()
      else destroyRenderer()
    }

    function handleContextLost(event: Event) {
      event.preventDefault()
      destroyRenderer({ contextLost: true })
    }

    function handleContextRestored() {
      initializeRenderer()
    }

    function handleVisibilityChange() {
      if (document.hidden) resetRipples()
    }

    resetRef.current = resetRipples
    mediaQuery.addEventListener('change', syncRenderer)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    canvasElement.addEventListener('webglcontextlost', handleContextLost)
    canvasElement.addEventListener('webglcontextrestored', handleContextRestored)
    syncRenderer()

    return () => {
      resetRef.current = null
      mediaQuery.removeEventListener('change', syncRenderer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      canvasElement.removeEventListener('webglcontextlost', handleContextLost)
      canvasElement.removeEventListener('webglcontextrestored', handleContextRestored)
      destroyRenderer()
    }
  }, [])

  useEffect(() => {
    isInteractiveRef.current = isInteractive
    if (!isInteractive) resetRef.current?.()
  }, [isInteractive])

  return (
    <canvas
      ref={canvasRef}
      className="lock-screen-water-ripple"
      data-ready="false"
      aria-hidden="true"
    />
  )
}
