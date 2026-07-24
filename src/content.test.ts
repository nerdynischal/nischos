import { describe, expect, it } from 'vitest'
import { posts, projects, settingsSections } from './content'

describe('local fallback content', () => {
  it('contains only the current portfolio projects', () => {
    expect(projects.map((project) => project.id)).toEqual([
      'keyform',
      'my-toolkit',
      'maneki-neko-catalog',
    ])
  })

  it('does not expose placeholder contact information or example links', () => {
    const serializedContent = JSON.stringify({ posts, projects, settingsSections })

    expect(serializedContent).not.toContain('hello@example.com')
    expect(serializedContent).not.toContain('https://example.com')
  })

  it('keeps a truthful local About section', () => {
    expect(settingsSections).toHaveLength(1)
    expect(settingsSections[0]).toMatchObject({
      id: 'about',
      displayTitle: 'Nischal',
      displaySubtitle: 'Design Engineer',
    })
  })
})
