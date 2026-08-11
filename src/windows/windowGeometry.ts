import type { DesktopWindow, ViewportSize, WindowCategory } from '../types'

type WindowGeometry = Pick<DesktopWindow, 'x' | 'y' | 'width' | 'height'>
type WindowSize = Pick<DesktopWindow, 'width' | 'height'>

export const initialWindowLayout: Record<WindowCategory, WindowGeometry> = {
  project: { x: 9, y: 13, width: 680, height: 630 },
  blog: { x: 13, y: 17, width: 860, height: 640 },
  settings: { x: 17, y: 22, width: 700, height: 570 },
}

const MENU_BAR_HEIGHT = 40
const WINDOW_EDGE_GAP = 8
const MOBILE_BREAKPOINT = 760

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function getCurrentViewport(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function getViewportWindowSize(item: WindowSize, viewport = getCurrentViewport()) {
  const availableWidth = Math.max(320, viewport.width - WINDOW_EDGE_GAP * 2)
  const availableHeight = Math.max(240, viewport.height - MENU_BAR_HEIGHT - WINDOW_EDGE_GAP * 2)

  return {
    width: Math.min(item.width, availableWidth),
    height: Math.min(item.height, availableHeight),
  }
}

function getViewportWindowBounds(item: WindowSize, viewport: ViewportSize) {
  const { width, height } = getViewportWindowSize(item, viewport)

  return {
    maxX: Math.max(WINDOW_EDGE_GAP, viewport.width - width - WINDOW_EDGE_GAP),
    maxY: Math.max(
      WINDOW_EDGE_GAP,
      viewport.height - MENU_BAR_HEIGHT - height - WINDOW_EDGE_GAP,
    ),
  }
}

export function clampWindowToViewport<T extends WindowGeometry>(
  item: T,
  viewport = getCurrentViewport(),
): T {
  if (viewport.width <= MOBILE_BREAKPOINT) return item

  const { maxX, maxY } = getViewportWindowBounds(item, viewport)

  return {
    ...item,
    x: clampValue(item.x, WINDOW_EDGE_GAP, maxX),
    y: clampValue(item.y, WINDOW_EDGE_GAP, maxY),
  }
}

export function repositionWindowForViewport<T extends WindowGeometry>(
  item: T,
  previousViewport: ViewportSize,
  nextViewport: ViewportSize,
): T {
  if (nextViewport.width <= MOBILE_BREAKPOINT) return item

  const previousBounds = getViewportWindowBounds(item, previousViewport)
  const nextBounds = getViewportWindowBounds(item, nextViewport)
  const previousMoveWidth = Math.max(1, previousBounds.maxX - WINDOW_EDGE_GAP)
  const previousMoveHeight = Math.max(1, previousBounds.maxY - WINDOW_EDGE_GAP)
  const nextMoveWidth = Math.max(1, nextBounds.maxX - WINDOW_EDGE_GAP)
  const nextMoveHeight = Math.max(1, nextBounds.maxY - WINDOW_EDGE_GAP)
  const relativeX = clampValue((item.x - WINDOW_EDGE_GAP) / previousMoveWidth, 0, 1)
  const relativeY = clampValue((item.y - WINDOW_EDGE_GAP) / previousMoveHeight, 0, 1)

  return clampWindowToViewport(
    {
      ...item,
      x: WINDOW_EDGE_GAP + relativeX * nextMoveWidth,
      y: WINDOW_EDGE_GAP + relativeY * nextMoveHeight,
    },
    nextViewport,
  )
}
