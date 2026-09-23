import type { Project } from '../../content/types'
import { NoteLines, SkeletonText as Text } from '../../components/ContentSkeleton'

export function FolderSkeleton({ projects }: { projects: Project[] }) {
  return <div className="legacy-folder-window">
    <div className="legacy-folder-toolbar">
      <div className="legacy-folder-path"><span className="skeleton-small-icon skeleton-fill" /><span>Portfolio</span><span>/</span><strong>Selected Work</strong></div>
      <span>{projects.length} files</span>
    </div>
    <div className="legacy-folder-layout">
      <aside className="legacy-folder-sidebar"><div className="legacy-folder-location is-selected"><span className="skeleton-small-icon skeleton-fill" />Selected Work</div></aside>
      <section className="legacy-file-grid">{projects.map((project) => <button type="button" tabIndex={-1} className="legacy-file" key={project.id}>
        <span className="legacy-file-preview skeleton-fill" />
        <strong><Text>{project.title}</Text></strong><span><Text>{project.type}</Text></span>
      </button>)}</section>
    </div>
  </div>
}

export function ProjectSkeleton({ project, legacy, hasLinkedPost }: { project: Project; legacy: boolean; hasLinkedPost: boolean }) {
  if (legacy) return <article className="legacy-project-window">
    {project.thumbnail && <div className="legacy-project-cover skeleton-fill" />}
    <header className="legacy-project-header">
      <h1><Text>{project.title}</Text></h1><p><Text>{project.subtitle}</Text></p>
      <ul className="legacy-project-tags">{(project.caseStudy?.tags ?? project.type.split(' · ')).map((tag) => <li key={tag}><Text>{tag}</Text></li>)}</ul>
    </header>
    <p className="legacy-project-intro"><Text>{project.story}</Text></p>
    <div className="legacy-case-study"><section className="legacy-case-study-section">
      <span className="legacy-section-number"><Text>01</Text></span>
      <div className="legacy-section-content"><h2><Text>Project overview</Text></h2><NoteLines /></div>
    </section></div>
  </article>

  return <div className="project-window">
    <section className="project-hero">
      <div className="project-icon skeleton-fill" />
      <div className="project-heading"><h1><Text>{project.title}</Text></h1><p><Text>{project.type}</Text></p>
        <div className="project-actions">
          <button type="button" tabIndex={-1}><Text>Visit Website</Text></button>
          <button type="button" tabIndex={-1}><Text>Source Code</Text></button>
          {hasLinkedPost && <button type="button" tabIndex={-1}><Text>Related Note</Text></button>}
        </div>
      </div>
    </section>
    <dl className="project-meta">{[['type', project.type], ['model', project.model]].map(([label, value]) => <div key={label}><dt><Text>{label}</Text></dt><dd><Text>{value}</Text></dd></div>)}</dl>
    <section className="story-panel"><h2><Text>{project.subtitle}</Text></h2><p><Text>{project.story}</Text></p></section>
    <section className="screenshot-carousel"><div className="screenshot-card skeleton-fill" /></section>
  </div>
}
