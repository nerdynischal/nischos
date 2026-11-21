import { ExternalLink } from 'lucide-react'
import type { Project } from '../../content/types'

export function ProjectActions({ project, hasLinkedPost, onOpenBlog }: {
  project: Project
  hasLinkedPost: boolean
  onOpenBlog: (postId?: string) => void
}) {
  const links = [
    { label: 'Visit Website', href: project.demoUrl, primary: true },
    { label: 'Source Code', href: project.sourceUrl, primary: false },
  ].filter((link) => link.href)
  const hasActions = links.length > 0 || hasLinkedPost

  return (
    <>
      {links.length === 0 && (
        <p className="project-availability">Not publicly available.</p>
      )}
      {hasActions && (
        <div className="project-actions">
          {links.map(({ label, href, primary }) => (
            <a key={label} className={primary ? 'primary-action' : undefined} href={href} target="_blank" rel="noreferrer">
              {label}
              <ExternalLink className="external-link-icon" strokeWidth={1.7} absoluteStrokeWidth aria-hidden="true" />
            </a>
          ))}
          {hasLinkedPost && (
            <button type="button" onClick={() => onOpenBlog(project.postId)}>
              Related Note
            </button>
          )}
        </div>
      )}
    </>
  )
}
