// @vitest-environment jsdom
import { act, StrictMode, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ImageZoomButton, LegacyImageLightbox, type ImageViewerSelection } from './LegacyImageViewer'

let root: Root
let container: HTMLDivElement
let originalOverflow: string
const image = { src: '/cover.png', alt: 'Project cover', caption: 'Cover' }

function Harness() {
  const [selection, setSelection] = useState<ImageViewerSelection | null>(null)
  return <div className="window-body">
    <ImageZoomButton image={image} onOpen={setSelection} />
    {selection && <LegacyImageLightbox selection={selection} onClose={() => setSelection(null)} />}
  </div>
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  // jsdom does not implement native dialog behavior. Browser checks cover
  // actual top-layer placement, background inertness and keyboard containment.
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.open = true
  })
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false
  })
  originalOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'auto'
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<StrictMode><Harness /></StrictMode>))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  document.documentElement.style.overflow = originalOverflow
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
  Reflect.deleteProperty(HTMLDialogElement.prototype, 'close')
  vi.unstubAllGlobals()
})

function openViewer() {
  const trigger = container.querySelector('button')!
  act(() => { trigger.focus(); trigger.click() })
  return trigger
}

it('opens in the native modal top layer outside the transformed window', () => {
  openViewer()
  const dialog = document.querySelector('dialog')!
  expect(dialog.parentElement).toBe(document.body)
  expect(dialog.open).toBe(true)
  expect(dialog.showModal).toHaveBeenCalled()
  expect(document.activeElement).toBe(dialog.querySelector('button'))
  expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('Cover')
  expect(document.documentElement.style.overflow).toBe('hidden')
  // Native close events are queued; StrictMode's cleanup may queue one before
  // replaying setup. A stale event must not dismiss the reopened modal.
  act(() => dialog.dispatchEvent(new Event('close')))
  expect(document.querySelector('dialog')?.open).toBe(true)
})

it('handles Escape cancellation and restores the trigger and scroll styling', () => {
  const trigger = openViewer()
  const cancel = new Event('cancel', { cancelable: true })
  act(() => document.querySelector('dialog')!.dispatchEvent(cancel))
  expect(cancel.defaultPrevented).toBe(true)
  expect(document.querySelector('dialog')).toBeNull()
  expect(document.activeElement).toBe(trigger)
  expect(document.documentElement.style.overflow).toBe('auto')
})

it('keeps image clicks open and dismisses through the close button', () => {
  const trigger = openViewer()
  act(() => document.querySelector('dialog img')!.dispatchEvent(new MouseEvent('click', { bubbles: true })))
  expect(document.querySelector('dialog')?.open).toBe(true)
  act(() => document.querySelector<HTMLButtonElement>('dialog button')!.click())
  expect(document.querySelector('dialog')).toBeNull()
  expect(document.activeElement).toBe(trigger)
})

it('dismisses on the surrounding surface and can reopen cleanly', () => {
  const trigger = openViewer()
  act(() => document.querySelector('dialog')!.click())
  expect(document.activeElement).toBe(trigger)
  openViewer()
  expect(document.querySelector('dialog')?.open).toBe(true)
  act(() => root.render(null))
  expect(document.querySelector('dialog')).toBeNull()
  expect(document.documentElement.style.overflow).toBe('auto')
})
