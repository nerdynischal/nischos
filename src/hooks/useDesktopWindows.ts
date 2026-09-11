import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { DesktopWindow, DragState, ViewportSize } from '../types'
import {
  clampWindowToViewport,
  getCurrentViewport,
  initialWindowLayout,
  repositionWindowForViewport,
} from '../windows/windowGeometry'

type WindowInput = Pick<DesktopWindow, 'id' | 'category' | 'title'> & Partial<DesktopWindow>

type ActiveDrag = DragState & {
  element: HTMLElement
  pointerId: number
  width: number
  height: number
  x: number
  y: number
  frame: number | null
}

function paintDrag(drag: ActiveDrag) {
  drag.element.style.setProperty('--window-x', `${drag.x}px`)
  drag.element.style.setProperty('--window-y', `${drag.y}px`)
}

export function useDesktopWindows() {
  const [windows, setWindows] = useState<DesktopWindow[]>([])
  const dragRef = useRef<ActiveDrag | null>(null)
  const viewportRef = useRef<ViewportSize | null>(null)
  const nextZRef = useRef(20)

  const finishDrag = useCallback(() => {
    const drag = dragRef.current
    if (!drag) return
    if (drag.frame !== null) window.cancelAnimationFrame(drag.frame)
    paintDrag(drag)
    dragRef.current = null
    setWindows((items) => items.map((item) => item.id === drag.id
      ? { ...item, x: drag.x, y: drag.y, width: drag.width, height: drag.height }
      : item))
  }, [])

  useEffect(() => {
    let animationFrame = 0
    viewportRef.current = getCurrentViewport()

    function keepWindowsInView() {
      finishDrag()
      window.cancelAnimationFrame(animationFrame)
      animationFrame = window.requestAnimationFrame(() => {
        const previousViewport = viewportRef.current ?? getCurrentViewport()
        const nextViewport = getCurrentViewport()
        viewportRef.current = nextViewport
        setWindows((items) =>
          items.map((item) => repositionWindowForViewport(item, previousViewport, nextViewport)),
        )
      })
    }

    window.addEventListener('resize', keepWindowsInView)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', keepWindowsInView)
      if (dragRef.current?.frame != null) window.cancelAnimationFrame(dragRef.current.frame)
      dragRef.current = null
    }
  }, [finishDrag])

  const activeWindow = windows.reduce<DesktopWindow | undefined>(
    (frontmost, item) => (!frontmost || item.z > frontmost.z ? item : frontmost),
    undefined,
  )

  function getNextZ() {
    nextZRef.current += 1
    return nextZRef.current
  }

  function focusWindow(id: string) {
    const z = getNextZ()
    setWindows((items) =>
      items.map((item) => (item.id === id ? { ...item, z } : item)),
    )
  }

  function upsertWindow(input: WindowInput) {
    const layout = initialWindowLayout[input.category]
    const z = getNextZ()
    setWindows((items) => {
      const existing = items.find((item) => item.id === input.id)

      if (existing) {
        return items.map((item) =>
          item.id === input.id ? { ...item, ...input, z } : item,
        )
      }

      return [
        ...items,
        clampWindowToViewport({
          ...layout,
          ...input,
          z,
        }),
      ]
    })
  }

  function closeWindow(id: string) {
    if (dragRef.current?.id === id) finishDrag()
    setWindows((items) => items.filter((item) => item.id !== id))
  }

  function startDrag(event: PointerEvent<HTMLElement>, target: DesktopWindow) {
    if (event.button !== 0 || getCurrentViewport().width <= 760) return
    const element = event.currentTarget.closest<HTMLElement>('.window')
    if (!element) return
    finishDrag()
    const { width, height } = element.getBoundingClientRect()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      id: target.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: target.x,
      originY: target.y,
      element,
      pointerId: event.pointerId,
      width,
      height,
      x: target.x,
      y: target.y,
      frame: null,
    }
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const position = clampWindowToViewport({
      width: drag.width,
      height: drag.height,
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    })
    drag.x = position.x
    drag.y = position.y
    if (drag.frame === null) {
      drag.frame = window.requestAnimationFrame(() => {
        drag.frame = null
        paintDrag(drag)
      })
    }
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return
    if (event.type === 'pointerup') moveDrag(event)
    finishDrag()
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return {
    windows,
    activeWindow,
    focusWindow,
    upsertWindow,
    closeWindow,
    startDrag,
    moveDrag,
    endDrag,
  }
}
