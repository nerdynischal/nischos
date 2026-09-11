// @vitest-environment jsdom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { LoadingIndicator } from './LoadingIndicator'

let root: Root
let container: HTMLDivElement

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

it('announces and shows a slow load only after 180 ms, including in Strict Mode', () => {
  act(() => root.render(<StrictMode><LoadingIndicator label="Opening Notes…" /></StrictMode>))
  expect(container.querySelector('[role="status"]')?.textContent).toBe('')
  act(() => vi.advanceTimersByTime(179))
  expect(container.querySelector('svg')).toBeNull()
  act(() => vi.advanceTimersByTime(1))
  expect(container.querySelector('[role="status"]')?.textContent).toBe('Opening Notes…')
  expect(container.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
  act(() => root.render(<p>Content ready</p>))
  expect(container.querySelector('[role="status"]')).toBeNull()
  expect(vi.getTimerCount()).toBe(0)
})

it('cancels the timer when content arrives before the delay', () => {
  act(() => root.render(<LoadingIndicator label="Loading note…" />))
  act(() => vi.advanceTimersByTime(100))
  act(() => root.render(<p>Cached note</p>))
  expect(vi.getTimerCount()).toBe(0)
  act(() => vi.advanceTimersByTime(180))
  expect(container.textContent).toBe('Cached note')
})

it('starts a fresh delay when the selected note changes', () => {
  act(() => root.render(<LoadingIndicator key="first" label="Loading note…" />))
  act(() => vi.advanceTimersByTime(180))
  expect(container.querySelector('svg')).not.toBeNull()
  act(() => root.render(<LoadingIndicator key="second" label="Loading note…" />))
  expect(container.querySelector('svg')).toBeNull()
  act(() => vi.advanceTimersByTime(180))
  expect(container.querySelector('svg')).not.toBeNull()
})
