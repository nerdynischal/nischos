import { describe, expect, it } from 'vitest'
import {
  mapPost,
  mapProject,
  mapSettingsDetails,
  readSupabaseConfig,
  sortPosts,
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
        date: '2026-07-23',
        folder: null,
        is_pinned: false,
        content_markdown: 'Post body.',
      }),
    ).toEqual({
      id: 'post',
      title: 'Post',
      date: '2026-07-23',
      folder: 'Notes',
      isPinned: false,
      contentMarkdown: 'Post body.',
    })
  })

  it('keeps pinned notes first, then sorts the rest by date', () => {
    const note = (id: string, date: string, isPinned = false) => ({
      id,
      title: id,
      date,
      folder: 'Notes' as const,
      isPinned,
      contentMarkdown: `${id} body.`,
    })

    expect(
      sortPosts([
        note('older', '2026-01-01'),
        note('pinned', '2025-01-01', true),
        note('newer', '2026-08-25'),
      ]).map((post) => post.id),
    ).toEqual(['pinned', 'newer', 'older'])
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
