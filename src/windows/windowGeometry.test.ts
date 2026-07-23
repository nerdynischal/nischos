import { describe, expect, it } from 'vitest'
import { clampWindowToViewport, repositionWindowForViewport } from './windowGeometry'

const windowGeometry = {
  x: 900,
  y: 700,
  width: 500,
  height: 400,
}

describe('clampWindowToViewport', () => {
  it('keeps desktop windows inside the usable viewport', () => {
    expect(
      clampWindowToViewport(windowGeometry, { width: 1200, height: 800 }),
    ).toEqual({
      ...windowGeometry,
      x: 692,
      y: 352,
    })
  })

  it('leaves mobile geometry to the responsive layout', () => {
    expect(
      clampWindowToViewport(windowGeometry, { width: 760, height: 800 }),
    ).toEqual(windowGeometry)
  })
})

describe('repositionWindowForViewport', () => {
  it('preserves a window position relative to the available desktop space', () => {
    const result = repositionWindowForViewport(
      { ...windowGeometry, x: 346, y: 176 },
      { width: 1200, height: 800 },
      { width: 1600, height: 1000 },
    )

    expect((result.x - 8) / (1600 - 500 - 16)).toBeCloseTo(
      (346 - 8) / (1200 - 500 - 16),
    )
    expect((result.y - 8) / (1000 - 40 - 400 - 16)).toBeCloseTo(
      (176 - 8) / (800 - 40 - 400 - 16),
    )
  })
})
