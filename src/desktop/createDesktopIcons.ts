import type { Project } from '../content'
import type { DesktopIcon } from '../types'

export function createDesktopIcons(projects: Project[]): DesktopIcon[] {
  const positions = [
    [11, 17],
    [28, 12],
    [48, 16],
    [18, 34],
    [36, 29],
    [13, 55],
    [31, 50],
    [51, 47],
  ]

  return [
    ...projects.map((project, index) => {
      const position = positions[index] ?? [12 + (index % 4) * 18, 70 + Math.floor(index / 4) * 14]
      return {
        id: project.id,
        label: project.title,
        kind: 'project' as const,
        tone: project.iconTone,
        thumbnail: project.thumbnail,
        x: position[0],
        y: position[1],
      }
    }),
    {
      id: 'blog',
      label: 'Blog Posts',
      kind: 'blog',
      tone: 'folder',
      x: 83,
      y: 14,
    },
    {
      id: 'settings',
      label: 'About',
      kind: 'settings',
      tone: 'settings',
      x: 85,
      y: 47,
    },
  ]
}
