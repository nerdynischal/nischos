// @vitest-environment jsdom
import { act, useLayoutEffect } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { posts } from '../../content'
import type { BlogPostSummary } from '../../content/types'
import { loadPostContent } from './postContentCache'
import { usePostContent } from './usePostContent'

vi.mock('./postContentCache', () => ({ loadPostContent: vi.fn() }))

const note = (id: string): BlogPostSummary => ({ id, title: id, date: '2026-09-10', folder: 'Notes', isPinned: false })
let root: Root
let content: ReturnType<typeof usePostContent>

function Harness({ post }: { post?: BlogPostSummary }) {
  const state = usePostContent(post)
  useLayoutEffect(() => { content = state })
  return null
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.mocked(loadPostContent).mockReset()
  root = createRoot(document.createElement('div'))
})
afterEach(() => {
  act(() => root.unmount())
  vi.unstubAllGlobals()
})

describe('selected note loading', () => {
  it('makes no body request without a selection or for a local fallback', async () => {
    await act(async () => root.render(<Harness />))
    expect(loadPostContent).not.toHaveBeenCalled()
    await act(async () => root.render(<Harness post={posts[0]} />))
    expect(content.status).toBe('ready')
    expect(content.markdown).toBe(posts[0].contentMarkdown)
    expect(loadPostContent).not.toHaveBeenCalled()
  })

  it('never displays a slow previous response beneath the new selection', async () => {
    let resolveFirst!: (body: string) => void
    vi.mocked(loadPostContent)
      .mockReturnValueOnce(new Promise<string>((resolve) => { resolveFirst = resolve }))
      .mockResolvedValueOnce('Second body')
    await act(async () => root.render(<Harness post={note('first')} />))
    expect(content.status).toBe('loading')
    await act(async () => root.render(<Harness post={note('second')} />))
    expect(content.markdown).toBe('Second body')
    await act(async () => resolveFirst('Late first body'))
    expect(content.markdown).toBe('Second body')
  })

  it('uses a matching local body on failure', async () => {
    vi.mocked(loadPostContent).mockRejectedValue(new Error('Offline'))
    await act(async () => root.render(<Harness post={note(posts[0].id)} />))
    expect(content.status).toBe('fallback')
    expect(content.markdown).toBe(posts[0].contentMarkdown)
  })

  it('supports retry for remote-only notes and accepts an intentionally empty body', async () => {
    vi.mocked(loadPostContent).mockRejectedValueOnce(new Error('Offline')).mockResolvedValueOnce('')
    await act(async () => root.render(<Harness post={note('remote-only')} />))
    expect(content.status).toBe('error')
    await act(async () => content.retry())
    expect(content.status).toBe('ready')
    expect(content.markdown).toBe('')
    expect(loadPostContent).toHaveBeenCalledTimes(2)
  })
})
