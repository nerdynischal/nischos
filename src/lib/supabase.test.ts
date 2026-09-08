import { describe, expect, it } from 'vitest'
import {
  mapPost,
  mapProject,
  mapSettingsDetails,
  mapSettingsToolGroups,
  mergeProjects,
  mergeSettingsSections,
  readSupabaseConfig,
  sortPosts,
} from './supabase'

describe('Supabase content mapping', () => {
  it('keeps checked-in projects that are not yet present in Supabase', () => {
    const project = (id: string, title: string) => ({
      id,
      title,
      subtitle: '',
      iconTone: 'graphite',
      type: 'experiment',
      model: 'Not specified',
      sortOrder: 1000,
      story: '',
      screenshots: [],
    })

    expect(
      mergeProjects(
        [project('existing', 'Remote title'), project('remote-only', 'Remote only')],
        [project('existing', 'Local title'), project('local-only', 'Local only')],
      ).map(({ id, title }) => ({ id, title })),
    ).toEqual([
      { id: 'existing', title: 'Remote title' },
      { id: 'local-only', title: 'Local only' },
      { id: 'remote-only', title: 'Remote only' },
    ])
  })

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
        sort_order: 1000,
        dock_order: null,
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
      sortOrder: 1000,
      dockOrder: undefined,
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
      sort_order: 30,
      dock_order: 10,
      story: null,
      screenshots: null,
      demo_url: null,
      source_url: null,
      post_id: null,
    }

    expect(mapProject(row)).toMatchObject({
      type: 'interactive experiment',
      model: 'GPT-5.6 Sol',
      sortOrder: 30,
      dockOrder: 10,
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
        { label: 'Role', value: 'Design Engineer', href: 'https://example.com' },
        { label: 'Broken' },
        { label: 42, value: 'Nope' },
      ]),
    ).toEqual([{
      label: 'Role',
      value: 'Design Engineer',
      href: 'https://example.com',
    }])
  })

  it('maps toolkit groups while dropping malformed tools', () => {
    expect(
      mapSettingsToolGroups([
        {
          id: 'main',
          label: 'Main',
          tools: [
            {
              title: 'Notion',
              description: 'Documentation and project logs.',
              icon: '/tool-icons/notion.svg',
              url: 'https://www.notion.com/',
            },
            { title: 'Broken' },
          ],
        },
        { id: 'broken' },
      ]),
    ).toEqual([
      {
        id: 'main',
        label: 'Main',
        tools: [
          {
            title: 'Notion',
            description: 'Documentation and project logs.',
            icon: '/tool-icons/notion.svg',
            url: 'https://www.notion.com/',
          },
        ],
      },
    ])
  })

  it('keeps checked-in settings sections that are not yet present in Supabase', () => {
    const section = (id: string, label: string) => ({
      id,
      label,
      displayTitle: label,
      displaySubtitle: undefined as string | undefined,
      body: '',
      items: [],
    })

    const localValues = {
      ...section('values', 'Values'),
      displaySubtitle: 'Design Principles',
    }

    expect(
      mergeSettingsSections(
        [
          section('about', 'Remote About'),
          section('values', 'Values'),
          section('remote-only', 'Remote only'),
        ],
        [section('about', 'Local About'), localValues],
      ).map(({ id, label, displaySubtitle }) => ({ id, label, displaySubtitle })),
    ).toEqual([
      { id: 'about', label: 'Remote About', displaySubtitle: undefined },
      { id: 'values', label: 'Values', displaySubtitle: 'Design Principles' },
      { id: 'remote-only', label: 'Remote only', displaySubtitle: undefined },
    ])
  })

  it('uses checked-in contact details while remote values are placeholders', () => {
    const baseSection = {
      id: 'contact',
      label: 'Contact',
      body: '',
      items: [],
    }

    const [contact] = mergeSettingsSections(
      [{
        ...baseSection,
        details: [{ label: 'GitHub', value: 'Placeholder' }],
      }],
      [{
        ...baseSection,
        details: [{
          label: 'GitHub',
          value: 'github.com',
          href: 'https://github.com/',
        }],
      }],
    )

    expect(contact.details).toEqual([{
      label: 'GitHub',
      value: 'github.com',
      href: 'https://github.com/',
    }])
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

    expect(
      readSupabaseConfig({
        VITE_SUPABASE_URL: 'https://project.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: '   ',
        VITE_SUPABASE_ANON_KEY: 'legacy-key',
      }),
    ).toEqual({
      url: 'https://project.supabase.co',
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
