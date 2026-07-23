import { useMemo } from 'react'
import './styles/app.css'
import { settingsSections as fallbackSettingsSections } from './content'
import { DesktopIcons } from './desktop/DesktopIcons'
import { Dock } from './desktop/Dock'
import { MenuBar } from './desktop/MenuBar'
import { createDesktopIcons } from './desktop/createDesktopIcons'
import { useClock } from './hooks/useClock'
import { useDesktopWindows } from './hooks/useDesktopWindows'
import { usePortfolioContent } from './hooks/usePortfolioContent'
import type { DesktopIcon } from './types'
import { WindowContent } from './windows/WindowContent'
import { WindowFrame } from './windows/WindowFrame'

function App() {
  const {
    projects,
    posts,
    settingsSections,
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
  const dateTime = useClock()

  const icons = useMemo(() => createDesktopIcons(projects), [projects])

  function openProject(projectId: string) {
    const project = projects.find((item) => item.id === projectId)
    if (!project) return
    upsertWindow({
      id: `project:${project.id}`,
      kind: 'project',
      refId: project.id,
      title: project.title,
    })
  }

  function openBlog(postId?: string) {
    const linkedPostId = postId && posts.some((post) => post.id === postId) ? postId : undefined

    upsertWindow({
      id: 'blog',
      kind: 'blog',
      refId: linkedPostId,
      title: 'Blog Posts',
    })
  }

  function openSettings(sectionId = settingsSections[0]?.id ?? fallbackSettingsSections[0].id) {
    const nextSection = settingsSections.some((section) => section.id === sectionId)
      ? sectionId
      : settingsSections[0]?.id ?? fallbackSettingsSections[0].id
    setActiveSection(nextSection)
    upsertWindow({
      id: 'settings',
      kind: 'settings',
      title: 'Nischal',
    })
  }

  function openIcon(icon: DesktopIcon) {
    if (icon.kind === 'blog') openBlog()
    if (icon.kind === 'settings') openSettings()
    if (icon.kind === 'project') openProject(icon.id)
  }

  return (
    <main className="desktop" aria-label="nischalOS Desktop">
      <div className="wallpaper" aria-hidden="true">
        <div className="wallpaper-grid" />
      </div>

      <MenuBar
        activeTitle={activeWindow?.title}
        dateTime={dateTime}
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
              projects={projects}
              posts={posts}
              onOpenBlog={openBlog}
              activeSection={activeSection}
              onChangeSection={setActiveSection}
              settingsSections={settingsSections}
            />
          </WindowFrame>
        ))}
      </section>

      <Dock
        windows={windows}
        projects={projects}
        onOpenProject={openProject}
        onOpenBlog={openBlog}
        onOpenSettings={openSettings}
        onFocusWindow={focusWindow}
      />
    </main>
  )
}

export default App
