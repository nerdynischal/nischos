import { useEffect } from 'react'

export function useMobileScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const media = window.matchMedia('(max-width: 760px)')
    let unlock: (() => void) | undefined

    function updateLock() {
      if (!media.matches) {
        unlock?.()
        unlock = undefined
        return
      }
      if (unlock) return

      const { style } = document.body
      const previous = {
        position: style.position,
        top: style.top,
        width: style.width,
        overflow: style.overflow,
      }
      const scrollX = window.scrollX
      const scrollY = window.scrollY
      style.position = 'fixed'
      style.top = `-${scrollY}px`
      style.width = '100%'
      style.overflow = 'hidden'

      unlock = () => {
        Object.assign(style, previous)
        window.scrollTo(scrollX, scrollY)
      }
    }

    updateLock()
    media.addEventListener('change', updateLock)
    return () => {
      media.removeEventListener('change', updateLock)
      unlock?.()
    }
  }, [locked])
}
