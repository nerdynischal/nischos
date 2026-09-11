// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./desktop/DesktopExperience', () => ({
  DesktopExperience: ({ isPreparing }: { isPreparing: boolean }) => (
    <main data-testid="desktop" aria-hidden={isPreparing || undefined} inert={isPreparing} />
  ),
}))
vi.mock('./features/entry/LockScreen', () => ({
  LockScreen: ({ onEnter, onExitComplete, isLoading }: { onEnter: () => void; onExitComplete: () => void; isLoading: boolean }) => (
    <button onClick={onEnter} onTransitionEnd={onExitComplete} disabled={isLoading}>Unlock</button>
  ),
}))

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
  vi.useFakeTimers()
  window.sessionStorage.clear()
  container = document.createElement('div')
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('desktop entry preparation', () => {
  it('prepares the desktop before revealing it and waits for transition completion', () => {
    act(() => root.render(<App />))
    expect(container.querySelector('main')).toBeNull()
    act(() => container.querySelector('button')!.click())
    expect(container.querySelector('main')!.getAttribute('aria-hidden')).toBe('true')
    expect(container.querySelector('main')!.hidden).toBe(false)
    expect(container.querySelector('main')!.hasAttribute('inert')).toBe(true)
    act(() => vi.advanceTimersByTime(300))
    expect(container.querySelector('main')!.hasAttribute('inert')).toBe(true)
    act(() => vi.advanceTimersToNextFrame())
    act(() => vi.advanceTimersToNextFrame())
    expect(container.querySelector('main')!.hidden).toBe(false)
    act(() => vi.advanceTimersByTime(360))
    expect(container.querySelector('button')).not.toBeNull()
    act(() => container.querySelector('button')!.dispatchEvent(new Event('transitionend', { bubbles: true })))
    expect(container.querySelector('button')).toBeNull()
  })

  it('enters immediately with reduced motion', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    act(() => root.render(<App />))
    act(() => container.querySelector('button')!.click())
    expect(container.querySelector('main')!.hidden).toBe(false)
    expect(container.querySelector('button')).toBeNull()
  })
})
