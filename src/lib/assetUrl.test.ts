import { describe, expect, it } from 'vitest'
import { resolveAssetUrl } from './assetUrl'

describe('resolveAssetUrl', () => {
  it('prefixes root-relative assets with the configured deployment base', () => {
    expect(resolveAssetUrl('/logo.svg', '/nischalos/')).toBe('/nischalos/logo.svg')
    expect(resolveAssetUrl('/logo.svg', '/nischalos')).toBe('/nischalos/logo.svg')
  })

  it('preserves external and already-relative URLs', () => {
    expect(resolveAssetUrl('https://example.com/image.png', '/nischalos/')).toBe(
      'https://example.com/image.png',
    )
    expect(resolveAssetUrl('//cdn.example.com/image.png', '/nischalos/')).toBe(
      '//cdn.example.com/image.png',
    )
    expect(resolveAssetUrl('./image.png', '/nischalos/')).toBe('./image.png')
  })
})
