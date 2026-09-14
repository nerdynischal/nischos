import { preload } from 'react-dom'
import { projects } from '../content'
import { responsiveImage } from '../lib/responsiveImage'
import { createDesktopIcons } from './createDesktopIcons'
import { iconArtworkSource } from './iconArtworkSource'

export function preloadDesktopImages() {
  const avatar = responsiveImage('/about-icon.png', '144px')
  preload(avatar.src, {
    as: 'image', imageSrcSet: avatar.srcSet, imageSizes: avatar.sizes, fetchPriority: 'high',
  })

  // Match IconArtwork's responsive candidates so the visible image reuses the request.
  // Only preload entry artwork; project screenshots still load when opened.
  for (const icon of createDesktopIcons(projects)) {
    const source = iconArtworkSource(icon.category, icon.thumbnail)
    if (!source) continue
    const image = responsiveImage(source, '96px')
    preload(image.src, {
      as: 'image', imageSrcSet: image.srcSet, imageSizes: image.sizes, fetchPriority: 'low',
    })
  }
}
