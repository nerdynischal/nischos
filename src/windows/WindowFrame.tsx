import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { useEffect, useId, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, UnfoldHorizontal, UnfoldVertical, FoldHorizontal, FoldVertical, Check, EllipsisVertical, RulerDimensionLine } from 'lucide-react'
import { WindowTitleContext } from './WindowTitleContext'
import type { DesktopWindow } from '../types'
import type { WindowAdjustment, WindowAdjustmentStep, WindowGeometry } from './windowGeometry'

const actionGroups = [
  { label: 'Move', actions: ['left', 'right', 'up', 'down'] },
  { label: 'Resize', actions: ['narrower', 'wider', 'shorter', 'taller'] },
] as const

const actionIcons = {
  left: ArrowLeft,
  right: ArrowRight,
  up: ArrowUp,
  down: ArrowDown,
  narrower: FoldHorizontal,
  wider: UnfoldHorizontal,
  shorter: FoldVertical,
  taller: UnfoldVertical,
} as const

export function WindowFrame({
  desktopWindow,
  isActive,
  inert = false,
  onFocus,
  onClose,
  onStartDrag,
  onMoveDrag,
  onEndDrag,
  onAdjust,
  children,
}: {
  desktopWindow: DesktopWindow
  isActive: boolean
  inert?: boolean
  onFocus: (id: string) => void
  onClose: (id: string) => void
  onStartDrag: (event: PointerEvent<HTMLElement>, target: DesktopWindow) => void
  onMoveDrag: (event: PointerEvent<HTMLElement>) => void
  onEndDrag: (event: PointerEvent<HTMLElement>) => void
  onAdjust: (id: string, action: WindowAdjustment, element: HTMLElement, step: WindowAdjustmentStep) => WindowGeometry | null
  children: ReactNode
}) {
  const Title = desktopWindow.category === 'folder' ? 'h1' : 'div'
  const [mobileTitle, setMobileTitle] = useState<string | null>(null)
  const [arranging, setArranging] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const [step, setStep] = useState<WindowAdjustmentStep>(8)
  const frameRef = useRef<HTMLElement>(null)
  const arrangeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!arranging) return
    panelRef.current?.querySelector('button')?.focus()

    function dismissOutside(event: Event) {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || arrangeRef.current?.contains(target)) return
      if (event.type === 'pointerdown' && panelRef.current?.contains(document.activeElement)) {
        arrangeRef.current?.focus()
      }
      setArranging(false)
    }

    document.addEventListener('pointerdown', dismissOutside)
    document.addEventListener('focusin', dismissOutside)
    return () => {
      document.removeEventListener('pointerdown', dismissOutside)
      document.removeEventListener('focusin', dismissOutside)
    }
  }, [arranging])

  function adjust(action: WindowAdjustment) {
    if (!frameRef.current) return
    const geometry = onAdjust(desktopWindow.id, action, frameRef.current, step)
    if (!geometry) return
    setAnnouncement(`Position: ${Math.round(geometry.x)}x · ${Math.round(geometry.y)}y\nSize: ${Math.round(geometry.width)}w × ${Math.round(geometry.height)}h`)
  }

  return (
    <article
      ref={frameRef}
      data-window-id={desktopWindow.id}
      inert={inert}
      className={`window window-${desktopWindow.category} ${
        isActive ? 'is-active' : 'is-inactive'
      }`}
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
      onFocusCapture={isActive ? undefined : () => onFocus(desktopWindow.id)}
      aria-label={desktopWindow.title}
    >
      <header
        className="window-titlebar"
        onPointerDown={(event) => startOnHandle(event, desktopWindow, onStartDrag)}
        onPointerMove={onMoveDrag}
        onPointerUp={onEndDrag}
        onPointerCancel={onEndDrag}
        onLostPointerCapture={onEndDrag}
      >
        <div className="traffic-lights">
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
        <Title id={isActive ? 'active-window-title' : undefined} className="window-title" tabIndex={-1} data-window-focus-target>
          <span className="window-title-desktop">{desktopWindow.title}</span>
          <span className="window-title-mobile">{mobileTitle ?? desktopWindow.title}</span>
        </Title>
        <button
          ref={arrangeRef}
          type="button"
          className="window-arrange-toggle"
          aria-label={`More options for ${desktopWindow.title}`}
          title="More"
          aria-expanded={arranging}
          aria-haspopup="dialog"
          aria-controls={panelId}
          onClick={() => { setArranging(!arranging); setAnnouncement('') }}
        >
          <EllipsisVertical size={16} aria-hidden="true" />
        </button>
      </header>
      <section
        ref={panelRef}
        role="dialog"
        id={panelId}
        className="window-arrange-panel"
        aria-label={`Move and resize ${desktopWindow.title}`}
        hidden={!arranging}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') return
          event.preventDefault()
          event.stopPropagation()
          setArranging(false)
          arrangeRef.current?.focus()
        }}
      >
        <div className="window-arrange-groups">
          {actionGroups.map(({ label, actions }) => (
            <fieldset key={label}>
              <legend>{label}</legend>
              {actions.map((action) => {
                const Icon = actionIcons[action]
                return (
                <button key={action} type="button" onClick={() => adjust(action)}>
                  <Icon size={14} aria-hidden="true" />
                  {action[0].toUpperCase() + action.slice(1)}
                </button>
                )
              })}
            </fieldset>
          ))}
        </div>
        <label className="window-arrange-step">
          <RulerDimensionLine size={14} aria-hidden="true" />
          Increment
          <select value={step} onChange={(event) => setStep(Number(event.target.value) as WindowAdjustmentStep)}>
            <option value={1}>1px</option>
            <option value={4}>4px</option>
            <option value={8}>8px</option>
            <option value={16}>16px</option>
            <option value={32}>32px</option>
          </select>
        </label>
        <p role="status" aria-atomic="true">{announcement}</p>
        <button type="button" onClick={() => { setArranging(false); arrangeRef.current?.focus() }}>
          <Check size={14} aria-hidden="true" />
          Done
        </button>
      </section>
      <div className="window-body">
        <WindowTitleContext value={setMobileTitle}>{children}</WindowTitleContext>
      </div>
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
