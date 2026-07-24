import type { Project } from '../content'

export const PINNED_PROJECT_IDS = [
  'keyform',
  'my-toolkit',
  'maneki-neko-catalog',
]

export function selectPinnedProjects(
  projects: Project[],
  pinnedIds = PINNED_PROJECT_IDS,
  limit = 3,
) {
  const projectsById = new Map(projects.map((project) => [project.id, project]))
  const selected = pinnedIds.flatMap((id) => {
    const project = projectsById.get(id)
    return project ? [project] : []
  })
  const selectedIds = new Set(selected.map((project) => project.id))
  const remaining = projects.filter((project) => !selectedIds.has(project.id))

  return [...selected, ...remaining].slice(0, limit)
}
