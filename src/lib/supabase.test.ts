import { describe, expect, it } from 'vitest'
import { mapPost, mapProject, mapSettingsDetails } from './supabase'

describe('Supabase content mapping', () => {
  it('normalizes nullable project fields', () => {
    expect(
      mapProject({
        id: 'project',
        title: 'Project',
        subtitle: null,
        icon_tone: null,
        thumbnail: null,
        type: null,
        stack: null,
        story: null,
        screenshots: null,
        demo_url: null,
        source_url: null,
        post_id: null,
      }),
    ).toMatchObject({
      id: 'project',
      subtitle: 'An experiment from the desktop.',
      iconTone: 'graphite',
      stack: [],
      story: '',
      screenshots: [],
    })
  })

  it('defaults nullable post presentation fields', () => {
    expect(
      mapPost({
        id: 'post',
        title: 'Post',
        filename: null,
        date: '2026-07-23',
        folder: null,
        cover_tone: null,
        content_markdown: null,
        content: null,
      }),
    ).toEqual({
      id: 'post',
      title: 'Post',
      filename: 'post.md',
      date: '2026-07-23',
      folder: 'Notes',
      coverTone: 'graphite',
      contentMarkdown: undefined,
      content: [],
    })
  })

  it('drops malformed settings details', () => {
    expect(
      mapSettingsDetails([
        { label: 'Role', value: 'Design Engineer' },
        { label: 'Broken' },
        { label: 42, value: 'Nope' },
      ]),
    ).toEqual([{ label: 'Role', value: 'Design Engineer' }])
  })
})
