import { useEffect, useState } from 'react'
import {
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
  const [activeSection, setActiveSection] = useState(fallbackSettingsSections[0].id)
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

      const [remoteProjects, remotePosts, remoteSettingsSections] = results

      reportLoadFailure('projects', remoteProjects)
      reportLoadFailure('blog posts', remotePosts)
      reportLoadFailure('settings sections', remoteSettingsSections)

      if (remoteProjects.status === 'fulfilled' && remoteProjects.value.length) {
        setProjects(remoteProjects.value)
      }

      if (remotePosts.status === 'fulfilled' && remotePosts.value.length) {
        setPosts(remotePosts.value)
      }

      if (remoteSettingsSections.status === 'fulfilled' && remoteSettingsSections.value.length) {
        setSettingsSections(remoteSettingsSections.value)
        setActiveSection((currentSection) =>
          remoteSettingsSections.value.some((section) => section.id === currentSection)
            ? currentSection
            : remoteSettingsSections.value[0].id,
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

function reportLoadFailure(label: string, result: PromiseSettledResult<unknown>) {
  if (import.meta.env.DEV && result.status === 'rejected') {
    console.warn(`Unable to load ${label} from Supabase; using local fallback content.`, result.reason)
  }
}
