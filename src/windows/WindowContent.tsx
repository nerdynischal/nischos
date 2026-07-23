import { lazy, Suspense } from 'react'
import type { BlogPost, Project, SettingsSection } from '../content'
import { EmptyState } from '../components/EmptyState'
import { ProjectWindow } from '../features/projects/ProjectWindow'
import { SettingsWindow } from '../features/settings/SettingsWindow'
import type { DesktopWindow } from '../types'

const BlogWindow = lazy(() =>
  import('../features/blog/BlogWindow').then((module) => ({ default: module.BlogWindow })),
)

export function WindowContent({
  desktopWindow,
  projects,
  posts,
  onOpenBlog,
  activeSection,
  onChangeSection,
  settingsSections,
}: {
  desktopWindow: DesktopWindow
  projects: Project[]
  posts: BlogPost[]
  onOpenBlog: (postId?: string) => void
  activeSection: string
  onChangeSection: (sectionId: string) => void
  settingsSections: SettingsSection[]
}) {
  if (desktopWindow.kind === 'project') {
    const project = projects.find((item) => item.id === desktopWindow.refId)
    if (!project) return <EmptyState title="Project missing" body="This app moved somewhere else." />
    return (
      <ProjectWindow
        project={project}
        hasLinkedPost={Boolean(project.postId && posts.some((post) => post.id === project.postId))}
        onOpenBlog={onOpenBlog}
      />
    )
  }

  if (desktopWindow.kind === 'blog') {
    return (
      <Suspense fallback={<EmptyState title="Opening Blog Posts" body="Loading your notes…" />}>
        <BlogWindow
          posts={posts}
          selectedPostId={desktopWindow.refId}
          onSelectPost={onOpenBlog}
        />
      </Suspense>
    )
  }

  return (
    <SettingsWindow
      activeSection={activeSection}
      onChangeSection={onChangeSection}
      settingsSections={settingsSections}
    />
  )
}
