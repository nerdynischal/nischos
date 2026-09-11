import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const query = vi.hoisted(() => ({
  from: vi.fn(), select: vi.fn(), order: vi.fn(), eq: vi.fn(),
  abortSignal: vi.fn(), maybeSingle: vi.fn(),
}))
vi.mock('@supabase/supabase-js', () => ({ createClient: () => query }))

beforeEach(() => {
  vi.resetModules()
  vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
  vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test-public-key')
  query.from.mockReturnValue(query)
  query.select.mockReturnValue(query)
  query.eq.mockReturnValue(query)
  query.abortSignal.mockReturnValue(query)
})
afterEach(() => { vi.unstubAllEnvs(); vi.clearAllMocks() })

describe('note queries', () => {
  it('requests metadata only for the desktop list', async () => {
    query.order.mockResolvedValue({ data: [{
      id: 'note', title: 'Note', date: '2026-09-10', folder: null, is_pinned: false,
    }], error: null })
    const { fetchPostSummaries } = await import('./supabase')
    const summaries = await fetchPostSummaries()
    expect(query.select).toHaveBeenCalledWith('id,title,date,folder,is_pinned')
    expect(summaries[0]).not.toHaveProperty('contentMarkdown')
    expect(summaries[0].folder).toBe('Notes')
  })

  it('requests only the selected note body and reports missing notes', async () => {
    query.maybeSingle.mockResolvedValueOnce({ data: { content_markdown: '# Selected note' }, error: null })
      .mockResolvedValueOnce({ data: null, error: null })
    const { fetchPostContent } = await import('./supabase')
    await expect(fetchPostContent('selected-id')).resolves.toBe('# Selected note')
    expect(query.select).toHaveBeenCalledWith('content_markdown')
    expect(query.eq).toHaveBeenCalledWith('id', 'selected-id')
    expect(query.abortSignal).toHaveBeenCalledWith(expect.any(AbortSignal))
    await expect(fetchPostContent('deleted-id')).rejects.toThrow('Note not found')
  })
})
