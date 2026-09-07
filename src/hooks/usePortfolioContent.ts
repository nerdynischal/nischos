import { useEffect, useState } from 'react'
import {
  DEFAULT_SETTINGS_SECTION_ID,
  posts as fallbackPosts,
  projects as fallbackProjects,
  settingsSections as fallbackSettingsSections,
} from '../content'
import {
  fetchPosts,
  fetchProjects,
  fetchSettingsSections,
  hasSupabaseConfig,
  mergeProjects,
} from '../lib/supabase'

export type SupabaseLoadStatus = 'loading' | 'connected' | 'fallback'

export function usePortfolioContent() {
  const [settingsSections, setSettingsSections] = useState(fallbackSettingsSections)
  const [activeSection, setActiveSection] = useState(DEFAULT_SETTINGS_SECTION_ID)
  const [projects, setProjects] = useState(fallbackProjects)
  const [posts, setPosts] = useState(fallbackPosts)
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseLoadStatus>(
    hasSupabaseConfig ? 'loading' : 'fallback',
  )

  useEffect(() => {
    let ignore = false

    if (!hasSupabaseConfig) return

    async function loadRemoteContent() {
      const results = await Promise.allSettled([
        fetchProjects(),
        fetchPosts(),
        fetchSettingsSections(),
      ])
      if (ignore) return

      const remoteProjects = getLoadedContent('projects', results[0])
      const remotePosts = getLoadedContent('notes', results[1])
      const remoteSettingsSections = getLoadedContent('settings sections', results[2])

      setSupabaseStatus(getSupabaseLoadStatus(results))

      if (remoteProjects) setProjects(mergeProjects(remoteProjects))
      if (remotePosts) setPosts(remotePosts)

      if (remoteSettingsSections) {
        setSettingsSections(remoteSettingsSections)
        setActiveSection((currentSection) =>
          remoteSettingsSections.some((section) => section.id === currentSection)
            ? currentSection
            : remoteSettingsSections[0].id,
        )
      }
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

function getLoadedContent<T>(label: string, result: PromiseSettledResult<T[]>) {
  if (result.status === 'fulfilled') return result.value.length > 0 ? result.value : null

  if (import.meta.env.DEV) {
    console.warn(`Unable to load ${label} from Supabase; using local fallback content.`, result.reason)
  }

  return null
}
