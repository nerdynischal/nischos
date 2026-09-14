import { Fragment } from 'react'
import { selectDockProjects } from '../content/projectOrdering'
import type { Project } from '../content/types'
import type { DesktopWindow, WindowCategory } from '../types'
import { getProjectWindowId, LEGACY_WORK_APP, SYSTEM_APPS } from './appRegistry'
import { IconArtwork } from './IconArtwork'
import { useDockMagnification } from './useDockMagnification'

type PinnedDockItem = {
  id: string
  label: string
  category: WindowCategory
  tone: string
  thumbnail?: string
  windowId: string
}

export function Dock({
  windows,
  projects,
  onOpenProject,
  onOpenBlog,
  onOpenLegacyWork,
  onOpenSettings,
  onFocusWindow,
}: {
  windows: DesktopWindow[]
  projects: Project[]
  onOpenProject: (projectId: string) => void
  onOpenBlog: () => void
  onOpenLegacyWork: () => void
  onOpenSettings: () => void
  onFocusWindow: (id: string) => void
}) {
  const {
    dockRef,
    tooltipRef,
    tooltip,
    handlePointerMove,
    handlePointerLeave,
    handleItemFocus,
    handleItemBlur,
  } = useDockMagnification()
  const pinnedItems: PinnedDockItem[] = [
    ...selectDockProjects(projects).map((project) => ({
      id: project.id,
      label: project.title,
      category: 'project' as const,
      tone: project.iconTone,
      thumbnail: project.thumbnail,
      windowId: getProjectWindowId(project.id),
    })),
    ...[SYSTEM_APPS[0], LEGACY_WORK_APP, SYSTEM_APPS[1]].map(({ label, category, tone }) => ({
      id: category === 'folder' ? LEGACY_WORK_APP.id : category,
      label,
      category,
      tone,
      windowId: category === 'folder' ? LEGACY_WORK_APP.id : category,
    })),
  ]

  const windowsById = new Map(windows.map((item) => [item.id, item]))
  const projectsById = new Map(projects.map((project) => [project.id, project]))
  const pinnedWindowIds = new Set(pinnedItems.map((item) => item.windowId))
  const extraWindows = windows.filter((item) => !pinnedWindowIds.has(item.id))

  function handlePinnedClick(item: PinnedDockItem) {
    const openWindow = windowsById.get(item.windowId)

    if (openWindow) {
      onFocusWindow(openWindow.id)
      return
    }

    if (item.category === 'project') onOpenProject(item.id)
    if (item.category === 'blog') onOpenBlog()
    if (item.category === 'folder') onOpenLegacyWork()
    if (item.category === 'settings') onOpenSettings()
  }

  return (
    <nav
      ref={dockRef}
      className="dock"
      aria-label="Dock"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="dock-background" aria-hidden="true" />
      {pinnedItems.map((item) => {
        const openWindow = windowsById.get(item.windowId)

        return (
          <Fragment key={item.id}>
            {item.category === 'blog' ? <span className="dock-separator" aria-hidden="true" /> : null}
            <button
              type="button"
              className={`dock-item dock-tone-${item.tone} ${item.category === 'project' ? 'dock-desktop-only' : ''} ${openWindow ? 'is-open' : ''}`}
              data-dock-id={item.id}
              data-dock-label={item.label}
              onClick={() => handlePinnedClick(item)}
              onFocus={handleItemFocus}
              onBlur={handleItemBlur}
              aria-label={`${openWindow ? 'Focus' : 'Open'} ${item.label}`}
            >
              <IconArtwork
                artworkId={item.id}
                thumbnail={item.category === 'project' ? item.thumbnail : undefined}
                variant={item.category}
              />
            </button>
          </Fragment>
        )
      })}
      {extraWindows.map((item) => {
        const project =
          item.category === 'project' ? projectsById.get(item.refId ?? '') : undefined

        return (
          <button
            key={item.id}
            type="button"
            className={`dock-item dock-desktop-only dock-tone-${project?.iconTone ?? 'note'} is-open`}
            data-dock-id={item.id}
            data-dock-label={item.title}
            onClick={() => onFocusWindow(item.id)}
            onFocus={handleItemFocus}
            onBlur={handleItemBlur}
            aria-label={`Focus ${item.title}`}
          >
            <IconArtwork
              artworkId={project?.id}
              thumbnail={project?.thumbnail}
              variant={item.category}
            />
          </button>
        )
      })}
      <span
        ref={tooltipRef}
        className="dock-tooltip"
        data-visible={tooltip !== null}
        data-source={tooltip?.source}
        aria-hidden="true"
      >
        {tooltip?.label ?? ''}
      </span>
    </nav>
  )
}
