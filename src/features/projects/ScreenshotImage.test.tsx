// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { ScreenshotImage } from './ScreenshotImage'

let host: HTMLDivElement
let root: Root
let pending: { resolve: () => void; reject: (error: Error) => void }[]
const onError = vi.fn()

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', () => ({ matches: true }))
  pending = []
  vi.stubGlobal('Image', class {
    decode() {
      return new Promise<void>((resolve, reject) => pending.push({ resolve, reject }))
    }
  })
  host = document.createElement('div')
  root = createRoot(host)
  onError.mockReset()
})
afterEach(() => {
  act(() => root.unmount())
  vi.unstubAllGlobals()
})

function render(source: string, alt = source) {
  act(() => root.render(<ScreenshotImage source={source} alt={alt} direction="next" onError={onError} />))
}

it('reports the failing visible asset while a replacement is decoding', async () => {
  render('/first.png')
  render('/second.png')
  act(() => host.querySelector('img')!.dispatchEvent(new Event('error')))
  expect(onError).toHaveBeenLastCalledWith('/first.png')
  await act(async () => pending[0].resolve())
  expect(host.querySelector('img')?.getAttribute('src')).toBe('/second.png')
})

it('ignores a late decoding failure after the selection changes', async () => {
  render('/first.png')
  render('/second.png')
  render('/third.png')
  await act(async () => pending[0].reject(new Error('Old image failed')))
  expect(onError).not.toHaveBeenCalled()
  await act(async () => pending[1].resolve())
  expect(host.querySelector('img')?.getAttribute('src')).toBe('/third.png')
})

it('refreshes alternative text when remote metadata changes for the same asset', () => {
  render('/first.png', 'Old description')
  render('/first.png', 'Reviewed description')
  expect(host.querySelector('img')?.alt).toBe('Reviewed description')
})
