import { describe, expect, it } from 'vitest'
import { legacyProjects } from './legacyProjects'

describe('local legacy project archive', () => {
  it('contains the eight projects from the freelance portfolio', () => {
    expect(legacyProjects.map((project) => project.title)).toEqual([
      'Auto Gmail',
      'Ravageous',
      'Freeguides',
      'Form GPT',
      'Donor Hub',
      'Alice Puzzle Game Interface',
      'Vocal Email',
      'SeoGaeilge',
    ])
  })

  it('keeps every case study and its media fully local', () => {
    for (const project of legacyProjects) {
      expect(project.caseStudy?.sections.length).toBeGreaterThan(0)
      expect(project.thumbnail).toMatch(/^\/project-media\/legacy\//)
      expect(project.screenshots.every((image) => image.startsWith('/project-media/legacy/'))).toBe(
        true,
      )
      expect(
        project.caseStudy?.sections
          .flatMap((section) => section.images ?? [])
          .every((image) => image.src.startsWith('/project-media/legacy/')),
      ).toBe(true)
    }
  })

  it('does not pin archive files as standalone dock apps', () => {
    expect(legacyProjects.every((project) => project.dockOrder === undefined)).toBe(true)
  })

  it('preserves the complete source image set for every case study', () => {
    const imageCounts = Object.fromEntries(
      legacyProjects.map((project) => [
        project.id,
        project.caseStudy?.sections.flatMap((section) => section.images ?? []).length,
      ]),
    )

    expect(imageCounts).toEqual({
      'auto-gmail': 8,
      ravageous: 6,
      freeguides: 6,
      'form-gpt': 8,
      'donor-hub': 20,
      'alice-puzzle': 9,
      'vocal-email': 16,
      seogaeilge: 4,
    })
  })

})
