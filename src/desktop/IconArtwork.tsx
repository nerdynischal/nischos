import { useEffect, useState } from 'react'
import type { DesktopIcon } from '../types'
import { PlaceholderIcon } from './PlaceholderIcon'

const defaultArtwork: Partial<Record<DesktopIcon['kind'], string>> = {
  blog: '/blog-icon.png',
  settings: '/about-icon.png',
}

export function IconArtwork({
  artworkId,
  thumbnail,
  variant,
}: {
  artworkId?: string
  thumbnail?: string
  variant: DesktopIcon['kind']
}) {
  const [failed, setFailed] = useState(false)
  const artwork = thumbnail ?? defaultArtwork[variant]

  useEffect(() => {
    setFailed(false)
  }, [artwork])

  if (!artwork || failed) {
    return <PlaceholderIcon variant={variant} />
  }

  return (
    <img
      className={`project-thumbnail thumbnail-${variant}`}
      src={artwork}
      alt=""
      aria-hidden="true"
      data-artwork-id={artworkId}
      onError={() => setFailed(true)}
    />
  )
}
