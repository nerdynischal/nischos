import { describe, expect, it } from 'vitest'
import type { Project } from '../content'
import { getProjectWindowId, SYSTEM_APPS } from './appRegistry'
import { createDesktopIcons } from './createDesktopIcons'

const project: Project = {
  id: 'project',
  title: 'Project',
  subtitle: '',
  iconTone: 'graphite',
  type: 'experiment',
  model: 'GPT-5.6 Sol',
  story: '',
  screenshots: [],
}

describe('desktop app registry', () => {
  it('uses the shared system-app definitions for desktop icons', () => {
    const icons = createDesktopIcons([project])

    expect(icons.slice(1)).toEqual(
      SYSTEM_APPS.map((app) => ({ id: app.category, ...app })),
    )
  })

  it('creates stable project window IDs', () => {
    expect(getProjectWindowId('keyform')).toBe('project:keyform')
  })
})
