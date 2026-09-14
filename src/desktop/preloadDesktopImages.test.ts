import { describe, expect, it, vi } from 'vitest'
import { preload } from 'react-dom'
import { preloadDesktopImages } from './preloadDesktopImages'
import { projects } from '../content'
import { responsiveImage } from '../lib/responsiveImage'

vi.mock('react-dom', () => ({ preload: vi.fn() }))

describe('entry image preloading', () => {
  it('prioritises the avatar and warms matching desktop candidates without screenshots', () => {
    preloadDesktopImages()
    expect(preload).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      as: 'image', imageSizes: '144px', fetchPriority: 'high',
    }))
    for (const project of projects) {
      if (project.thumbnail) {
        const image = responsiveImage(project.thumbnail, '96px')
        expect(preload).toHaveBeenCalledWith(image.src, {
          as: 'image', imageSrcSet: image.srcSet, imageSizes: image.sizes, fetchPriority: 'low',
        })
      }
      for (const screenshot of project.screenshots) {
        expect(vi.mocked(preload).mock.calls.some(([src]) => src === responsiveImage(screenshot, '640px').src)).toBe(false)
      }
    }
  })
})
