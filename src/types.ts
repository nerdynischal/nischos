export type WindowCategory = 'project' | 'blog' | 'settings'

export type DesktopWindow = {
  id: string
  category: WindowCategory
  refId?: string
  title: string
  x: number
  y: number
  width: number
  height: number
  z: number
}

export type DragState = {
  id: string
  startX: number
  startY: number
  originX: number
  originY: number
}

export type DesktopIcon = {
  id: string
  label: string
  category: WindowCategory
  tone: string
  thumbnail?: string
  x: number
  y: number
}

export type ViewportSize = {
  width: number
  height: number
}
