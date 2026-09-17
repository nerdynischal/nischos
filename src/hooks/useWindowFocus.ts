import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type RefObject } from 'react'
import type { DesktopWindow } from '../types'

type FocusRequest = { windowId: string } | { element: HTMLElement | null }

function canRestoreFocus(element: HTMLElement | null): element is HTMLElement {
  if (!element?.isConnected || element.closest('[inert], [hidden]')) return false
  return element.getClientRects().length > 0 && !element.matches(':disabled')
}

/** Explicit activation moves DOM focus; pointer/focus activation only raises a window. */
export function useWindowFocus({ desktopRef, windows, activeWindow, raiseWindow, removeWindow }: {
  desktopRef: RefObject<HTMLElement | null>
  windows: DesktopWindow[]
  activeWindow?: DesktopWindow
  raiseWindow: (id: string) => void
  removeWindow: (id: string) => void
}) {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 760px)').matches)
  const openers = useRef(new Map<string, HTMLElement>())
  const pendingFocus = useRef<FocusRequest | null>(null)
  const invokingControl = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')
    const update = () => setIsMobile(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useLayoutEffect(() => {
    const desktop = desktopRef.current
    if (!desktop) return
    const request = pendingFocus.current
    pendingFocus.current = null
    const focusWindowHeading = (id?: string) => {
      const frame = Array.from(desktop.querySelectorAll<HTMLElement>('[data-window-id]'))
        .find((element) => element.dataset.windowId === id)
      frame?.querySelector<HTMLElement>('[data-window-focus-target]')?.focus({ preventScroll: true })
    }

    if (request && 'windowId' in request) {
      focusWindowHeading(request.windowId)
    } else if (request) {
      if (canRestoreFocus(request.element)) {
        request.element.focus({ preventScroll: true })
      } else if (activeWindow) {
        focusWindowHeading(activeWindow.id)
      } else {
        desktop.querySelector<HTMLElement>('.desktop-icon, .brand-button')?.focus({ preventScroll: true })
      }
    } else if (isMobile && activeWindow &&
      (document.activeElement === document.body || document.activeElement?.closest('[inert]'))) {
      // Resizing can make the previously focused desktop/control inaccessible.
      focusWindowHeading(activeWindow.id)
    }
  })

  function prepareOpen(id: string) {
    const opener = invokingControl.current ?? document.activeElement
    invokingControl.current = null
    if (!windows.some((item) => item.id === id) && opener instanceof HTMLElement &&
      opener !== document.body && desktopRef.current?.contains(opener)) {
      openers.current.set(id, opener)
    }
    pendingFocus.current = { windowId: id }
  }

  function activateWindow(id: string) {
    invokingControl.current = null
    pendingFocus.current = { windowId: id }
    raiseWindow(id)
  }

  function closeWindow(id: string) {
    invokingControl.current = null
    let opener = openers.current.get(id) ?? null
    const ownerId = opener?.closest<HTMLElement>('[data-window-id]')?.dataset.windowId
    if (ownerId && ownerId !== id && windows.some((item) => item.id === ownerId)) {
      // Re-enable an invoking window before restoring its child control on mobile.
      raiseWindow(ownerId)
    } else if (opener?.closest('.desktop-icons') && windows.some((item) => item.id !== id)) {
      opener = null // A remaining window may still cover the desktop shortcut.
    }
    pendingFocus.current = { element: opener }
    openers.current.delete(id)
    removeWindow(id)
  }

  function captureInvoker(event: MouseEvent<HTMLElement>) {
    // Pointer activation does not focus buttons in every browser (notably Safari).
    invokingControl.current = event.target instanceof Element
      ? event.target.closest<HTMLElement>('button, a')
      : null
  }

  return { isMobile, prepareOpen, activateWindow, closeWindow, captureInvoker }
}
