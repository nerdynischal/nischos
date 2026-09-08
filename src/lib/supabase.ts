import type { SupabaseClient } from '@supabase/supabase-js'
import {
  projects as fallbackProjects,
  settingsSections as fallbackSettingsSections,
} from '../content'
import { sortProjects } from '../content/projectOrdering'
import type {
  BlogPost,
  Project,
  SettingsSection,
  SettingsToolGroup,
} from '../content/types'
import type { Database } from './database.types'

type ProjectTableRow = Database['public']['Tables']['projects']['Row']

export type ProjectRow = Omit<ProjectTableRow, 'created_at'>

const projectModelFallbacks = new Map(
  fallbackProjects.map((project) => [project.id, project.model]),
)

type BlogPostTableRow = Database['public']['Tables']['blog_posts']['Row']

export type BlogPostRow = Omit<BlogPostTableRow, 'created_at'>

type SettingsSectionTableRow = Database['public']['Tables']['settings_sections']['Row']

export type SettingsSectionRow = Omit<
  SettingsSectionTableRow,
  'created_at' | 'details' | 'sort_order'
> & {
  details: unknown
}

type SupabasePublicEnv = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_PUBLISHABLE_KEY?: string
  VITE_SUPABASE_ANON_KEY?: string
}

export function readSupabaseConfig(env: SupabasePublicEnv) {
  const url = env.VITE_SUPABASE_URL?.trim()
  const publishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim()
  const key = publishableKey || anonKey

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
      'id,title,subtitle,icon_tone,thumbnail,type,model,sort_order,dock_order,story,screenshots,demo_url,source_url,post_id',
    )
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true })

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
    sortOrder: row.sort_order,
    dockOrder: row.dock_order ?? undefined,
    story: row.story ?? '',
    screenshots: row.screenshots ?? [],
    demoUrl: row.demo_url ?? undefined,
    sourceUrl: row.source_url ?? undefined,
    postId: row.post_id ?? undefined,
  }
}

export function mergeProjects(
  remoteProjects: Project[],
  localProjects: Project[] = fallbackProjects,
): Project[] {
  const remoteProjectsById = new Map(
    remoteProjects.map((project) => [project.id, project]),
  )
  const localProjectIds = new Set(localProjects.map((project) => project.id))

  return sortProjects([
    ...localProjects.map((project) => remoteProjectsById.get(project.id) ?? project),
    ...remoteProjects.filter((project) => !localProjectIds.has(project.id)),
  ])
}

export function mergeSettingsSections(
  remoteSections: SettingsSection[],
  localSections: SettingsSection[] = fallbackSettingsSections,
): SettingsSection[] {
  const remoteSectionsById = new Map(
    remoteSections.map((section) => [section.id, section]),
  )
  const localSectionIds = new Set(localSections.map((section) => section.id))

  return [
    ...localSections.map((section) => {
      const remoteSection = remoteSectionsById.get(section.id)
      if (!remoteSection) return section

      return {
        ...section,
        ...remoteSection,
        displayTitle: remoteSection.displayTitle ?? section.displayTitle,
        displaySubtitle: remoteSection.displaySubtitle ?? section.displaySubtitle,
        details: mergeSettingsDetails(remoteSection.details, section.details),
        toolGroups: remoteSection.toolGroups?.length
          ? remoteSection.toolGroups
          : section.toolGroups,
      }
    }),
    ...remoteSections.filter((section) => !localSectionIds.has(section.id)),
  ]
}

function mergeSettingsDetails(
  remoteDetails: SettingsSection['details'],
  localDetails: SettingsSection['details'],
) {
  if (!remoteDetails?.length) return localDetails

  const localDetailsByLabel = new Map(
    localDetails?.map((detail) => [detail.label, detail]),
  )

  return remoteDetails.map((detail) => {
    const localDetail = localDetailsByLabel.get(detail.label)
    if (!localDetail) return detail
    if (detail.value.trim().toLowerCase() === 'placeholder') return localDetail

    return {
      ...localDetail,
      ...detail,
      href: detail.href ?? localDetail.href,
    }
  })
}

export function mapSettingsSection(row: SettingsSectionRow): SettingsSection {
  return {
    id: row.id,
    label: row.label,
    displayTitle: row.display_title ?? undefined,
    displaySubtitle: row.display_subtitle ?? undefined,
    body: row.body ?? '',
    details: mapSettingsDetails(row.details),
    toolGroups: mapSettingsToolGroups(row.details),
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

export function mapSettingsDetails(details: unknown) {
  if (!Array.isArray(details)) return []

  return details.flatMap((item) => {
    if (!isRecord(item)) return []
    if (typeof item.label !== 'string' || typeof item.value !== 'string') return []
    return [
      {
        label: item.label,
        value: item.value,
        href: mapExternalUrl(item.href),
      },
    ]
  })
}

export function mapSettingsToolGroups(details: unknown): SettingsToolGroup[] {
  if (!Array.isArray(details)) return []

  return details.flatMap((group) => {
    if (
      !isRecord(group) ||
      typeof group.id !== 'string' ||
      typeof group.label !== 'string' ||
      !Array.isArray(group.tools)
    ) {
      return []
    }

    const tools = group.tools.flatMap((tool) => {
      if (
        !isRecord(tool) ||
        typeof tool.title !== 'string' ||
        typeof tool.description !== 'string' ||
        typeof tool.icon !== 'string'
      ) {
        return []
      }

      return [
        {
          title: tool.title,
          description: tool.description,
          icon: tool.icon,
          url: mapExternalUrl(tool.url),
        },
      ]
    })

    return tools.length ? [{ id: group.id, label: group.label, tools }] : []
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function mapExternalUrl(value: unknown) {
  if (typeof value !== 'string') return undefined

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? value
      : undefined
  } catch {
    return undefined
  }
}
