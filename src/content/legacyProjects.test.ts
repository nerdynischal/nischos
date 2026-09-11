import { describe, expect, it } from 'vitest'
import { legacyProjects } from './legacyProjects'
import { legacyProjectSummaries } from './legacyProjectSummaries'

describe('local legacy project archive', () => {
  it('keeps desktop metadata complete without including case-study bodies', () => {
    expect(legacyProjectSummaries.every((project) => project.caseStudy === undefined)).toBe(true)
    expect(legacyProjects.map(({ caseStudy: _caseStudy, ...project }) => project)).toEqual(legacyProjectSummaries)
  })
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
      'auto-gmail': 9,
      ravageous: 6,
      freeguides: 6,
      'form-gpt': 8,
      'donor-hub': 20,
      'alice-puzzle': 9,
      'vocal-email': 16,
      seogaeilge: 4,
    })
  })

  it('keeps revised images in their intended editorial sections', () => {
    const getCaptions = (projectId: string, sectionTitle: string) =>
      legacyProjects
        .find((project) => project.id === projectId)
        ?.caseStudy?.sections.find((section) => section.title === sectionTitle)
        ?.images?.map((image) => image.caption)

    expect(getCaptions('auto-gmail', 'Initial drafts')).toEqual([
      'Initial product icon explorations',
    ])
    expect(getCaptions('form-gpt', 'Initial drafts')).toEqual(['Draft 1', 'Draft 2', 'Draft 3'])
    expect(getCaptions('form-gpt', 'Final designs')).toEqual([
      'Extension in context',
      'Final compact extension UI',
    ])
    expect(getCaptions('alice-puzzle', 'Final designs')).toEqual([
      'Interface',
      'Same-panel menu',
      'Dialog menu',
      'Final game interface direction',
    ])
  })

  it('uses masonry only for sections configured as multi-column galleries', () => {
    const autoGmailFinal = legacyProjects
      .find((project) => project.id === 'auto-gmail')
      ?.caseStudy?.sections.find((section) => section.title === 'Final designs')
    const aliceFinal = legacyProjects
      .find((project) => project.id === 'alice-puzzle')
      ?.caseStudy?.sections.find((section) => section.title === 'Final designs')

    expect(autoGmailFinal?.imageLayout).toBe('masonry')
    expect(aliceFinal?.imageLayout).toBeUndefined()
  })
})
