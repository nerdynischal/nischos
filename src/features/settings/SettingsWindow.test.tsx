// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, expect, it, vi } from 'vitest'
import { settingsSections } from '../../content'
import { SettingsWindow } from './SettingsWindow'
import { WindowTitleContext } from '../../windows/WindowTitleContext'

afterEach(() => vi.unstubAllGlobals())

it('opens mobile sections and returns focus to the chosen list row', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  const setMobileTitle = vi.fn()
  function Harness() {
    const [active, setActive] = useState('about')
    return (
      <WindowTitleContext value={setMobileTitle}>
        <SettingsWindow activeSection={active} onChangeSection={setActive} settingsSections={settingsSections} />
      </WindowTitleContext>
    )
  }
  try {
    act(() => root.render(<Harness />))
    const window = container.querySelector('.settings-window')!
    expect(window.getAttribute('data-mobile-detail')).toBe('false')
    const values = container.querySelector<HTMLButtonElement>('[data-section-id="values"]')!
    const back = container.querySelector<HTMLButtonElement>('.settings-mobile-back')!
    const detail = container.querySelector('.settings-detail')!
    detail.scrollTop = 200
    const backFocus = vi.spyOn(back, 'focus')
    const rowFocus = vi.spyOn(values, 'focus')
    act(() => values.click())
    expect(window.getAttribute('data-mobile-detail')).toBe('true')
    expect(values.getAttribute('aria-current')).toBe('page')
    expect(setMobileTitle).toHaveBeenLastCalledWith(settingsSections.find((section) => section.id === 'values')!.label)
    expect(detail.scrollTop).toBe(0)
    expect(document.activeElement).toBe(back)
    expect(backFocus).toHaveBeenLastCalledWith({ preventScroll: true })
    act(() => back.click())
    expect(window.getAttribute('data-mobile-detail')).toBe('false')
    expect(document.activeElement).toBe(values)
    expect(rowFocus).toHaveBeenLastCalledWith({ preventScroll: true })
    expect(setMobileTitle).toHaveBeenLastCalledWith(null)

    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
    act(() => values.click())
    expect(window.getAttribute('data-mobile-detail')).toBe('false')
  } finally {
    act(() => root.unmount())
    container.remove()
  }
})

it.each([false, true])('opens value details and restores focus (mobile: %s)', (mobile) => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: mobile })))
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  function Harness() {
    const [active, setActive] = useState('about')
    return <SettingsWindow activeSection={active} onChangeSection={setActive} settingsSections={settingsSections} />
  }
  try {
    act(() => root.render(<Harness />))
    act(() => container.querySelector<HTMLButtonElement>('[data-section-id="values"]')!.click())
    const items = settingsSections.find((section) => section.id === 'values')!.items
    for (const item of items) {
      act(() => Array.from(container.querySelectorAll<HTMLButtonElement>('[data-value]')).find((button) => button.dataset.value === item)!.click())
      expect(container.querySelector('.value-description')?.textContent).toContain('Placeholder copy')
      expect(container.querySelector('.profile-heading h1')?.textContent).toBe(item)
      expect(container.querySelectorAll('[data-value]')).toHaveLength(0)
      const back = container.querySelector<HTMLButtonElement>(mobile ? '.settings-mobile-back' : '.values-back')!
      expect(document.activeElement).toBe(back)
      act(() => back.click())
      expect((document.activeElement as HTMLElement).dataset.value).toBe(item)
      expect(container.querySelectorAll('[data-value]')).toHaveLength(items.length)
      if (mobile) expect(container.querySelector('.settings-window')?.getAttribute('data-mobile-detail')).toBe('true')
    }
    act(() => container.querySelector<HTMLButtonElement>('[data-value]')!.click())
    act(() => container.querySelector<HTMLButtonElement>('[data-section-id="hobbies"]')!.click())
    act(() => container.querySelector<HTMLButtonElement>('[data-section-id="values"]')!.click())
    expect(container.querySelectorAll('[data-value]')).toHaveLength(items.length)
  } finally {
    act(() => root.unmount())
    container.remove()
  }
})
