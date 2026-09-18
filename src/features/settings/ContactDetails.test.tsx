// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ContactDetails } from './ContactDetails'

let container: HTMLDivElement
let root: Root
let writeText: ReturnType<typeof vi.fn>
const email = 'hello@example.test'
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard')

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(<ContactDetails details={[
    { label: 'Email', value: email },
    { label: 'GitHub', value: 'github.com/example', href: 'https://github.com/example' },
  ]} />))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard)
  else Reflect.deleteProperty(navigator, 'clipboard')
  vi.unstubAllGlobals()
})

async function copy() {
  const button = container.querySelector('button')!
  await act(async () => { button.focus(); button.click() })
  return button
}

it('updates an existing accessible status on success without moving focus', async () => {
  const status = container.querySelector('[role="status"]')!
  expect(status.textContent).toBe('')
  const button = await copy()
  expect(writeText).toHaveBeenCalledWith(email)
  expect(container.querySelector('[role="status"]')).toBe(status)
  expect(status.closest('[aria-hidden="true"]')).toBeNull()
  expect(status.textContent).toBe('Email copied.')
  expect(document.activeElement).toBe(button)
  expect(container.querySelector('textarea')).toBeNull()
  const previousMessage = status.firstChild
  await copy()
  expect(status.firstChild).not.toBe(previousMessage)
  expect(status.textContent).toBe('Email copied.')
})

it('exposes an error and selectable manual fallback, then clears it after a successful retry', async () => {
  writeText.mockRejectedValueOnce(new Error('Permission denied'))
  const button = await copy()
  expect(document.activeElement).toBe(button)
  expect(container.querySelector('[role="status"]')?.textContent).toContain('Couldn’t copy email.')
  const field = container.querySelector('textarea')!
  expect(field.value).toBe(email)
  expect(field.readOnly).toBe(true)
  expect(container.querySelector('label')?.htmlFor).toBe(field.id)
  act(() => field.focus())
  expect(field.selectionStart).toBe(0)
  expect(field.selectionEnd).toBe(email.length)
  await copy()
  expect(container.querySelector('textarea')).toBeNull()
  expect(container.querySelector('[role="status"]')?.textContent).toBe('Email copied.')
})

it('offers the same fallback when the Clipboard API is unavailable', async () => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
  await copy()
  expect(container.querySelector('textarea')?.value).toBe(email)
  expect(container.querySelector('[role="status"]')?.textContent).toContain('copy it manually')
})

it('prevents duplicate in-flight requests without disabling the focused button', async () => {
  let resolveCopy!: () => void
  writeText.mockReturnValue(new Promise<void>((resolve) => { resolveCopy = resolve }))
  const button = await copy()
  expect(button.disabled).toBe(false)
  expect(button.getAttribute('aria-disabled')).toBe('true')
  expect(container.querySelector('[role="status"]')?.textContent).toBe('Copying email…')
  await copy()
  expect(writeText).toHaveBeenCalledTimes(1)
  await act(async () => resolveCopy())
  expect(button.hasAttribute('aria-disabled')).toBe(false)
  expect(document.activeElement).toBe(button)
})

it('shows a five-second toast while retaining the accessible success message', async () => {
  vi.useFakeTimers()
  try {
    const button = await copy()
    const toast = container.querySelector<HTMLElement>('.contact-copy-toast')!
    const status = container.querySelector('[role="status"]')!
    expect(toast.dataset.visible).toBe('true')
    expect(toast.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(status.classList.contains('contact-copy-status--announcement')).toBe(true)
    act(() => vi.advanceTimersByTime(4000))
    await copy()
    act(() => vi.advanceTimersByTime(4000))
    expect(toast.dataset.visible).toBe('true')
    act(() => vi.advanceTimersByTime(1000))
    expect(toast.dataset.visible).toBe('false')
    expect(status.textContent).toBe('Email copied.')
    expect(document.activeElement).toBe(button)
  } finally {
    vi.useRealTimers()
  }
})
