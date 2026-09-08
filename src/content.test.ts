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

  it('keeps Workout Board metadata aligned with Supabase', () => {
    expect(projects.find((project) => project.id === 'workout-board')).toMatchObject({
      type: 'Fitness',
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
    expect(settingsSections.map((section) => section.id)).toEqual([
      'about',
      'values',
      'hobbies',
      'tools',
      'contact',
    ])
    expect(DEFAULT_SETTINGS_SECTION_ID).toBe('about')
    expect(settingsSections[0]).toMatchObject({
      id: 'about',
      displayTitle: 'Nischal',
      displaySubtitle: 'Design Engineer',
    })
  })

  it('keeps the complete toolkit grouped by status', () => {
    const toolkit = settingsSections.find((section) => section.id === 'tools')

    expect(toolkit?.toolGroups?.map((group) => group.id)).toEqual([
      'main',
      'exploring',
      'watchlist',
      'obsolete',
    ])
    expect(toolkit?.toolGroups?.flatMap((group) => group.tools)).toHaveLength(17)
  })

  it('provides safe dummy contact destinations for interaction testing', () => {
    const contact = settingsSections.find((section) => section.id === 'contact')

    expect(contact).toMatchObject({
      displaySubtitle: 'Get in touch',
      details: [
        { label: 'Email', value: 'test@example.test' },
        {
          label: 'LinkedIn',
          value: 'linkedin.com',
          href: 'https://www.linkedin.com/',
        },
        { label: 'GitHub', value: 'github.com', href: 'https://github.com/' },
      ],
    })
  })
})
