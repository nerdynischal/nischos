import { describe, expect, it } from 'vitest'
import { resolveAssetUrl } from './assetUrl'

describe('resolveAssetUrl', () => {
  it('prefixes root-relative assets with the configured deployment base', () => {
    expect(resolveAssetUrl('/logo.svg', '/nischos/')).toBe('/nischos/logo.svg')
    expect(resolveAssetUrl('/logo.svg', '/nischos')).toBe('/nischos/logo.svg')
  })

  it('preserves external and already-relative URLs', () => {
    expect(resolveAssetUrl('https://example.com/image.png', '/nischos/')).toBe(
      'https://example.com/image.png',
    )
    expect(resolveAssetUrl('//cdn.example.com/image.png', '/nischos/')).toBe(
      '//cdn.example.com/image.png',
    )
    expect(resolveAssetUrl('./image.png', '/nischos/')).toBe('./image.png')
  })
})
