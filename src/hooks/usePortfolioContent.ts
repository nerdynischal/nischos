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
} from '../lib/supabase'

export function usePortfolioContent() {
  const [settingsSections, setSettingsSections] = useState(fallbackSettingsSections)
  const [activeSection, setActiveSection] = useState(DEFAULT_SETTINGS_SECTION_ID)
  const [projects, setProjects] = useState(fallbackProjects)
  const [posts, setPosts] = useState(fallbackPosts)

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

      if (remoteProjects) setProjects(remoteProjects)
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
    activeSection,
    setActiveSection,
  }
}

function getLoadedContent<T>(label: string, result: PromiseSettledResult<T[]>) {
  if (result.status === 'fulfilled') return result.value.length > 0 ? result.value : null

  if (import.meta.env.DEV) {
    console.warn(`Unable to load ${label} from Supabase; using local fallback content.`, result.reason)
  }

  return null
}
