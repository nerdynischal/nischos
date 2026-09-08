import { FileText, FolderOpen } from 'lucide-react'
import type { Project } from '../../content/types'
import { resolveAssetUrl } from '../../lib/assetUrl'

export function LegacyWorkWindow({
  projects,
  onOpenProject,
}: {
  projects: Project[]
  onOpenProject: (projectId: string) => void
}) {
  return (
    <div className="legacy-folder-window">
      <div className="legacy-folder-toolbar">
        <div className="legacy-folder-path" aria-label="Current folder">
          <FolderOpen strokeWidth={1.7} absoluteStrokeWidth aria-hidden="true" />
          <span>Portfolio</span>
          <span aria-hidden="true">/</span>
          <strong>Selected Work</strong>
        </div>
        <span>{projects.length} files</span>
      </div>

      <div className="legacy-folder-layout">
        <aside className="legacy-folder-sidebar" aria-label="Folder locations">
          <p>Favourites</p>
          <button type="button" className="is-selected" aria-current="page">
            <FolderOpen strokeWidth={1.7} absoluteStrokeWidth aria-hidden="true" />
            Selected Work
          </button>
        </aside>

        <section className="legacy-file-grid" aria-label="Selected work files">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="legacy-file"
              onClick={() => onOpenProject(project.id)}
              aria-label={`Open ${project.title} case study`}
            >
              <span className="legacy-file-preview" aria-hidden="true">
                {project.thumbnail ? (
                  <img src={resolveAssetUrl(project.thumbnail)} alt="" loading="lazy" decoding="async" />
                ) : (
                  <FileText strokeWidth={1.5} absoluteStrokeWidth />
                )}
                <span className="legacy-file-fold" />
              </span>
              <strong>{project.title}</strong>
              <span>{project.type}</span>
            </button>
          ))}
        </section>
      </div>
    </div>
  )
}
