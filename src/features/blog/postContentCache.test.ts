import { afterEach, describe, expect, it, vi } from 'vitest'
import { createPostContentLoader } from './postContentCache'

afterEach(() => vi.useRealTimers())

describe('note body cache', () => {
  it('deduplicates concurrent reads and reuses successful bodies', async () => {
    const fetcher = vi.fn(async (id: string) => `${id} body`)
    const load = createPostContentLoader(fetcher)
    await expect(Promise.all([load('a'), load('a')])).resolves.toEqual(['a body', 'a body'])
    await expect(load('a')).resolves.toBe('a body')
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('does not cache failures, allowing retry', async () => {
    const fetcher = vi.fn().mockRejectedValueOnce(new Error('Offline')).mockResolvedValue('Recovered')
    const load = createPostContentLoader(fetcher)
    await expect(load('a')).rejects.toThrow('Offline')
    await expect(load('a')).resolves.toBe('Recovered')
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('refreshes expired bodies and bounds memory usage', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const fetcher = vi.fn(async (id: string) => id)
    const load = createPostContentLoader(fetcher)
    await load('a')
    vi.setSystemTime(300_001)
    await load('a')
    expect(fetcher).toHaveBeenCalledTimes(2)
    for (let i = 0; i < 50; i += 1) await load(`other-${i}`)
    await load('a')
    expect(fetcher).toHaveBeenCalledTimes(53)
  })
})
