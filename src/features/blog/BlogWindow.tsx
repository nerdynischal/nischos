import { useContext, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPostSummary } from '../../content/types'
import { EmptyState } from '../../components/EmptyState'
import { NoteSkeleton } from '../../components/ContentSkeleton'
import { getPostMarkdown } from './getPostMarkdown'
import { usePostContent } from './usePostContent'
import { WindowTitleContext } from '../../windows/WindowTitleContext'

const markdownHeadingComponents = {
  h1: 'h4',
  h2: 'h4',
  h3: 'h5',
  h4: 'h6',
  h5: 'h6',
  h6: 'h6',
} as const

export function BlogWindow({
  posts,
  selectedPostId,
  onSelectPost,
}: {
  posts: BlogPostSummary[]
  selectedPostId?: string
  onSelectPost: (postId?: string) => void
}) {
  const [hasMobileNavigation, setHasMobileNavigation] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const previousPostId = useRef(selectedPostId)
  const setMobileTitle = useContext(WindowTitleContext)
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? posts[0]
  const showMobileDetail = Boolean(selectedPostId && selectedPost)

  useEffect(() => {
    setMobileTitle?.(showMobileDetail ? selectedPost?.title ?? null : null)
    return () => setMobileTitle?.(null)
  }, [setMobileTitle, showMobileDetail, selectedPost?.title])

  useEffect(() => {
    if (window.matchMedia('(max-width: 760px)').matches) {
      if (selectedPostId) {
        backRef.current?.focus()
        const reader = containerRef.current?.querySelector('.blog-reader')
        if (reader) reader.scrollTop = 0
      } else if (previousPostId.current) {
        const rows = containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-post-id]')
        Array.from(rows ?? []).find((row) => row.dataset.postId === previousPostId.current)?.focus()
      }
    }
    previousPostId.current = selectedPostId
  }, [selectedPostId])
  const content = usePostContent(selectedPost)
  const postMarkdown = selectedPost
    ? getPostMarkdown({ ...selectedPost, contentMarkdown: content.markdown })
    : ''

  if (!selectedPost) {
    return <EmptyState title="No notes yet" body="This folder is waiting for its first note." />
  }

  return (
    <div ref={containerRef} className="finder" data-mobile-detail={showMobileDetail} data-mobile-navigation={hasMobileNavigation}>
      <aside className="finder-sidebar blog-post-nav" aria-label="Notes">
        <p className="sidebar-title">Notes</p>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            data-post-id={post.id}
            className={post.id === selectedPost?.id ? 'is-selected' : ''}
            onClick={() => {
              setHasMobileNavigation(true)
              onSelectPost(post.id)
            }}
            aria-current={post.id === selectedPost?.id ? 'page' : undefined}
          >
            <span className="post-title">{post.title}</span>
            {post.isPinned ? <span className="post-pin">Pinned</span> : null}
            <ChevronRight className="notes-row-chevron" aria-hidden="true" />
          </button>
        ))}
      </aside>
      <section className="blog-reader" aria-label="Selected note">
        {selectedPost ? (
          <article className="blog-reader-post">
            <button
              ref={backRef}
              type="button"
              className="notes-mobile-back"
              aria-label="Back to notes"
              onClick={() => {
                setHasMobileNavigation(true)
                onSelectPost(undefined)
              }}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <header>
              <p>
                {selectedPost.folder} ·{' '}
                <time dateTime={selectedPost.date}>{selectedPost.date}</time>
              </p>
              <h3>{selectedPost.title}</h3>
            </header>
            {content.status === 'loading' ? (
              <NoteSkeleton key={selectedPost.id} />
            ) : content.status === 'error' ? (
              <div className="note-load-status" role="status">
                <p>This note could not be loaded.</p>
                <button type="button" onClick={content.retry}>Try again</button>
              </div>
            ) : (
              <>
                {content.status === 'fallback' ? (
                  <div className="note-load-status" role="status">
                    <p>Showing the saved version of this note.</p>
                    <button type="button" onClick={content.retry}>Try again</button>
                  </div>
                ) : null}
                <div className="blog-markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownHeadingComponents}
                  >
                    {postMarkdown}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </article>
        ) : (
          <EmptyState title="No notes yet" body="This folder is waiting for its first note." />
        )}
      </section>
    </div>
  )
}
