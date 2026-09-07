import { describe, expect, it } from 'vitest'
import { DEFAULT_SETTINGS_SECTION_ID, posts, projects, settingsSections } from './content'

describe('local fallback content', () => {
  it('contains only the current portfolio projects', () => {
    expect(projects.map((project) => project.id)).toEqual([
      'workout-board',
      'still',
      'keyform',
      'my-toolkit',
      'maneki-neko-catalog',
    ])
  })

  it('records the AI model used for each project', () => {
    expect(Object.fromEntries(projects.map((project) => [project.id, project.model]))).toEqual({
      'workout-board': 'GPT-5.6 Sol',
      still: 'GPT-5.6 Sol',
      keyform: 'GPT-5.6 Sol',
      'my-toolkit': 'GPT-5.5',
      'maneki-neko-catalog': 'GPT-5.5',
    })
  })

  it('does not expose placeholder contact information or example links', () => {
    const serializedContent = JSON.stringify({ posts, projects, settingsSections })

    expect(serializedContent).not.toContain('hello@example.com')
    expect(serializedContent).not.toContain('https://example.com')
  })

  it('keeps the welcome note pinned first', () => {
    expect(posts[0]).toMatchObject({
      id: 'welcome-to-nischos',
      isPinned: true,
    })
  })

  it('stores every local note as Markdown', () => {
    expect(posts.every((post) => post.contentMarkdown.trim().length > 0)).toBe(true)
  })

  it('keeps a truthful local About section', () => {
    expect(settingsSections).toHaveLength(1)
    expect(DEFAULT_SETTINGS_SECTION_ID).toBe('about')
    expect(settingsSections[0]).toMatchObject({
      id: 'about',
      displayTitle: 'Nischal',
      displaySubtitle: 'Design Engineer',
    })
  })
})
