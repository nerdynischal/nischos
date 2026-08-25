import type { WindowCategory } from '../types'

type SystemAppCategory = Exclude<WindowCategory, 'project'>

type SystemAppDefinition = {
  label: string
  category: SystemAppCategory
  tone: string
  x: number
  y: number
}

export const NOTES_APP_LABEL = 'Notes'

export const SYSTEM_APPS = [
  {
    label: NOTES_APP_LABEL,
    category: 'blog',
    tone: 'graphite',
    x: 83,
    y: 14,
  },
  {
    label: 'About',
    category: 'settings',
    tone: 'settings',
    x: 85,
    y: 47,
  },
] as const satisfies readonly SystemAppDefinition[]

export function getProjectWindowId(projectId: string) {
  return `project:${projectId}`
}
