import type { CSSProperties } from 'react'
import type { DesktopIcon } from '../types'
import { IconArtwork } from './IconArtwork'

export function DesktopIcons({
  icons,
  onOpenIcon,
  isCovered = false,
  inert = false,
}: {
  icons: DesktopIcon[]
  onOpenIcon: (icon: DesktopIcon) => void
  isCovered?: boolean
  inert?: boolean
}) {
  return (
    <section id="desktop-shortcuts" tabIndex={-1} className="desktop-icons" aria-label="Desktop icons" inert={inert}>
      {icons.map((icon) => (
        <button
          key={icon.id}
          type="button"
          tabIndex={isCovered ? -1 : undefined}
          className={`desktop-icon tone-${icon.tone}`}
          style={{ '--icon-x': `${icon.x}%`, '--icon-y': `${icon.y}%` } as CSSProperties}
          onClick={() => onOpenIcon(icon)}
          aria-label={`Open ${icon.label}`}
        >
          <span className="icon-glyph" aria-hidden="true">
            <IconArtwork artworkId={icon.id} thumbnail={icon.thumbnail} variant={icon.category} />
          </span>
          <span className="icon-label">{icon.label}</span>
        </button>
      ))}
    </section>
  )
}
