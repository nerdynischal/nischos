import type { BlogPostSummary, Project, SettingsSection } from '../content/types'
import { legacyProjectSummaries } from '../content/legacyProjectSummaries'
import type { DesktopWindow } from '../types'
import { NoteLines, SkeletonFrame, SkeletonText as Text } from '../components/ContentSkeleton'
import { ProjectSkeleton, FolderSkeleton } from '../features/projects/ProjectSkeleton'
import { SettingsSkeleton } from '../features/settings/SettingsSkeleton'

export function WindowSkeleton({ desktopWindow, projects, posts, settingsSections, activeSection }: {
  desktopWindow: DesktopWindow
  projects: Project[]
  posts: BlogPostSummary[]
  settingsSections: SettingsSection[]
  activeSection: string
}) {
  const { category, refId, title } = desktopWindow
  const legacyProject = legacyProjectSummaries.find((project) => project.id === refId)
  const project = legacyProject ?? projects.find((project) => project.id === refId)
  return <SkeletonFrame label={`Opening ${title}…`} className="window-skeleton">
    {category === 'folder' ? <FolderSkeleton projects={legacyProjectSummaries} />
      : category === 'project' ? project && <ProjectSkeleton project={project} legacy={Boolean(legacyProject)} hasLinkedPost={posts.some((post) => post.id === project.postId)} />
      : category === 'settings' ? <SettingsSkeleton sections={settingsSections} activeSection={activeSection} />
      : <BlogSkeleton posts={posts} selectedPostId={refId} />}
  </SkeletonFrame>
}

function BlogSkeleton({ posts, selectedPostId }: { posts: BlogPostSummary[]; selectedPostId?: string }) {
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? posts[0]
  if (!selectedPost) return null
  return <div className="finder" data-mobile-detail={Boolean(selectedPostId)}>
    <aside className="finder-sidebar blog-post-nav">
      <p className="sidebar-title">Notes</p>
      {posts.map((post) => <button type="button" tabIndex={-1} key={post.id} className={post.id === selectedPost.id ? 'is-selected' : ''}>
        <span className="post-title"><Text>{post.title}</Text></span>
        {post.isPinned && <span className="post-pin"><Text>Pinned</Text></span>}
        <span className="notes-row-chevron skeleton-fill" />
      </button>)}
    </aside>
    <section className="blog-reader">
      <article className="blog-reader-post">
        <div className="notes-mobile-back skeleton-fill" />
        <header><p><Text>{selectedPost.folder} · {selectedPost.date}</Text></p><h3><Text>{selectedPost.title}</Text></h3></header>
        <NoteLines />
      </article>
    </section>
  </div>
}
