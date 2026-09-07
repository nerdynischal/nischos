import type { Project } from './types'

export const DEFAULT_PROJECT_SORT_ORDER = 1000

export function compareProjectOrder(left: Project, right: Project) {
  return left.sortOrder - right.sortOrder || left.id.localeCompare(right.id)
}

export function sortProjects(projects: Project[]) {
  return [...projects].sort(compareProjectOrder)
}

export function selectDockProjects(projects: Project[], limit = 5) {
  return projects
    .filter((project) => project.dockOrder !== undefined)
    .sort(
      (left, right) =>
        (left.dockOrder ?? DEFAULT_PROJECT_SORT_ORDER) -
          (right.dockOrder ?? DEFAULT_PROJECT_SORT_ORDER) ||
        compareProjectOrder(left, right),
    )
    .slice(0, limit)
}
