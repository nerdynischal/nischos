// @vitest-environment jsdom
import { act, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { expect, it, vi } from 'vitest'
import { posts } from '../../content'
import { BlogWindow } from './BlogWindow'
import { WindowTitleContext } from '../../windows/WindowTitleContext'

it('opens a mobile note and returns to its list row with focus restored', () => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  const host = document.createElement('div')
  document.body.append(host)
  const root = createRoot(host)
  const setTitle = vi.fn()
  function Harness() {
    const [id, setId] = useState<string>()
    return (
      <WindowTitleContext value={setTitle}>
        <BlogWindow posts={posts} selectedPostId={id} onSelectPost={setId} />
      </WindowTitleContext>
    )
  }
  try {
    act(() => root.render(<Harness />))
    const finder = host.querySelector('.finder')!
    expect(finder.getAttribute('data-mobile-detail')).toBe('false')
    const row = host.querySelector<HTMLButtonElement>('[data-post-id]')!
    const back = host.querySelector<HTMLButtonElement>('.notes-mobile-back')!
    const backFocus = vi.spyOn(back, 'focus')
    const rowFocus = vi.spyOn(row, 'focus')
    act(() => row.click())
    expect(finder.getAttribute('data-mobile-detail')).toBe('true')
    expect(setTitle).toHaveBeenLastCalledWith(posts[0].title)
    expect(document.activeElement).toBe(back)
    expect(backFocus).toHaveBeenLastCalledWith({ preventScroll: true })
    act(() => back.click())
    expect(finder.getAttribute('data-mobile-detail')).toBe('false')
    expect(document.activeElement).toBe(row)
    expect(rowFocus).toHaveBeenLastCalledWith({ preventScroll: true })
    expect(setTitle).toHaveBeenLastCalledWith(null)
    act(() => root.render(<BlogWindow posts={[]} onSelectPost={vi.fn()} />))
    expect(host.textContent).toContain('No notes yet')
  } finally {
    act(() => root.unmount())
    host.remove()
    vi.unstubAllGlobals()
  }
})
