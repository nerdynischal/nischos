import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { DesktopWindow, DragState, ViewportSize } from '../types'
import {
  clampWindowToViewport,
  getCurrentViewport,
  initialWindowLayout,
  repositionWindowForViewport,
} from '../windows/windowGeometry'

type WindowInput = Pick<DesktopWindow, 'id' | 'kind' | 'title'> & Partial<DesktopWindow>

export function useDesktopWindows() {
  const [windows, setWindows] = useState<DesktopWindow[]>([])
  const dragRef = useRef<DragState | null>(null)
  const viewportRef = useRef<ViewportSize | null>(null)
  const nextZRef = useRef(20)

  useEffect(() => {
    let animationFrame = 0
    viewportRef.current = getCurrentViewport()

    function keepWindowsInView() {
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
    }
  }, [])

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
    const layout = initialWindowLayout[input.kind]
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
    setWindows((items) => items.filter((item) => item.id !== id))
  }

  function startDrag(event: PointerEvent<HTMLElement>, target: DesktopWindow) {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      id: target.id,
      startX: event.clientX,
      startY: event.clientY,
      originX: target.x,
      originY: target.y,
    }
  }

  function moveDrag(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current
    if (!drag) return

    setWindows((items) =>
      items.map((item) =>
        item.id === drag.id
          ? clampWindowToViewport({
              ...item,
              x: drag.originX + event.clientX - drag.startX,
              y: drag.originY + event.clientY - drag.startY,
            })
          : item,
      ),
    )
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
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
