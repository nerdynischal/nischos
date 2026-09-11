import { useState } from 'react'
import { responsiveImage } from '../lib/responsiveImage'
import type { DesktopIcon } from '../types'
import { PlaceholderIcon } from './PlaceholderIcon'

const defaultArtwork: Partial<Record<DesktopIcon['category'], string>> = {
  folder: '/folder-icon-v2.png',
  blog: '/notes-icon.png',
  settings: '/about-icon.png',
}

export function IconArtwork({
  artworkId,
  thumbnail,
  variant,
}: {
  artworkId?: string
  thumbnail?: string
  variant: DesktopIcon['category']
}) {
  const [failedArtwork, setFailedArtwork] = useState<string | null>(null)
  const artwork = thumbnail ?? defaultArtwork[variant]
  const imageProps = artwork ? responsiveImage(artwork, '96px') : undefined
  const artworkUrl = imageProps?.src

  if (!artworkUrl || artworkUrl === failedArtwork) {
    return <PlaceholderIcon variant={variant} />
  }

  return (
    <img
      className={`project-thumbnail thumbnail-${variant}`}
      {...imageProps}
      alt=""
      aria-hidden="true"
      decoding="async"
      data-artwork-id={artworkId}
      onError={() => setFailedArtwork(artworkUrl)}
    />
  )
}
