import type { DesktopIcon } from '../types'

const defaultArtwork: Partial<Record<DesktopIcon['category'], string>> = {
  folder: '/folder-icon-v2.png',
  blog: '/notes-icon.png',
  settings: '/about-icon.png',
}

export function iconArtworkSource(category: DesktopIcon['category'], thumbnail?: string) {
  return thumbnail ?? defaultArtwork[category]
}
