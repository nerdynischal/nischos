import { describe, expect, it } from 'vitest'
import {
  clampWindowToViewport,
  adjustWindowGeometry,
  initialWindowLayout,
  repositionWindowForViewport,
} from './windowGeometry'

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

  it('keeps dragged windows above the reserved dock area', () => {
    const result = clampWindowToViewport(windowGeometry, { width: 1200, height: 800, bottomInset: 154 })
    expect(result.y + result.height + 40).toBe(800 - 154 - 8)
  })

  it('anchors oversized windows below the menu on short viewports', () => {
    const result = clampWindowToViewport(windowGeometry, { width: 1200, height: 400, bottomInset: 154 })
    expect(result.y).toBe(8)
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

describe('initialWindowLayout', () => {
  it('opens individual projects in a spacious case-study window', () => {
    expect(initialWindowLayout.project).toMatchObject({ width: 960, height: 820 })
  })

  it('gives the Selected Work folder a dedicated Finder-sized window', () => {
    expect(initialWindowLayout.folder).toMatchObject({ width: 790, height: 580 })
  })
})


describe('adjustWindowGeometry', () => {
  const limits = { minWidth: 390, maxWidth: 920, minHeight: 320 }
  const viewport = { width: 1200, height: 800, bottomInset: 100 }
  const initial = { x: 40, y: 40, width: 600, height: 400 }

  it.each([
    ['left', 'x', 8], ['right', 'x', 72], ['up', 'y', 8], ['down', 'y', 72],
    ['narrower', 'width', 568], ['wider', 'width', 632],
    ['shorter', 'height', 368], ['taller', 'height', 432],
  ] as const)('applies %s in a predictable step', (action, key, value) => {
    expect(adjustWindowGeometry(initial, action, limits, viewport)[key]).toBe(value)
  })

  it('stops at the workspace edges and size limits', () => {
    expect(adjustWindowGeometry({ ...initial, x: 592 }, 'right', limits, viewport).x).toBe(592)
    expect(adjustWindowGeometry({ ...initial, y: 252 }, 'down', limits, viewport).y).toBe(252)
    expect(adjustWindowGeometry({ ...initial, width: 390 }, 'narrower', limits, viewport).width).toBe(390)
    expect(adjustWindowGeometry({ ...initial, width: 920 }, 'wider', limits, viewport).width).toBe(920)
    expect(adjustWindowGeometry({ ...initial, height: 320 }, 'shorter', limits, viewport).height).toBe(320)
    expect(adjustWindowGeometry({ ...initial, height: 600 }, 'taller', limits, viewport).height).toBe(612)
  })

  it('supports precise one-pixel movement and resizing', () => {
    expect(adjustWindowGeometry(initial, 'right', limits, viewport, 1).x).toBe(41)
    expect(adjustWindowGeometry(initial, 'taller', limits, viewport, 1).height).toBe(401)
  })

  it('fits short desktop viewports even below the usual minimum height', () => {
    const result = adjustWindowGeometry(initial, 'taller', limits, { ...viewport, height: 300 })
    expect(result.height).toBe(112)
    expect(result.y + result.height).toBe(152)
  })
})
