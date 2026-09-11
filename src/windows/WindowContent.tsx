import { lazy, Suspense } from 'react'
import type { BlogPostSummary, Project, SettingsSection } from '../content/types'
import { EmptyState } from '../components/EmptyState'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { legacyProjectSummaries as legacyProjects } from '../content/legacyProjectSummaries'
import type { DesktopWindow } from '../types'

const BlogWindow = lazy(() =>
  import('../features/blog/BlogWindow').then((module) => ({ default: module.BlogWindow })),
)

const ProjectWindow = lazy(() =>
  import('../features/projects/ProjectWindow').then((module) => ({ default: module.ProjectWindow })),
)
const SettingsWindow = lazy(() =>
  import('../features/settings/SettingsWindow').then((module) => ({ default: module.SettingsWindow })),
)
const LegacyWorkWindow = lazy(() =>
  import('../features/projects/LegacyWorkWindow').then((module) => ({ default: module.LegacyWorkWindow })),
)
const LegacyCaseStudyWindow = lazy(() =>
  import('../features/projects/LegacyCaseStudyWindow').then((module) => ({ default: module.LegacyCaseStudyWindow })),
)

type WindowContentProps = {
  desktopWindow: DesktopWindow
  projects: Project[]
  posts: BlogPostSummary[]
  onOpenBlog: (postId?: string) => void
  onOpenProject: (projectId: string) => void
  activeSection: string
  onChangeSection: (sectionId: string) => void
  settingsSections: SettingsSection[]
}

export function WindowContent(props: WindowContentProps) {
  return (
    <Suspense fallback={<LoadingIndicator label={`Opening ${props.desktopWindow.title}…`} inset />}>
      <WindowReader {...props} />
    </Suspense>
  )
}

function WindowReader({
  desktopWindow,
  projects,
  posts,
  onOpenBlog,
  onOpenProject,
  activeSection,
  onChangeSection,
  settingsSections,
}: WindowContentProps) {
  if (desktopWindow.category === 'folder') {
    return <LegacyWorkWindow projects={legacyProjects} onOpenProject={onOpenProject} />
  }

  if (desktopWindow.category === 'project') {
    const project = projects.find((item) => item.id === desktopWindow.refId)
    if (!project) {
      return <EmptyState title="Project missing" body="This app moved somewhere else." />
    }
    if (legacyProjects.some((item) => item.id === project.id)) {
      return <LegacyCaseStudyWindow projectId={project.id} />
    }
    return (
      <ProjectWindow
        project={project}
        hasLinkedPost={Boolean(project.postId && posts.some((post) => post.id === project.postId))}
        onOpenBlog={onOpenBlog}
      />
    )
  }

  if (desktopWindow.category === 'blog') {
    return (
      <BlogWindow
        posts={posts}
        selectedPostId={desktopWindow.refId}
        onSelectPost={onOpenBlog}
      />
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
