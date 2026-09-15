import { useEffect, useState, type ReactNode } from 'react'
import '../styles/content-skeleton.css'

export function SkeletonFrame({ label, children, className = '' }: {
  label: string
  children: ReactNode
  className?: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={`content-skeleton ${className}`} data-visible={visible} aria-busy="true">
      <span className="skeleton-announcement" role="status">{visible ? label : ''}</span>
      {visible && <div className="skeleton-shapes" aria-hidden="true" inert>{children}</div>}
    </div>
  )
}

// Hidden text preserves the real font metrics and wrapping without exposing fake content.
export function SkeletonText({ children }: { children: ReactNode }) {
  return <span className="skeleton-text">{children}</span>
}

export function NoteLines() {
  return <div className="blog-markdown skeleton-note-body">{[0, 1, 2].map((paragraph) => (
    <p className="skeleton-paragraph" key={paragraph}>
      {[0, 1, 2, 3].map((line) => <span className="skeleton-line" key={line} />)}
    </p>
  ))}</div>
}

export function NoteSkeleton() {
  return <SkeletonFrame label="Loading note…" className="note-skeleton"><NoteLines /></SkeletonFrame>
}
