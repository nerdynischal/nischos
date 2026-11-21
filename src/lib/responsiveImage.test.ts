import { describe, expect, it } from 'vitest'
import { responsiveImage } from './responsiveImage'
import remoteMedia from '../../content/remote-media.json'

describe('responsive images', () => {
  it('serves all mirrored remote screenshots through local responsive variants', () => {
    for (const source of Object.keys(remoteMedia)) {
      const image = responsiveImage(source, '640px', '/nischos/')
      if (source.endsWith('.svg')) {
        expect(image).toEqual({ src: `/nischos${remoteMedia[source as keyof typeof remoteMedia]}` })
        continue
      }
      expect(image.src).toMatch(/^\/nischos\/optimized\/.+-320.webp$/)
      expect(image.srcSet).toContain('640w')
      expect(image.sizes).toBe('640px')
      expect(image.width).toBeGreaterThan(0)
    }
  })

  it('uses verified local artwork for live aliases, including query variants', () => {
    const base = 'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/'
    expect(responsiveImage(`${base}workout-board/icon.svg?v=2`, '96px', '/nischos/'))
      .toEqual({ src: '/nischos/project-media/workout-board/icon.svg' })
    expect(responsiveImage(`${base}item-tracker/01-watchlist.png`, '640px', '/nischos/').src)
      .toBe(responsiveImage('/project-media/pricewatch/01-watchlist.png', '640px', '/nischos/').src)
  })

  it('serves generated sizes and reserves the original aspect ratio', () => {
    const image = responsiveImage('/folder-icon-v2.png', '96px', '/')
    expect(image.src).toMatch(/^\/optimized\/.+-96.webp$/)
    expect(image.srcSet).toContain('192w')
    expect(image.sizes).toBe('96px')
    expect(image.width).toBeGreaterThan(0)
    expect(image.height).toBeGreaterThan(0)
  })

  it('resolves every responsive candidate under a GitHub Pages subpath', () => {
    const image = responsiveImage('/folder-icon-v2.png', '96px', '/nischos/')
    expect(image.src.startsWith('/nischos/optimized/')).toBe(true)
    expect(image.srcSet!.split(', ').every((item) => item.startsWith('/nischos/optimized/'))).toBe(true)
  })

  it('preserves remote URLs, SVGs, and newly added media without variants', () => {
    expect(responsiveImage('https://example.com/image.png', '96px', '/nischos/'))
      .toEqual({ src: 'https://example.com/image.png' })
    expect(responsiveImage('/logo.svg', '96px', '/nischos/'))
      .toEqual({ src: '/nischos/logo.svg' })
    expect(responsiveImage('/project-media/new.png', '96px', '/'))
      .toEqual({ src: '/project-media/new.png' })
  })
})
