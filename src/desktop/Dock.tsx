import { Fragment } from 'react'
import type { Project } from '../content'
import type { DesktopWindow } from '../types'
import { IconArtwork } from './IconArtwork'
import { selectPinnedProjects } from './selectPinnedProjects'
import { useDockMagnification } from './useDockMagnification'

export function Dock({
  windows,
  projects,
  onOpenProject,
  onOpenBlog,
  onOpenSettings,
  onFocusWindow,
}: {
  windows: DesktopWindow[]
  projects: Project[]
  onOpenProject: (projectId: string) => void
  onOpenBlog: () => void
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
  const pinnedItems = [
    ...selectPinnedProjects(projects).map((project) => ({
      id: project.id,
      label: project.title,
      kind: 'project' as const,
      tone: project.iconTone,
      thumbnail: project.thumbnail,
      windowId: `project:${project.id}`,
    })),
    {
      id: 'blog',
      label: 'Blog Posts',
      kind: 'blog' as const,
      tone: 'folder',
      windowId: 'blog',
    },
    {
      id: 'settings',
      label: 'About',
      kind: 'settings' as const,
      tone: 'settings',
      windowId: 'settings',
    },
  ]

  const pinnedWindowIds = new Set(pinnedItems.map((item) => item.windowId))
  const extraWindows = windows.filter((item) => !pinnedWindowIds.has(item.id))

  function handlePinnedClick(item: (typeof pinnedItems)[number]) {
    const openWindow = windows.find((windowItem) => windowItem.id === item.windowId)

    if (openWindow) {
      onFocusWindow(openWindow.id)
      return
    }

    if (item.kind === 'project') onOpenProject(item.id)
    if (item.kind === 'blog') onOpenBlog()
    if (item.kind === 'settings') onOpenSettings()
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
        const openWindow = windows.find((windowItem) => windowItem.id === item.windowId)

        return (
          <Fragment key={item.id}>
            {item.kind === 'blog' ? <span className="dock-separator" aria-hidden="true" /> : null}
            <button
              type="button"
              className={`dock-item dock-tone-${item.tone} ${openWindow ? 'is-open' : ''}`}
              data-dock-id={item.id}
              data-dock-label={item.label}
              onClick={() => handlePinnedClick(item)}
              onFocus={handleItemFocus}
              onBlur={handleItemBlur}
              aria-label={`${openWindow ? 'Focus' : 'Open'} ${item.label}`}
            >
              <IconArtwork
                artworkId={item.id}
                thumbnail={item.kind === 'project' ? item.thumbnail : undefined}
                variant={item.kind}
              />
            </button>
          </Fragment>
        )
      })}
      {extraWindows.map((item) => {
        const project = item.kind === 'project'
          ? projects.find((projectItem) => projectItem.id === item.refId)
          : undefined
        const variant =
          item.kind === 'blog' ? 'blog' : item.kind === 'settings' ? 'settings' : 'project'

        return (
          <button
            key={item.id}
            type="button"
            className="dock-item dock-tone-note is-open"
            data-dock-id={item.id}
            data-dock-label={item.title}
            onClick={() => onFocusWindow(item.id)}
            onFocus={handleItemFocus}
            onBlur={handleItemBlur}
            aria-label={`Focus ${item.title}`}
          >
            <IconArtwork artworkId={project?.id} thumbnail={project?.thumbnail} variant={variant} />
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
