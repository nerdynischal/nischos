import { useEffect, useMemo, useRef } from 'react'
import { DEFAULT_SETTINGS_SECTION_ID } from '../content'
import { legacyProjectSummaries as legacyProjects } from '../content/legacyProjectSummaries'
import { useDesktopWindows } from '../hooks/useDesktopWindows'
import { usePortfolioContent } from '../hooks/usePortfolioContent'
import { useMobileScrollLock } from '../hooks/useMobileScrollLock'
import { useWindowFocus } from '../hooks/useWindowFocus'
import type { DesktopIcon } from '../types'
import { WindowContent } from '../windows/WindowContent'
import { WindowFrame } from '../windows/WindowFrame'
import { DesktopIcons } from './DesktopIcons'
import { Dock } from './Dock'
import { MenuBar } from './MenuBar'
import { getProjectWindowId, NOTES_APP_LABEL, ABOUT_APP_LABEL } from './appRegistry'
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
    closeWindow: removeWindow,
    startDrag,
    moveDrag,
    endDrag,
    adjustWindow,
  } = useDesktopWindows()
  const { isMobile, prepareOpen, activateWindow, closeWindow, captureInvoker } = useWindowFocus({
    desktopRef, windows, activeWindow, raiseWindow: focusWindow, removeWindow,
  })

  useMobileScrollLock(windows.length > 0)

  const icons = useMemo(() => createDesktopIcons(projects), [projects])
  const allProjects = useMemo(() => [...projects, ...legacyProjects], [projects])

  useEffect(() => {
    if (!isPreparing) {
      desktopRef.current?.focus()
    }
  }, [isPreparing])

  function openProject(projectId: string) {
    const project = allProjects.find((item) => item.id === projectId)
    if (!project) return
    prepareOpen(getProjectWindowId(project.id))
    upsertWindow({
      id: getProjectWindowId(project.id),
      category: 'project',
      refId: project.id,
      title: project.title,
    })
  }

  function openLegacyWork() {
    prepareOpen('selected-work')
    upsertWindow({
      id: 'selected-work',
      category: 'folder',
      title: 'Selected Work',
    })
  }

  function openBlog(postId?: string) {
    const linkedPostId = postId && posts.some((post) => post.id === postId) ? postId : undefined

    prepareOpen('blog')
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
    prepareOpen('settings')
    upsertWindow({
      id: 'settings',
      category: 'settings',
      title: ABOUT_APP_LABEL,
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
      onClickCapture={captureInvoker}
      className="desktop"
      aria-hidden={isPreparing || undefined}
      inert={isPreparing}
      data-entering={isEntering}
      aria-labelledby="desktop-heading"
      tabIndex={-1}
    >
      <a
        className="desktop-skip-link"
        href={activeWindow ? '#active-window-title' : '#desktop-shortcuts'}
        onClick={(event) => {
          event.preventDefault()
          const targetId = activeWindow ? 'active-window-title' : 'desktop-shortcuts'
          document.getElementById(targetId)?.focus({ preventScroll: true })
        }}
      >
        {activeWindow ? `Skip to active window: ${activeWindow.title}` : 'Skip to desktop shortcuts'}
      </a>
      <h1 id="desktop-heading" className="desktop-heading">nischOS portfolio desktop</h1>
      <div className="wallpaper" aria-hidden="true">
        <div className="wallpaper-grid" />
      </div>

      <MenuBar
        activeTitle={activeWindow?.title}
        supabaseStatus={supabaseStatus}
        onOpenAbout={() => openSettings('about')}
      />
      <DesktopIcons
        icons={icons}
        onOpenIcon={openIcon}
        isCovered={windows.length > 0}
        inert={isMobile && windows.length > 0}
      />

      <section className="window-layer">
        {windows.map((desktopWindow) => (
          <WindowFrame
            key={desktopWindow.id}
            desktopWindow={desktopWindow}
            isActive={activeWindow?.id === desktopWindow.id}
            inert={isMobile && activeWindow?.id !== desktopWindow.id}
            onFocus={focusWindow}
            onClose={closeWindow}
            onStartDrag={startDrag}
            onMoveDrag={moveDrag}
            onEndDrag={endDrag}
            onAdjust={adjustWindow}
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
        onOpenLegacyWork={openLegacyWork}
        onOpenSettings={openSettings}
        onFocusWindow={activateWindow}
      />
    </main>
  )
}
