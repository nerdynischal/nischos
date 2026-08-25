import { describe, expect, it } from 'vitest'
import {
  mapPost,
  mapProject,
  mapSettingsDetails,
  readSupabaseConfig,
} from './supabase'

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
        model: null,
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
      type: 'experiment',
      model: 'Not specified',
      story: '',
      screenshots: [],
    })
  })

  it('maps the canonical project type and preserves model fallbacks', () => {
    const row = {
      id: 'keyform',
      title: 'Keyform',
      subtitle: null,
      icon_tone: null,
      thumbnail: null,
      type: 'interactive experiment',
      model: null,
      story: null,
      screenshots: null,
      demo_url: null,
      source_url: null,
      post_id: null,
    }

    expect(mapProject(row)).toMatchObject({
      type: 'interactive experiment',
      model: 'GPT-5.6 Sol',
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

  it('prefers a publishable key and supports legacy anon keys', () => {
    expect(
      readSupabaseConfig({
        VITE_SUPABASE_URL: ' https://project.supabase.co ',
        VITE_SUPABASE_PUBLISHABLE_KEY: ' publishable-key ',
        VITE_SUPABASE_ANON_KEY: 'legacy-key',
      }),
    ).toEqual({
      url: 'https://project.supabase.co',
      key: 'publishable-key',
    })

    expect(
      readSupabaseConfig({
        VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
        VITE_SUPABASE_ANON_KEY: 'legacy-key',
      }),
    ).toEqual({
      url: 'http://127.0.0.1:54321',
      key: 'legacy-key',
    })
  })

  it('rejects partial or invalid Supabase configuration', () => {
    expect(readSupabaseConfig({ VITE_SUPABASE_URL: 'https://project.supabase.co' })).toBeNull()
    expect(
      readSupabaseConfig({
        VITE_SUPABASE_URL: 'not-a-url',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
      }),
    ).toBeNull()
  })
})
