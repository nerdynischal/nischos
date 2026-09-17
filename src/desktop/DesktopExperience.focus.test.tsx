// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { DesktopExperience } from './DesktopExperience'
import { ThemeContext } from '../theme/theme-context'

vi.mock('../hooks/usePortfolioContent', async () => {
  const { projects, posts, settingsSections } = await import('../content')
  return { usePortfolioContent: () => ({
    projects, posts, settingsSections, supabaseStatus: 'connected',
    activeSection: 'about', setActiveSection: vi.fn(),
  }) }
})
vi.mock('../windows/WindowContent', () => ({
  WindowContent: ({ onOpenProject }: { onOpenProject: (id: string) => void }) => (
    <><button onClick={() => onOpenProject('auto-gmail')}>Open case study</button>
      <a href="#reader">Reader action</a></>
  ),
}))

let container: HTMLDivElement
let root: Root
let mobile: boolean
let mediaListeners: Set<() => void>

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('scrollTo', vi.fn())
  mobile = false
  mediaListeners = new Set()
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    get matches() { return query === '(max-width: 760px)' && mobile },
    addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener),
  })))
  // jsdom has no layout. Focusability/inert and actual clipping are also checked in-browser.
  const rect = new DOMRect(0, 0, 100, 40)
  vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue(
    Object.assign([rect], { item: (index: number) => index === 0 ? rect : null }),
  )
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  act(() => root.render(
    <ThemeContext value={{ resolvedTheme: 'dark', toggleTheme: vi.fn() }}>
      <DesktopExperience isEntering={false} isPreparing={false} />
    </ThemeContext>,
  ))
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function element(selector: string) {
  const result = container.querySelector<HTMLElement>(selector)
  if (!result) throw new Error(`Missing ${selector}`)
  return result
}
function activate(selector: string, focus = true) {
  const target = element(selector)
  act(() => {
    if (focus) target.focus()
    target.click()
  })
  return target
}
function heading(id: string) {
  return element(`[data-window-id="${id}"] h2`)
}
function resizeMobile() {
  act(() => {
    mobile = true
    mediaListeners.forEach((listener) => listener())
  })
}

it('moves focus into windows opened from either launcher and restores their opener', () => {
  for (const launcher of ['.desktop-icons', '.dock']) {
    const opener = activate(`${launcher} [aria-label="Open Notes"]`)
    expect(document.activeElement).toBe(heading('blog'))
    activate('[aria-label="Close Notes"]')
    expect(document.activeElement).toBe(opener)
  }
})

it('remembers pointer invokers even when the browser does not focus a clicked button', () => {
  const opener = activate('.desktop-icons [aria-label="Open Notes"]', false)
  expect(document.activeElement).toBe(heading('blog'))
  activate('[aria-label="Close Notes"]')
  expect(document.activeElement).toBe(opener)
})

it('explicit dock switching enters the window but ordinary control focus is preserved', () => {
  activate('.dock [aria-label="Open Notes"]')
  activate('.dock [aria-label="Open About"]')
  activate('.dock [aria-label="Focus Notes"]')
  expect(document.activeElement).toBe(heading('blog'))
  const link = element('[data-window-id="settings"] a')
  act(() => link.focus())
  expect(document.activeElement).toBe(link)
  expect(element('[data-window-id="settings"]').classList.contains('is-active')).toBe(true)
  expect(element('[data-window-id="blog"]').hasAttribute('inert')).toBe(false)
})

it('makes covered mobile controls inert while leaving the dock available', () => {
  resizeMobile()
  activate('.desktop-icons [aria-label="Open Notes"]')
  activate('.dock [aria-label="Open About"]')
  expect(element('.desktop-icons').hasAttribute('inert')).toBe(true)
  expect(element('[data-window-id="blog"]').hasAttribute('inert')).toBe(true)
  expect(element('[data-window-id="settings"]').hasAttribute('inert')).toBe(false)
  expect(element('.dock').closest('[inert]')).toBeNull()
  activate('.dock [aria-label="Focus Notes"]')
  expect(document.activeElement).toBe(heading('blog'))
  expect(element('[data-window-id="blog"]').hasAttribute('inert')).toBe(false)
})

it('reactivates the invoking window before restoring its control on mobile', () => {
  resizeMobile()
  activate('.dock [aria-label="Open Selected Work"]')
  const opener = activate('[data-window-id="selected-work"] .window-body button')
  expect(document.activeElement).toBe(heading('project:auto-gmail'))
  activate('[aria-label="Close Auto Gmail"]')
  expect(document.activeElement).toBe(opener)
  expect(element('[data-window-id="selected-work"]').hasAttribute('inert')).toBe(false)
})

it('uses a surviving window when the original opener has been removed', () => {
  activate('.dock [aria-label="Open Selected Work"]')
  activate('[data-window-id="selected-work"] .window-body button')
  activate('[aria-label="Close Selected Work"]')
  activate('.dock [aria-label="Open Notes"]')
  activate('[aria-label="Close Auto Gmail"]')
  expect(document.activeElement).toBe(heading('blog'))
})

it('does not restore focus to a desktop shortcut covered by another window', () => {
  activate('.desktop-icons [aria-label="Open Notes"]')
  activate('.dock [aria-label="Open About"]')
  activate('[aria-label="Close Notes"]')
  expect(document.activeElement).toBe(heading('settings'))
})

it('moves focus out of newly inert content when changing to the mobile layout', () => {
  activate('.desktop-icons [aria-label="Open Notes"]')
  act(() => element('.desktop-icons [aria-label="Open About"]').focus())
  resizeMobile()
  expect(document.activeElement).toBe(heading('blog'))
})
