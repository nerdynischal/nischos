import { describe, expect, it } from 'vitest'
import type { Project } from '../content/types'
import { selectPinnedProjects } from './selectPinnedProjects'

function project(id: string): Project {
  return {
    id,
    title: id,
    subtitle: '',
    iconTone: 'graphite',
    type: 'test',
    model: 'Test model',
    story: '',
    screenshots: [],
  }
}

describe('selectPinnedProjects', () => {
  it('uses the configured ID order instead of the incoming data order', () => {
    const projects = [project('third'), project('first'), project('second')]

    expect(
      selectPinnedProjects(projects, ['first', 'second', 'third']).map((item) => item.id),
    ).toEqual(['first', 'second', 'third'])
  })

  it('fills missing pinned slots from the remaining projects', () => {
    const projects = [project('fallback-a'), project('pinned'), project('fallback-b')]

    expect(
      selectPinnedProjects(projects, ['missing', 'pinned']).map((item) => item.id),
    ).toEqual(['pinned', 'fallback-a', 'fallback-b'])
  })

  it('keeps all five configured portfolio projects in the dock', () => {
    const projects = [
      project('fifth'),
      project('fourth'),
      project('third'),
      project('second'),
      project('first'),
    ]

    expect(
      selectPinnedProjects(projects, ['first', 'second', 'third', 'fourth', 'fifth']).map(
        (item) => item.id,
      ),
    ).toEqual(['first', 'second', 'third', 'fourth', 'fifth'])
  })
})
