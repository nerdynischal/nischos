// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./desktop/DesktopExperience', () => ({
  DesktopExperience: ({ isPreparing }: { isPreparing: boolean }) => (
    <main data-testid="desktop" hidden={isPreparing} inert={isPreparing} />
  ),
}))
vi.mock('./features/entry/LockScreen', () => ({
  LockScreen: ({ onEnter, isLoading }: { onEnter: () => void; isLoading: boolean }) => (
    <button onClick={onEnter} disabled={isLoading}>Unlock</button>
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
  it('mounts an inert desktop immediately and completes entry after 660 ms', () => {
    act(() => root.render(<App />))
    expect(container.querySelector('main')).toBeNull()
    act(() => container.querySelector('button')!.click())
    expect(container.querySelector('main')!.hidden).toBe(true)
    expect(container.querySelector('main')!.hasAttribute('inert')).toBe(true)
    act(() => vi.advanceTimersByTime(300))
    expect(container.querySelector('main')!.hidden).toBe(false)
    act(() => vi.advanceTimersByTime(360))
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
