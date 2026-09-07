import { describe, expect, it } from 'vitest'
import type { Project } from '../content/types'
import { getProjectWindowId, SYSTEM_APPS } from './appRegistry'
import { createDesktopIcons } from './createDesktopIcons'

const project: Project = {
  id: 'project',
  title: 'Project',
  subtitle: '',
  iconTone: 'graphite',
  type: 'experiment',
  model: 'GPT-5.6 Sol',
  sortOrder: 10,
  story: '',
  screenshots: [],
}

describe('desktop app registry', () => {
  it('uses project sort order for desktop placement', () => {
    const laterProject = { ...project, id: 'later', sortOrder: 20 }
    const earlierProject = { ...project, id: 'earlier', sortOrder: 10 }

    expect(
      createDesktopIcons([laterProject, earlierProject])
        .filter((icon) => icon.category === 'project')
        .map((icon) => icon.id),
    ).toEqual(['earlier', 'later'])
  })

  it('uses the shared system-app definitions for desktop icons', () => {
    const icons = createDesktopIcons([project])

    expect(icons.slice(1)).toEqual(
      SYSTEM_APPS.map((app) => ({ id: app.category, ...app })),
    )
  })

  it('presents the Notes app with the graphite tone', () => {
    expect(SYSTEM_APPS.find((app) => app.category === 'blog')).toMatchObject({
      label: 'Notes',
      tone: 'graphite',
    })
  })

  it('creates stable project window IDs', () => {
    expect(getProjectWindowId('keyform')).toBe('project:keyform')
  })
})
