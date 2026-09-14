// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { useMobileScrollLock } from './useMobileScrollLock'

it('locks mobile scrolling and restores styles and position on resize or close', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  let onChange = () => {}
  const media = {
    matches: true,
    addEventListener: vi.fn((_event, callback) => { onChange = callback }),
    removeEventListener: vi.fn(),
  }
  vi.stubGlobal('matchMedia', vi.fn(() => media))
  vi.stubGlobal('scrollY', 120)
  const scrollTo = vi.fn()
  vi.stubGlobal('scrollTo', scrollTo)
  const container = document.createElement('div')
  const root = createRoot(container)
  const originalStyle = document.body.style.cssText
  document.body.style.overflow = 'auto'
  function Harness({ locked }: { locked: boolean }) {
    useMobileScrollLock(locked)
    return null
  }
  try {
    act(() => root.render(<Harness locked />))
    expect(document.body.style.position).toBe('fixed')
    expect(document.body.style.top).toBe('-120px')
    media.matches = false
    act(() => onChange())
    expect(document.body.style.position).toBe('')
    expect(document.body.style.overflow).toBe('auto')
    expect(scrollTo).toHaveBeenLastCalledWith(0, 120)
    media.matches = true
    act(() => onChange())
    expect(document.body.style.position).toBe('fixed')
    act(() => root.render(<Harness locked={false} />))
    expect(document.body.style.position).toBe('')
    expect(document.body.style.overflow).toBe('auto')
    expect(media.removeEventListener).toHaveBeenCalledWith('change', onChange)
  } finally {
    act(() => root.unmount())
    document.body.style.cssText = originalStyle
    vi.unstubAllGlobals()
  }
})
