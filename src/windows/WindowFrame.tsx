import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import type { DesktopWindow } from '../types'

export function WindowFrame({
  desktopWindow,
  isActive,
  onFocus,
  onClose,
  onStartDrag,
  onMoveDrag,
  onEndDrag,
  children,
}: {
  desktopWindow: DesktopWindow
  isActive: boolean
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onStartDrag: (event: PointerEvent<HTMLElement>, target: DesktopWindow) => void
  onMoveDrag: (event: PointerEvent<HTMLElement>) => void
  onEndDrag: (event: PointerEvent<HTMLElement>) => void
  children: ReactNode
}) {
  return (
    <article
      className={`window window-${desktopWindow.category} ${isActive ? 'is-active' : 'is-inactive'}`}
      style={
        {
          '--window-x': `${desktopWindow.x}px`,
          '--window-y': `${desktopWindow.y}px`,
          '--window-width': `${desktopWindow.width}px`,
          '--window-height': `${desktopWindow.height}px`,
          zIndex: desktopWindow.z,
        } as CSSProperties
      }
      onPointerDown={isActive ? undefined : () => onFocus(desktopWindow.id)}
      aria-label={desktopWindow.title}
    >
      <header
        className="window-titlebar"
        onPointerDown={(event) => startOnHandle(event, desktopWindow, onStartDrag)}
        onPointerMove={onMoveDrag}
        onPointerUp={onEndDrag}
        onPointerCancel={onEndDrag}
      >
        <div className="traffic-lights" aria-label="Window controls">
          <button
            type="button"
            className="traffic traffic-close"
            aria-label={`Close ${desktopWindow.title}`}
            onClick={(event) => {
              event.stopPropagation()
              onClose(desktopWindow.id)
            }}
          />
          <span className="traffic traffic-minimize" aria-hidden="true" />
          <span className="traffic traffic-zoom" aria-hidden="true" />
        </div>
        <h2>{desktopWindow.title}</h2>
      </header>
      <div className="window-body">{children}</div>
    </article>
  )
}

function startOnHandle(
  event: PointerEvent<HTMLElement>,
  target: DesktopWindow,
  onStartDrag: (event: PointerEvent<HTMLElement>, target: DesktopWindow) => void,
) {
  const element = event.target as HTMLElement
  if (element.closest('button')) return
  onStartDrag(event, target)
}
