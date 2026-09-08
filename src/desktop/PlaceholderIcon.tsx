import { Folder, ImageIcon } from 'lucide-react'
import type { DesktopIcon } from '../types'

export function PlaceholderIcon({ variant }: { variant: DesktopIcon['category'] }) {
  const Icon = variant === 'folder' ? Folder : ImageIcon

  return (
    <Icon
      className={`placeholder-svg placeholder-${variant}`}
      strokeWidth={1.7}
      absoluteStrokeWidth
      aria-hidden="true"
      focusable="false"
    />
  )
}
