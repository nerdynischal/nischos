// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useDockMagnification } from './useDockMagnification'

let container: HTMLDivElement
let root: Root
let frames: Map<number, FrameRequestCallback>
let frameId: number

function Harness() {
  const { dockRef, tooltipRef, tooltip, handlePointerMove, handlePointerLeave, handleItemFocus, handleItemBlur } = useDockMagnification()
  return <nav ref={dockRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
    {['First', 'Second'].map((label) => <button key={label} className="dock-item"
      data-dock-id={label} data-dock-label={label}
      onFocus={handleItemFocus} onBlur={handleItemBlur}>{label}</button>)}
    <span ref={tooltipRef} data-visible={tooltip !== null} aria-hidden="true">{tooltip?.label}</span>
  </nav>
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
  frames = new Map()
  frameId = 0
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.set(++frameId, callback)
    return frameId
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => frames.delete(id))
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<Harness />))
  container.querySelectorAll('button').forEach((button, index) => {
    Object.defineProperties(button, {
      offsetWidth: { value: 50 },
      offsetLeft: { value: index * 60 },
    })
  })
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

function move(target: Element, clientX = 25, pointerType = 'mouse') {
  act(() => {
    const event = new MouseEvent('pointermove', { bubbles: true, clientX })
    Object.defineProperty(event, 'pointerType', { value: pointerType })
    target.dispatchEvent(event)
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((callback) => callback(0))
  })
}
function escape() {
  act(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
}
function tooltip() { return container.querySelector('span')! }
function buttons() { return container.querySelectorAll('button') }

it('keeps the tooltip steady when hovered, and hides it after leaving both tooltip and dock', () => {
  move(buttons()[0])
  expect(tooltip().textContent).toBe('First')
  const left = tooltip().style.left
  move(tooltip(), 90)
  expect(tooltip().textContent).toBe('First')
  expect(tooltip().style.left).toBe(left)
  move(document.body)
  expect(tooltip().dataset.visible).toBe('false')
})

it('dismisses pointer tooltips until the target changes or the pointer leaves and returns', () => {
  move(buttons()[0])
  escape()
  move(buttons()[0])
  expect(tooltip().dataset.visible).toBe('false')
  move(buttons()[1], 85)
  expect(tooltip().textContent).toBe('Second')
  move(buttons()[0])
  expect(tooltip().textContent).toBe('First')
  escape()
  move(document.body)
  move(buttons()[0])
  expect(tooltip().textContent).toBe('First')
})

it('persists with keyboard focus and dismisses without moving focus or reopening on mouse movement', () => {
  act(() => buttons()[0].focus())
  move(document.body)
  expect(tooltip().textContent).toBe('First')
  escape()
  expect(document.activeElement).toBe(buttons()[0])
  move(buttons()[0])
  move(document.body)
  expect(tooltip().dataset.visible).toBe('false')
  act(() => buttons()[1].focus())
  expect(tooltip().textContent).toBe('Second')
  expect(tooltip().getAttribute('aria-hidden')).toBe('true')
})

it('keeps a hovered tooltip after focus leaves until the pointer also leaves', () => {
  act(() => buttons()[0].focus())
  move(tooltip())
  act(() => buttons()[0].blur())
  expect(tooltip().textContent).toBe('First')
  move(document.body)
  expect(tooltip().dataset.visible).toBe('false')
})

it('ignores touch movement and cancels a pending animation frame on unmount', () => {
  move(buttons()[0], 25, 'touch')
  expect(tooltip().dataset.visible).toBe('false')
  act(() => {
    const event = new MouseEvent('pointermove', { bubbles: true, clientX: 25 })
    Object.defineProperty(event, 'pointerType', { value: 'mouse' })
    buttons()[0].dispatchEvent(event)
  })
  expect(frames.size).toBe(1)
  act(() => root.render(null))
  expect(frames.size).toBe(0)
})
