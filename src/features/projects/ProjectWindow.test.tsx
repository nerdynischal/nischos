// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { projects } from '../../content'
import type { Project } from '../../content/types'
import { ProjectWindow } from './ProjectWindow'

// Keep these tests about carousel selection and failure ownership; decoding is
// exercised separately by ScreenshotImage tests.
vi.mock('./ScreenshotImage', () => ({
  ScreenshotImage: ({ source, onError }: { source: string; onError: (source: string) => void }) => (
    <img src={source} alt="Preview" onError={() => onError(source)} />
  ),
}))

let host: HTMLDivElement
let root: Root
let project: Project

function render() {
  act(() => root.render(<ProjectWindow project={project} hasLinkedPost={false} onOpenBlog={() => {}} />))
}
function click(label: string) {
  act(() => host.querySelector<HTMLButtonElement>(`[aria-label="${label}"]`)!.click())
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  host = document.createElement('div')
  root = createRoot(host)
  project = { ...projects[0], screenshots: ['/one.png', '/two.png', '/three.png', '/four.png'] }
})
afterEach(() => {
  act(() => root.unmount())
  vi.unstubAllGlobals()
})

it('navigates immediately from the visible index after remote screenshots shrink', () => {
  render()
  for (let index = 0; index < 3; index++) click('Show next screenshot')
  project = { ...project, screenshots: project.screenshots.slice(0, 2) }
  render()
  expect(host.querySelector('.screenshot-card img')?.getAttribute('src')).toBe('/two.png')
  click('Show previous screenshot')
  expect(host.querySelector('.screenshot-card img')?.getAttribute('src')).toBe('/one.png')
})

it('retains image failure fallbacks when navigating between failed screenshots', () => {
  render()
  act(() => host.querySelector('.screenshot-card img')!.dispatchEvent(new Event('error')))
  click('Show next screenshot')
  act(() => host.querySelector('.screenshot-card img')!.dispatchEvent(new Event('error')))
  click('Show previous screenshot')
  expect(host.querySelector('.screenshot-card img')).toBeNull()
  expect(host.querySelector('.screenshot-card span')?.textContent).toBeTruthy()
})
