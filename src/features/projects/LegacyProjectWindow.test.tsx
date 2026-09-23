import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { legacyProjects } from '../../content/legacyProjects'
import { LegacyProjectWindow } from './LegacyProjectWindow'

describe('LegacyProjectWindow', () => {
  it('makes the cover and every case-study image zoomable', () => {
    const project = legacyProjects.find((item) => item.id === 'auto-gmail')
    if (!project) throw new Error('Auto Gmail fixture is missing')

    const imageCount =
      project.caseStudy?.sections.flatMap((section) => section.images ?? []).length ?? 0
    const markup = renderToStaticMarkup(<LegacyProjectWindow project={project} />)
    const zoomTriggerCount = markup.match(/class="legacy-image-zoom-trigger"/g)?.length ?? 0

    expect(zoomTriggerCount).toBe(imageCount + 1)
    expect(markup).toContain('aria-label="View Auto Gmail cover larger: Auto Gmail promotion')
    expect(markup).toContain('aria-label="View Product icon larger: Auto Gmail icon')
  })
})

it('exposes each archived image description in its zoom control', () => {
  for (const project of legacyProjects) {
    const markup = renderToStaticMarkup(<LegacyProjectWindow project={project} />)
    const images = project.caseStudy!.sections.flatMap((section) => section.images ?? [])
    for (const image of images) {
      // React escapes punctuation when serializing attributes.
      const escapedAlt = renderToStaticMarkup(<span>{image.alt}</span>).slice(6, -7)
      expect(markup).toContain(`alt="${escapedAlt}"`)
      expect(markup).toContain(`larger: ${escapedAlt}"`)
    }
  }
})
