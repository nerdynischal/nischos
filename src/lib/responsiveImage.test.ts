import { describe, expect, it } from 'vitest'
import { responsiveImage } from './responsiveImage'

describe('responsive images', () => {
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
