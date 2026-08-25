import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { BlogPost } from '../../content'
import { EmptyState } from '../../components/EmptyState'
import { getPostMarkdown } from './getPostMarkdown'

export function BlogWindow({
  posts,
  selectedPostId,
  onSelectPost,
}: {
  posts: BlogPost[]
  selectedPostId?: string
  onSelectPost: (postId?: string) => void
}) {
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? posts[0]
  const postMarkdown = selectedPost ? getPostMarkdown(selectedPost) : ''

  return (
    <div className="finder">
      <aside className="finder-sidebar blog-post-nav" aria-label="Notes">
        <p className="sidebar-title">Notes</p>
        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            className={post.id === selectedPost?.id ? 'is-selected' : ''}
            onClick={() => onSelectPost(post.id)}
            aria-current={post.id === selectedPost?.id ? 'page' : undefined}
          >
            <span className="post-title">{post.title}</span>
            {post.isPinned ? <span className="post-pin">Pinned</span> : null}
          </button>
        ))}
      </aside>
      <section className="blog-reader" aria-label="Selected note">
        {selectedPost ? (
          <article className="blog-reader-post">
            <header>
              <p>{selectedPost.folder} · {selectedPost.date}</p>
              <h3>{selectedPost.title}</h3>
            </header>
            <div className="blog-markdown">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{postMarkdown}</ReactMarkdown>
            </div>
          </article>
        ) : (
          <EmptyState title="No notes yet" body="This folder is waiting for its first note." />
        )}
      </section>
    </div>
  )
}
