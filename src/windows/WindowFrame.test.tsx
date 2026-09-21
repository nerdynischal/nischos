// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { WindowFrame } from './WindowFrame'

it('exposes adjustment buttons, reports geometry, and restores focus on Escape and Done', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const geometry = { x: 40, y: 40, width: 600, height: 400 }
  const onAdjust = vi.fn(() => geometry)
  const onStartDrag = vi.fn()
  try {
    act(() => root.render(<WindowFrame
      desktopWindow={{ ...geometry, id: 'notes', title: 'Notes', category: 'blog', z: 1 }}
      isActive onFocus={vi.fn()} onClose={vi.fn()} onStartDrag={onStartDrag}
      onMoveDrag={vi.fn()} onEndDrag={vi.fn()} onAdjust={onAdjust}
    ><p>Window content</p></WindowFrame>))
    const toggle = container.querySelector<HTMLButtonElement>('.window-arrange-toggle')!
    const panel = container.querySelector<HTMLElement>('.window-arrange-panel')!
    expect(toggle.getAttribute('aria-label')).toBe('More options for Notes')
    expect(panel.hidden).toBe(true)
    act(() => { toggle.focus(); toggle.click() })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(toggle.getAttribute('aria-controls')).toBe(panel.id)
    const buttons = [...panel.querySelectorAll('button')]
    expect(panel.getAttribute('role')).toBe('dialog')
    expect(document.activeElement).toBe(buttons[0])
    expect(buttons.map((button) => button.textContent)).toEqual(['Left', 'Right', 'Up', 'Down', 'Narrower', 'Wider', 'Shorter', 'Taller', 'Done'])
    act(() => { buttons[1].focus(); buttons[1].click() })
    expect(onAdjust).toHaveBeenCalledWith('notes', 'right', container.querySelector('article'), 8)
    expect(panel.querySelector('[role="status"]')?.textContent).toBe('Position: 40x · 40y\nSize: 600w × 400h')
    expect(document.activeElement).toBe(buttons[1])
    act(() => buttons[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
    expect(panel.hidden).toBe(true)
    expect(document.activeElement).toBe(toggle)
    act(() => toggle.click())
    act(() => buttons[8].click())
    expect(panel.hidden).toBe(true)
    expect(document.activeElement).toBe(toggle)
    act(() => toggle.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true })))
    expect(onStartDrag).not.toHaveBeenCalled()
    act(() => toggle.click())
    act(() => document.body.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true })))
    expect(panel.hidden).toBe(true)
    expect(document.activeElement).toBe(toggle)
  } finally {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  }
})
