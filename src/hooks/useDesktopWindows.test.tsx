// @vitest-environment jsdom
import { act, useLayoutEffect, type PointerEvent } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDesktopWindows } from './useDesktopWindows'

let root: Root
let container: HTMLDivElement
let frame: HTMLElement
let handle: HTMLElement
let desktop: ReturnType<typeof useDesktopWindows>
let renders: number
let nextFrame: number
let frames: Map<number, FrameRequestCallback>

function Harness() {
  const state = useDesktopWindows()
  useLayoutEffect(() => {
    desktop = state
    renders += 1
  })
  return null
}

function pointer(type: string, x: number, y = 80) {
  return { type, button: 0, pointerId: 1, clientX: x, clientY: y, currentTarget: handle } as PointerEvent<HTMLElement>
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('innerWidth', 1280)
  vi.stubGlobal('innerHeight', 720)
  frames = new Map()
  nextFrame = 0
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => {
    frames.set(++nextFrame, callback)
    return nextFrame
  }))
  vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => frames.delete(id)))
  container = document.createElement('div')
  document.body.append(container)
  frame = document.createElement('article')
  frame.className = 'window'
  frame.getBoundingClientRect = () => ({ width: 900, height: 570 } as DOMRect)
  handle = document.createElement('header')
  Object.assign(handle, {
    setPointerCapture: vi.fn(),
    hasPointerCapture: () => true,
    releasePointerCapture: vi.fn(),
  })
  frame.append(handle)
  container.append(frame)
  renders = 0
  root = createRoot(document.createElement('div'))
  act(() => root.render(<Harness />))
  act(() => desktop.upsertWindow({ id: 'settings', category: 'settings', title: 'About' }))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('window dragging', () => {
  it('coalesces pointer moves without rerendering content and commits the release position', () => {
    const before = renders
    desktop.startDrag(pointer('pointerdown', 100), desktop.windows[0])
    for (let x = 101; x <= 200; x += 1) desktop.moveDrag(pointer('pointermove', x))
    expect(frames.size).toBe(1)
    expect(renders).toBe(before)
    const [id, callback] = [...frames][0]
    frames.delete(id)
    callback(16)
    expect(frame.style.getPropertyValue('--window-x')).toBe('117px')
    expect(renders).toBe(before)

    act(() => desktop.endDrag(pointer('pointerup', 220)))
    expect(desktop.windows[0].x).toBe(137)
    expect(frames.size).toBe(0)
    expect(renders).toBe(before + 1)
  })

  it('clamps using the resized DOM dimensions instead of the original window size', () => {
    desktop.startDrag(pointer('pointerdown', 100), desktop.windows[0])
    act(() => desktop.endDrag(pointer('pointerup', 2000)))
    expect(desktop.windows[0].width).toBe(900)
    expect(desktop.windows[0].x + desktop.windows[0].width).toBe(1272)
  })

  it('flushes a cancelled gesture and ignores subsequent lost-capture events', () => {
    desktop.startDrag(pointer('pointerdown', 100), desktop.windows[0])
    desktop.moveDrag(pointer('pointermove', 140))
    act(() => desktop.endDrag(pointer('pointercancel', 0)))
    expect(desktop.windows[0].x).toBe(57)
    expect(frames.size).toBe(0)
    const before = renders
    act(() => desktop.endDrag(pointer('lostpointercapture', 0)))
    expect(renders).toBe(before)
  })
})
