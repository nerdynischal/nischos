// @vitest-environment jsdom
import { act, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { posts, projects, settingsSections } from '../content'
import { fetchPostSummaries, fetchProjects, fetchSettingsSections } from '../lib/supabase'
import { usePortfolioContent } from './usePortfolioContent'

vi.mock('../lib/supabase', async (importOriginal) => ({
  ...await importOriginal<typeof import('../lib/supabase')>(),
  hasSupabaseConfig: true,
  fetchProjects: vi.fn(),
  fetchPostSummaries: vi.fn(),
  fetchSettingsSections: vi.fn(),
}))

afterEach(() => vi.unstubAllGlobals())

describe('independent portfolio loading', () => {
  it('shows ready projects while notes are still pending, retaining fallbacks for empty collections', async () => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    const remoteProject = { ...projects[0], title: 'Fresh remote title' }
    let resolvePosts!: (value: typeof posts) => void
    const delayedPosts = new Promise<typeof posts>((resolve) => { resolvePosts = resolve })
    vi.mocked(fetchProjects).mockResolvedValue([remoteProject])
    vi.mocked(fetchPostSummaries).mockReturnValue(delayedPosts)
    vi.mocked(fetchSettingsSections).mockResolvedValue([])

    let content: ReturnType<typeof usePortfolioContent> | undefined
    function Harness() {
      const state = usePortfolioContent()
      useLayoutEffect(() => { content = state })
      return null
    }
    const root = createRoot(document.createElement('div'))
    try {
      await act(async () => root.render(<Harness />))
      expect(content!.projects.find((project) => project.id === remoteProject.id)?.title)
        .toBe('Fresh remote title')
      expect(content!.posts).toEqual(posts)
      expect(content!.settingsSections).toEqual(settingsSections)
      expect(content!.supabaseStatus).toBe('loading')

      await act(async () => resolvePosts(posts))
      expect(content!.supabaseStatus).toBe('fallback')
    } finally {
      act(() => root.unmount())
    }
  })
})
