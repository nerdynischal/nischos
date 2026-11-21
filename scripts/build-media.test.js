import { existsSync, readFileSync, readdirSync } from 'node:fs'
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

  it('ships only generated variants referenced by the current manifest', () => {
    const media = JSON.parse(readFileSync(new URL('../src/generated/media.json', import.meta.url), 'utf8'))
    const referenced = new Set(Object.values(media).flatMap((image) => image.variants.map((variant) => variant.src.split('/').at(-1))))
    const generated = readdirSync(new URL('../public/optimized', import.meta.url))
      .filter((name) => /^[a-f\d]{16}-\d+\.webp$/.test(name))
    expect(new Set(generated)).toEqual(referenced)
  })

  it('resolves every remote mirror and verified alias to checked-in artwork', () => {
    for (const file of ['remote-media.json', 'media-aliases.json']) {
      const aliases = JSON.parse(readFileSync(new URL(`../content/${file}`, import.meta.url), 'utf8'))
      for (const [remote, local] of Object.entries(aliases)) {
        expect(new URL(remote).protocol).toBe('https:')
        expect(local).toMatch(/^\/project-media\//)
        expect(existsSync(new URL(`../public${local}`, import.meta.url)), local).toBe(true)
      }
    }
  })
})
