import { useEffect, useState } from 'react'
import { posts as fallbackPosts } from '../../content'
import type { BlogPostSummary } from '../../content/types'
import { loadPostContent } from './postContentCache'

type ContentState = {
  id: string
  attempt: number
  status: 'ready' | 'fallback' | 'error'
  markdown: string
}

export function usePostContent(post: BlogPostSummary | undefined) {
  const [state, setState] = useState<ContentState | null>(null)
  const [attempt, setAttempt] = useState(0)
  const id = post?.id
  const localMarkdown = post?.contentMarkdown

  useEffect(() => {
    if (!id || localMarkdown !== undefined) return
    let ignore = false
    void loadPostContent(id).then((markdown) => {
      if (!ignore) setState({ id, attempt, status: 'ready', markdown })
    }).catch(() => {
      if (ignore) return
      const fallback = fallbackPosts.find((item) => item.id === id)
      setState({
        id,
        attempt,
        status: fallback ? 'fallback' : 'error',
        markdown: fallback?.contentMarkdown ?? '',
      })
    })
    return () => { ignore = true }
  }, [id, localMarkdown, attempt])

  const content = localMarkdown !== undefined
    ? { status: 'ready' as const, markdown: localMarkdown }
    : state?.id === id && state !== null && state.attempt === attempt
      ? state
      : { status: 'loading' as const, markdown: '' }

  return { ...content, retry: () => setAttempt((value) => value + 1) }
}
