import { describe, expect, it } from 'vitest'
import type { Project } from './types'
import { selectDockProjects, sortProjects } from './projectOrdering'

function project(
  id: string,
  sortOrder: number,
  dockOrder?: number,
): Project {
  return {
    id,
    title: id,
    subtitle: '',
    iconTone: 'graphite',
    type: 'test',
    model: 'Test model',
    sortOrder,
    dockOrder,
    story: '',
    screenshots: [],
  }
}

describe('project ordering', () => {
  it('sorts desktop projects by sort order with a stable ID tie-breaker', () => {
    expect(
      sortProjects([
        project('third', 30),
        project('second', 20),
        project('first', 20),
      ]).map((item) => item.id),
    ).toEqual(['first', 'second', 'third'])
  })

  it('selects only dock projects and respects dock order', () => {
    expect(
      selectDockProjects([
        project('desktop-only', 10),
        project('dock-second', 20, 20),
        project('dock-first', 30, 10),
      ]).map((item) => item.id),
    ).toEqual(['dock-first', 'dock-second'])
  })

  it('caps the dock project count', () => {
    expect(
      selectDockProjects(
        [project('third', 30, 30), project('first', 10, 10), project('second', 20, 20)],
        2,
      ).map((item) => item.id),
    ).toEqual(['first', 'second'])
  })
})
