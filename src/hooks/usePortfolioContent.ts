import { useEffect, useState } from 'react'
import {
  DEFAULT_SETTINGS_SECTION_ID,
  posts as fallbackPosts,
  projects as fallbackProjects,
  settingsSections as fallbackSettingsSections,
} from '../content'
import {
  fetchPostSummaries,
  fetchProjects,
  fetchSettingsSections,
  hasSupabaseConfig,
  mergeProjects,
  mergeSettingsSections,
} from '../lib/supabase'
import type { BlogPostSummary } from '../content/types'

export type SupabaseLoadStatus = 'loading' | 'connected' | 'fallback'

export function usePortfolioContent() {
  const [settingsSections, setSettingsSections] = useState(fallbackSettingsSections)
  const [activeSection, setActiveSection] = useState(DEFAULT_SETTINGS_SECTION_ID)
  const [projects, setProjects] = useState(fallbackProjects)
  const [posts, setPosts] = useState<BlogPostSummary[]>(fallbackPosts)
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseLoadStatus>(
    hasSupabaseConfig ? 'loading' : 'fallback',
  )

  useEffect(() => {
    let ignore = false

    if (!hasSupabaseConfig) return

    async function loadRemoteContent() {
      // Apply each collection as soon as it arrives; status still describes all three.
      const results = await Promise.allSettled([
        fetchProjects().then((items) => {
          if (!ignore && items.length) setProjects(mergeProjects(items))
          return items
        }),
        fetchPostSummaries().then((items) => {
          if (!ignore && items.length) setPosts(items)
          return items
        }),
        fetchSettingsSections().then((items) => {
          if (!ignore && items.length) {
            const merged = mergeSettingsSections(items)
            setSettingsSections(merged)
            setActiveSection((current) =>
              merged.some((section) => section.id === current) ? current : merged[0].id,
            )
          }
          return items
        }),
      ])
      if (ignore) return

      reportLoadFailure('projects', results[0])
      reportLoadFailure('notes', results[1])
      reportLoadFailure('settings sections', results[2])

      setSupabaseStatus(getSupabaseLoadStatus(results))
    }

    void loadRemoteContent()

    return () => {
      ignore = true
    }
  }, [])

  return {
    projects,
    posts,
    settingsSections,
    supabaseStatus,
    activeSection,
    setActiveSection,
  }
}

export function getSupabaseLoadStatus(
  results: PromiseSettledResult<unknown[]>[],
): SupabaseLoadStatus {
  return results.every(
    (result) => result.status === 'fulfilled' && result.value.length > 0,
  )
    ? 'connected'
    : 'fallback'
}

function reportLoadFailure(label: string, result: PromiseSettledResult<unknown[]>) {
  if (import.meta.env.DEV && result.status === 'rejected') {
    console.warn(
      `Unable to load ${label} from Supabase; using local fallback content.`,
      result.reason,
    )
  }
}
