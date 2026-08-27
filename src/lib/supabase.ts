import type { SupabaseClient } from '@supabase/supabase-js'
import { projects as fallbackProjects } from '../content'
import type { BlogPost, Project, SettingsSection } from '../content'
import type { Database } from './database.types'

type ProjectTableRow = Database['public']['Tables']['projects']['Row']

export type ProjectRow = Omit<ProjectTableRow, 'created_at'>

const projectModelFallbacks = new Map(
  fallbackProjects.map((project) => [project.id, project.model]),
)

type BlogPostTableRow = Database['public']['Tables']['blog_posts']['Row']

export type BlogPostRow = Omit<BlogPostTableRow, 'created_at'>

export type SettingsDetailRow = {
  label?: unknown
  value?: unknown
}

type SettingsSectionTableRow = Database['public']['Tables']['settings_sections']['Row']

export type SettingsSectionRow = Omit<
  SettingsSectionTableRow,
  'created_at' | 'details' | 'sort_order'
> & {
  details: SettingsDetailRow[] | null
}

type SupabasePublicEnv = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_PUBLISHABLE_KEY?: string
  VITE_SUPABASE_ANON_KEY?: string
}

export function readSupabaseConfig(env: SupabasePublicEnv) {
  const url = env.VITE_SUPABASE_URL?.trim()
  const key = (
    env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY
  )?.trim()

  if (!url || !key) return null

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') return null
  } catch {
    return null
  }

  return { url, key }
}

const supabaseConfig = readSupabaseConfig({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
})

export const hasSupabaseConfig = Boolean(supabaseConfig)

let supabaseClientPromise: Promise<SupabaseClient<Database>> | null = null

async function getSupabaseClient() {
  if (!supabaseConfig) return null

  supabaseClientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient<Database>(supabaseConfig.url, supabaseConfig.key, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    }),
  )

  return supabaseClientPromise
}

export async function fetchProjects(): Promise<Project[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('projects')
    .select(
      'id,title,subtitle,icon_tone,thumbnail,type,model,story,screenshots,demo_url,source_url,post_id',
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(mapProject)
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,title,date,folder,is_pinned,content_markdown')
    .order('date', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return sortPosts((data ?? []).map(mapPost))
}

export async function fetchSettingsSections(): Promise<SettingsSection[]> {
  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('settings_sections')
    .select('id,label,display_title,display_subtitle,body,details,items')
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
    model: row.model ?? projectModelFallbacks.get(row.id) ?? 'Not specified',
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
    date: row.date,
    folder: row.folder ?? 'Notes',
    isPinned: row.is_pinned,
    contentMarkdown: row.content_markdown,
  }
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((left, right) => {
    if (left.isPinned !== right.isPinned) return left.isPinned ? -1 : 1
    return right.date.localeCompare(left.date)
  })
}

export function mapSettingsDetails(details: SettingsDetailRow[] | null) {
  if (!Array.isArray(details)) return []

  return details.flatMap((item) => {
    if (typeof item.label !== 'string' || typeof item.value !== 'string') return []
    return [{ label: item.label, value: item.value }]
  })
}
