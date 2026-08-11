import { describe, expect, it } from 'vitest'
import { calculateWaterRipplePixelRatio } from './waterRippleSizing'

describe('water-ripple render sizing', () => {
  it('caps high-density displays at the preferred render ratio', () => {
    expect(calculateWaterRipplePixelRatio(800, 600, 2)).toBe(1.25)
  })

  it('reduces resolution to stay within the render pixel budget', () => {
    expect(calculateWaterRipplePixelRatio(2560, 1440, 2)).toBeCloseTo(0.7366, 4)
  })

  it('keeps a minimum render ratio on very large viewports', () => {
    expect(calculateWaterRipplePixelRatio(8000, 5000, 2)).toBe(0.6)
  })

  it('uses a safe fallback for an invalid device pixel ratio', () => {
    expect(calculateWaterRipplePixelRatio(800, 600, 0)).toBe(1)
  })
})
