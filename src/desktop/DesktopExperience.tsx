import { useEffect, useMemo, useRef } from 'react'
import { DEFAULT_SETTINGS_SECTION_ID } from '../content'
import { legacyProjectSummaries as legacyProjects } from '../content/legacyProjectSummaries'
import { useDesktopWindows } from '../hooks/useDesktopWindows'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import type { DesktopIcon } from '../types'
import { WindowContent } from '../windows/WindowContent'
import { WindowFrame } from '../windows/WindowFrame'
import { DesktopIcons } from './DesktopIcons'
import { Dock } from './Dock'
import { MenuBar } from './MenuBar'
import { getProjectWindowId, NOTES_APP_LABEL } from './appRegistry'
import { createDesktopIcons } from './createDesktopIcons'

type DesktopExperienceProps = {
  isEntering: boolean
  isPreparing: boolean
}

export function DesktopExperience({ isEntering, isPreparing }: DesktopExperienceProps) {
  const desktopRef = useRef<HTMLElement>(null)
  const {
    projects,
    posts,
    settingsSections,
    supabaseStatus,
    activeSection,
    setActiveSection,
  } = usePortfolioContent()
  const {
    windows,
    activeWindow,
    focusWindow,
    upsertWindow,
    closeWindow,
    startDrag,
    moveDrag,
    endDrag,
  } = useDesktopWindows()

  const icons = useMemo(() => createDesktopIcons(projects), [projects])
  const allProjects = useMemo(() => [...projects, ...legacyProjects], [projects])

  useEffect(() => {
    if (isEntering) {
      desktopRef.current?.focus()
    }
  }, [isEntering])

  function openProject(projectId: string) {
    const project = allProjects.find((item) => item.id === projectId)
    if (!project) return
    upsertWindow({
      id: getProjectWindowId(project.id),
      category: 'project',
      refId: project.id,
      title: project.title,
    })
  }

  function openLegacyWork() {
    upsertWindow({
      id: 'selected-work',
      category: 'folder',
      title: 'Selected Work',
    })
  }

  function openBlog(postId?: string) {
    const linkedPostId = postId && posts.some((post) => post.id === postId) ? postId : undefined

    upsertWindow({
      id: 'blog',
      category: 'blog',
      refId: linkedPostId,
      title: NOTES_APP_LABEL,
    })
  }

  function openSettings(sectionId = settingsSections[0]?.id ?? DEFAULT_SETTINGS_SECTION_ID) {
    const nextSection = settingsSections.some((section) => section.id === sectionId)
      ? sectionId
      : settingsSections[0]?.id ?? DEFAULT_SETTINGS_SECTION_ID
    setActiveSection(nextSection)
    upsertWindow({
      id: 'settings',
      category: 'settings',
      title: 'Nischal',
    })
  }

  function openIcon(icon: DesktopIcon) {
    switch (icon.category) {
      case 'blog':
        openBlog()
        break
      case 'settings':
        openSettings()
        break
      case 'folder':
        openLegacyWork()
        break
      case 'project':
        openProject(icon.id)
        break
    }
  }

  return (
    <main
      ref={desktopRef}
      className="desktop"
      hidden={isPreparing}
      inert={isPreparing}
      data-entering={isEntering}
      aria-label="nischOS Desktop"
      tabIndex={isEntering ? -1 : undefined}
    >
      <div className="wallpaper" aria-hidden="true">
        <div className="wallpaper-grid" />
      </div>

      <MenuBar
        activeTitle={activeWindow?.title}
        supabaseStatus={supabaseStatus}
        onOpenAbout={() => openSettings('about')}
      />
      <DesktopIcons icons={icons} onOpenIcon={openIcon} />

      <section className="window-layer" aria-live="polite">
        {windows.map((desktopWindow) => (
          <WindowFrame
            key={desktopWindow.id}
            desktopWindow={desktopWindow}
            isActive={activeWindow?.id === desktopWindow.id}
            onFocus={focusWindow}
            onClose={closeWindow}
            onStartDrag={startDrag}
            onMoveDrag={moveDrag}
            onEndDrag={endDrag}
          >
            <WindowContent
              desktopWindow={desktopWindow}
              projects={allProjects}
              posts={posts}
              onOpenBlog={openBlog}
              onOpenProject={openProject}
              activeSection={activeSection}
              onChangeSection={setActiveSection}
              settingsSections={settingsSections}
            />
          </WindowFrame>
        ))}
      </section>

      <Dock
        windows={windows}
        projects={allProjects}
        onOpenProject={openProject}
        onOpenBlog={openBlog}
        onOpenSettings={openSettings}
        onFocusWindow={focusWindow}
      />
    </main>
  )
}
