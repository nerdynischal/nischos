import { describe, expect, it } from 'vitest'
import { getSupabaseLoadStatus } from './usePortfolioContent'

describe('Supabase load status', () => {
  it('reports connected only when every content collection loads', () => {
    expect(
      getSupabaseLoadStatus([
        { status: 'fulfilled', value: [{}] },
        { status: 'fulfilled', value: [{}] },
        { status: 'fulfilled', value: [{}] },
      ]),
    ).toBe('connected')
  })

  it('reports fallback when a request fails or returns no content', () => {
    expect(
      getSupabaseLoadStatus([
        { status: 'fulfilled', value: [{}] },
        { status: 'rejected', reason: new Error('Unavailable') },
      ]),
    ).toBe('fallback')

    expect(
      getSupabaseLoadStatus([
        { status: 'fulfilled', value: [{}] },
        { status: 'fulfilled', value: [] },
      ]),
    ).toBe('fallback')
  })
})
