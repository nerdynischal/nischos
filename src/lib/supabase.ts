import { createClient } from '@supabase/supabase-js'
import type { BlogPost, Project, SettingsSection } from '../content'

export type ProjectRow = {
  id: string
  title: string
  subtitle: string | null
  icon_tone: string | null
  thumbnail: string | null
  type: string | null
  stack: string[] | null
  story: string | null
  screenshots: string[] | null
  demo_url: string | null
  source_url: string | null
  post_id: string | null
}

export type BlogPostRow = {
  id: string
  title: string
  filename: string | null
  date: string
  folder: BlogPost['folder'] | null
  cover_tone: string | null
  content_markdown: string | null
  content: string[] | null
}

export type SettingsDetailRow = {
  label?: unknown
  value?: unknown
}

export type SettingsSectionRow = {
  id: string
  label: string
  display_title: string | null
  display_subtitle: string | null
  body: string | null
  details: SettingsDetailRow[] | null
  items: string[] | null
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null

export async function fetchProjects(): Promise<Project[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as ProjectRow[]).map(mapProject)
}

export async function fetchPosts(): Promise<BlogPost[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as BlogPostRow[]).map(mapPost)
}

export async function fetchSettingsSections(): Promise<SettingsSection[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('settings_sections')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new Error(error.message)
  }

  return ((data ?? []) as SettingsSectionRow[]).map(mapSettingsSection)
}

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? 'An experiment from the desktop.',
    iconTone: row.icon_tone ?? 'graphite',
    thumbnail: row.thumbnail ?? undefined,
    type: row.type ?? 'experiment',
    stack: row.stack ?? [],
    story: row.story ?? '',
    screenshots: row.screenshots ?? [],
    demoUrl: row.demo_url ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    postId: row.post_id ?? undefined,
  }
}

export function mapSettingsSection(row: SettingsSectionRow): SettingsSection {
  return {
    id: row.id,
    label: row.label,
    displayTitle: row.display_title ?? undefined,
    displaySubtitle: row.display_subtitle ?? undefined,
    body: row.body ?? '',
    details: mapSettingsDetails(row.details),
    items: row.items ?? [],
  }
}

export function mapPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    title: row.title,
    filename: row.filename ?? `${row.id}.md`,
    date: row.date,
    folder: row.folder ?? 'Notes',
    coverTone: row.cover_tone ?? 'graphite',
    contentMarkdown: row.content_markdown ?? undefined,
    content: row.content ?? [],
  }
}

export function mapSettingsDetails(details: SettingsDetailRow[] | null) {
  if (!Array.isArray(details)) return []

  return details.flatMap((item) => {
    if (typeof item.label !== 'string' || typeof item.value !== 'string') return []
    return [{ label: item.label, value: item.value }]
  })
}
