import type { Project } from './types'

export type ProjectManifest = Omit<Project, 'dockOrder'> & {
  $schema: string
  dockOrder?: number | null
}

type ProjectManifestModule = {
  default: ProjectManifest
}

const manifestModules = import.meta.glob<ProjectManifestModule>(
  '../../content/projects/*.json',
  { eager: true },
)

export function loadProjectManifests(): Project[] {
  return Object.values(manifestModules).map(({ default: manifest }) => {
    const { $schema: _schema, dockOrder, ...project } = manifest
    return {
      ...project,
      dockOrder: dockOrder ?? undefined,
    }
  })
}
