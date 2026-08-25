import { useState } from 'react'
import type { DesktopIcon } from '../types'
import { PlaceholderIcon } from './PlaceholderIcon'

const defaultArtwork: Partial<Record<DesktopIcon['category'], string>> = {
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

  if (!artwork || artwork === failedArtwork) {
    return <PlaceholderIcon variant={variant} />
  }

  return (
    <img
      className={`project-thumbnail thumbnail-${variant}`}
      src={artwork}
      alt=""
      aria-hidden="true"
      data-artwork-id={artworkId}
      onError={() => setFailedArtwork(artwork)}
    />
  )
}
