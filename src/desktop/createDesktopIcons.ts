import { sortProjects } from '../content/projectOrdering'
import type { Project } from '../content/types'
import type { DesktopIcon } from '../types'
import { SYSTEM_APPS } from './appRegistry'

const PROJECT_POSITIONS: ReadonlyArray<readonly [number, number]> = [
  [11, 17],
  [28, 12],
  [48, 16],
  [18, 34],
  [36, 29],
  [13, 55],
  [31, 50],
  [51, 47],
]

export function createDesktopIcons(projects: Project[]): DesktopIcon[] {
  return [
    ...sortProjects(projects).map((project, index) => {
      const position = PROJECT_POSITIONS[index] ?? [
        12 + (index % 4) * 18,
        70 + Math.floor(index / 4) * 14,
      ]
      return {
        id: project.id,
        label: project.title,
        category: 'project' as const,
        tone: project.iconTone,
        thumbnail: project.thumbnail,
        x: position[0],
        y: position[1],
      }
    }),
    ...SYSTEM_APPS.map((app) => ({ id: app.category, ...app })),
  ]
}
