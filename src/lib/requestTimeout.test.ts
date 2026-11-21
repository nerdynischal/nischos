import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CONTENT_REQUEST_TIMEOUT_MS, withRequestTimeout } from './requestTimeout'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('aborts a stalled request at the deadline', async () => {
  let requestSignal: AbortSignal | undefined
  const request = withRequestTimeout((signal) => {
    requestSignal = signal
    return new Promise((_, reject) => signal.addEventListener('abort', () => reject(new Error('Aborted'))))
  })
  const result = expect(request).rejects.toThrow('Aborted')
  await vi.advanceTimersByTimeAsync(CONTENT_REQUEST_TIMEOUT_MS - 1)
  expect(requestSignal?.aborted).toBe(false)
  await vi.advanceTimersByTimeAsync(1)
  await result
  expect(requestSignal?.aborted).toBe(true)
  expect(vi.getTimerCount()).toBe(0)
})

it('clears the deadline when a request succeeds or fails early', async () => {
  await expect(withRequestTimeout(async () => 'Content')).resolves.toBe('Content')
  expect(vi.getTimerCount()).toBe(0)
  await expect(withRequestTimeout(async () => { throw new Error('Offline') })).rejects.toThrow('Offline')
  expect(vi.getTimerCount()).toBe(0)
})
