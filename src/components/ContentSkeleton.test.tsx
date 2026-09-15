// @vitest-environment jsdom
import { act, StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { NoteSkeleton, SkeletonFrame } from './ContentSkeleton'

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
  act(() => root.render(<StrictMode><NoteSkeleton /></StrictMode>))
  expect(container.querySelector('[role="status"]')?.textContent).toBe('')
  act(() => vi.advanceTimersByTime(179))
  expect(container.querySelector('.content-skeleton')?.getAttribute('data-visible')).toBe('false')
  act(() => vi.advanceTimersByTime(1))
  expect(container.querySelector('[role="status"]')?.textContent).toBe('Loading note…')
  expect(container.querySelector('.skeleton-shapes')?.getAttribute('aria-hidden')).toBe('true')
  expect(container.querySelector('.content-skeleton')?.getAttribute('data-visible')).toBe('true')
  act(() => root.render(<p>Content ready</p>))
  expect(container.querySelector('[role="status"]')).toBeNull()
  expect(vi.getTimerCount()).toBe(0)
})

it('cancels the timer when content arrives before the delay', () => {
  act(() => root.render(<NoteSkeleton />))
  act(() => vi.advanceTimersByTime(100))
  act(() => root.render(<p>Cached note</p>))
  expect(vi.getTimerCount()).toBe(0)
  act(() => vi.advanceTimersByTime(180))
  expect(container.textContent).toBe('Cached note')
})

it('starts a fresh delay when the selected note changes', () => {
  act(() => root.render(<NoteSkeleton key="first" />))
  act(() => vi.advanceTimersByTime(180))
  expect(container.querySelector('.content-skeleton')?.getAttribute('data-visible')).toBe('true')
  act(() => root.render(<NoteSkeleton key="second" />))
  expect(container.querySelector('.content-skeleton')?.getAttribute('data-visible')).toBe('false')
  act(() => vi.advanceTimersByTime(180))
  expect(container.querySelector('.content-skeleton')?.getAttribute('data-visible')).toBe('true')
})

it('does not render the placeholder subtree for fast loads', () => {
  const renderPlaceholder = vi.fn()
  function Placeholder() {
    renderPlaceholder()
    return <div>Placeholder</div>
  }
  act(() => root.render(<SkeletonFrame label="Loading"><Placeholder /></SkeletonFrame>))
  act(() => vi.advanceTimersByTime(179))
  expect(renderPlaceholder).not.toHaveBeenCalled()
  expect(container.querySelector('.skeleton-shapes')).toBeNull()
  act(() => root.render(<p>Ready</p>))
  act(() => vi.advanceTimersByTime(1))
  expect(renderPlaceholder).not.toHaveBeenCalled()
})
