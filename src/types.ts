export type WindowKind = 'project' | 'blog' | 'settings'

export type DesktopWindow = {
  id: string
  kind: WindowKind
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
  kind: 'project' | 'blog' | 'settings'
  tone: string
  thumbnail?: string
  x: number
  y: number
}

export type ViewportSize = {
  width: number
  height: number
}
