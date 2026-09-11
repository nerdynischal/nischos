import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('generated media manifest', () => {
  it('references existing originals and variants without upscaling sources', () => {
    const media = JSON.parse(readFileSync(new URL('../src/generated/media.json', import.meta.url), 'utf8'))
    expect(Object.keys(media).length).toBeGreaterThan(0)
    for (const [source, image] of Object.entries(media)) {
      expect(existsSync(new URL(`../public${source}`, import.meta.url))).toBe(true)
      for (const variant of image.variants) {
        expect(existsSync(new URL(`../public${variant.src}`, import.meta.url))).toBe(true)
        expect(variant.width).toBeLessThanOrEqual(image.width)
      }
    }
  })
})
