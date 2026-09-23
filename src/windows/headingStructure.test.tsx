// @vitest-environment jsdom
import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { projects, posts, settingsSections } from '../content'
import { legacyProjects } from '../content/legacyProjects'
import { BlogWindow } from '../features/blog/BlogWindow'
import { usePostContent } from '../features/blog/usePostContent'
import { ProjectWindow } from '../features/projects/ProjectWindow'
import { LegacyProjectWindow } from '../features/projects/LegacyProjectWindow'
import { LegacyWorkWindow } from '../features/projects/LegacyWorkWindow'
import { SettingsWindow } from '../features/settings/SettingsWindow'
import { EmptyState } from '../components/EmptyState'
import { AppErrorBoundary } from '../components/AppErrorBoundary'
import { WindowFrame } from './WindowFrame'
import { WindowSkeleton } from './WindowSkeleton'
import type { WindowCategory } from '../types'

vi.mock('../features/blog/usePostContent', () => ({ usePostContent: vi.fn() }))

let roots: Root[] = []
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false })))
  vi.mocked(usePostContent).mockReturnValue({ status: 'ready', markdown: '', retry: vi.fn() })
})
afterEach(() => {
  act(() => roots.forEach((root) => root.unmount()))
  roots = []
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function render(children: ReactNode) {
  const host = document.createElement('div')
  const root = createRoot(host)
  roots.push(root)
  act(() => root.render(children))
  return host
}

function headings(host: Element) {
  // Mobile list titles are hidden on desktop, where the detail pane supplies H1.
  return [...host.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((heading) =>
    !heading.classList.contains('mobile-list-heading'),
  ).map((heading) => [
    heading.tagName.toLowerCase(), heading.textContent,
  ])
}

const geometry = { x: 0, y: 0, width: 800, height: 600 }
const appProject = projects.find((project) => !legacyProjects.some((legacy) => legacy.id === project.id))!
function frame(category: WindowCategory, title: string, children: ReactNode) {
  return <WindowFrame desktopWindow={{ ...geometry, id: 'test', category, title, z: 1 }}
    isActive onFocus={vi.fn()} onClose={vi.fn()} onStartDrag={vi.fn()}
    onMoveDrag={vi.fn()} onEndDrag={vi.fn()} onAdjust={vi.fn()}>{children}</WindowFrame>
}

it.each([
  ['# Section\n## Child\n#### Deep\n## Sibling\n# Next', [
    ['h2', 'Section'], ['h3', 'Child'], ['h4', 'Deep'], ['h3', 'Sibling'], ['h2', 'Next'],
  ]],
  ['## Section\n### Child\n## Next', [['h2', 'Section'], ['h3', 'Child'], ['h2', 'Next']]],
  ['#### Section\n###### Child', [['h2', 'Section'], ['h3', 'Child']]],
  ['# One\n## Two\n### Three\n#### Four\n##### Five\n###### Six', [
    ['h2', 'One'], ['h3', 'Two'], ['h4', 'Three'], ['h5', 'Four'], ['h6', 'Five'], ['h6', 'Six'],
  ]],
])('renders Markdown sections beneath the note title: %s', (markdown, expected) => {
  vi.mocked(usePostContent).mockReturnValue({ status: 'ready', markdown: `# ${posts[0].title}\n\n${markdown}`, retry: vi.fn() })
  const host = render(frame('blog', 'Notes', <BlogWindow posts={[posts[0]]} onSelectPost={vi.fn()} />))
  expect(headings(host)).toEqual([['h1', posts[0].title], ...expected])
  expect(headings(host.querySelector('nav')!)).toEqual([])
})

it.each(['loading', 'error', 'fallback'] as const)('keeps the note title during %s', (status) => {
  vi.mocked(usePostContent).mockReturnValue({ id: posts[0].id, attempt: 0, status, markdown: '## Saved section', retry: vi.fn() })
  const host = render(<BlogWindow posts={[posts[0]]} onSelectPost={vi.fn()} />)
  expect(headings(host)).toEqual(status === 'fallback'
    ? [['h1', posts[0].title], ['h2', 'Saved section']]
    : [['h1', posts[0].title]])
  expect(host.querySelector('[role="status"]')).not.toBeNull()
})

it('uses the Selected Work frame as the heading, without turning file labels into headings', () => {
  const host = render(frame('folder', 'Selected Work', <LegacyWorkWindow projects={legacyProjects} onOpenProject={vi.fn()} />))
  expect(host.querySelectorAll('h1,h2,h3,h4,h5,h6')).toHaveLength(1)
  const title = host.querySelector('h1.window-title')!
  // The titlebar uses mutually exclusive desktop/mobile text spans.
  expect(title.querySelector('.window-title-desktop')?.textContent).toBe('Selected Work')
  expect(title.querySelector('.window-title-mobile')?.textContent).toBe('Selected Work')
  expect(host.querySelectorAll('.legacy-file')).toHaveLength(legacyProjects.length)
})

it('renders project sections under their title and groups each metadata term with its description', () => {
  const project = appProject
  const host = render(frame('project', project.title, <ProjectWindow project={project} hasLinkedPost={false} onOpenBlog={vi.fn()} />))
  expect(headings(host)).toEqual([['h1', project.title], ['h2', project.subtitle]])
  const list = host.querySelector('dl.project-meta')!
  expect([...list.children].map((group) => [...group.children].map((child) => [child.tagName.toLowerCase(), child.textContent])))
    .toEqual([[['dt', 'type'], ['dd', project.type]], [['dt', 'model'], ['dd', project.model]]])
  expect(headings(list)).toEqual([])
})

it('gives every case study an H1 and H2 section titles', () => {
  for (const project of legacyProjects) {
    const host = render(<LegacyProjectWindow project={project} />)
    expect(headings(host)).toEqual([
      ['h1', project.title], ...project.caseStudy!.sections.map((section) => ['h2', section.title]),
    ])
  }
})

it.each(settingsSections)('keeps Settings section $id above its groups and tools', (section) => {
  const host = render(frame('settings', 'About', <SettingsWindow activeSection={section.id} settingsSections={settingsSections} onChangeSection={vi.fn()} />))
  // CSS displays the mobile header or the desktop profile heading, never both.
  expect(headings(host.querySelector('.settings-mobile-header')!)).toEqual([
    ['h1', section.displaySubtitle ?? section.displayTitle ?? section.label],
  ])
  expect(headings(host.querySelector('.profile-heading')!)).toEqual([['h1', section.displayTitle ?? section.label]])
  expect(headings(host.querySelector('.settings-sidebar')!)).toEqual([])
  expect(headings(host).filter(([tag]) => tag !== 'h1')).toEqual(
    section.toolGroups?.flatMap((group) => [
      ['h2', group.label], ...group.tools.map((tool) => ['h3', tool.title]),
    ]) ?? [],
  )
})

it('gives standalone empty and missing-content states a top-level heading', () => {
  expect(headings(render(<BlogWindow posts={[]} onSelectPost={vi.fn()} />))).toEqual([['h1', 'No notes yet']])
  expect(headings(render(<SettingsWindow activeSection="about" settingsSections={[]} onChangeSection={vi.fn()} />))).toEqual([['h1', 'About unavailable']])
  expect(headings(render(frame('project', 'Missing', <EmptyState title="Project missing" body="This app moved somewhere else." />))))
    .toEqual([['h1', 'Project missing']])
})

it('provides mobile list headings when the Notes and Settings detail panes are hidden', () => {
  const notes = render(<BlogWindow posts={posts} onSelectPost={vi.fn()} />)
  const settings = render(<SettingsWindow activeSection="about" settingsSections={settingsSections} onChangeSection={vi.fn()} />)
  for (const [host, name] of [[notes, 'Notes'], [settings, 'About']] as const) {
    expect(host.querySelector('[data-mobile-detail="false"]')).not.toBeNull()
    expect(host.querySelector('nav > h1.mobile-list-heading')?.textContent).toBe(name)
  }
})

it('gives the fatal error a top-level heading', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  function Broken(): ReactNode { throw new Error('Test render failure') }
  const host = render(<AppErrorBoundary><Broken /></AppErrorBoundary>)
  expect(headings(host)).toEqual([['h1', 'Something went wrong.']])
  expect(host.querySelector('[role="alert"]')).not.toBeNull()
})

it.each([
  ['folder', undefined], ['blog', posts[0].id], ['project', appProject.id],
  ['project', legacyProjects[0].id], ['settings', undefined],
] as const)('hides placeholder headings from assistive technology while opening %s', (category, refId) => {
  vi.useFakeTimers()
  const host = render(<WindowSkeleton desktopWindow={{ ...geometry, id: 'test', title: 'Preview', category, refId, z: 1 }}
    projects={projects} posts={posts} settingsSections={settingsSections} activeSection="tools" />)
  act(() => vi.advanceTimersByTime(180))
  expect(host.querySelector('[role="status"]')?.textContent).toBe('Opening Preview…')
  const shapes = host.querySelector('.skeleton-shapes')!
  expect(shapes.getAttribute('aria-hidden')).toBe('true')
  expect(shapes.hasAttribute('inert')).toBe(true)
  expect([...host.querySelectorAll('h1,h2,h3,h4,h5,h6')].every((heading) => shapes.contains(heading))).toBe(true)
  if (category === 'project' && refId === appProject.id) {
    expect(headings(shapes)).toEqual([['h1', appProject.title], ['h2', appProject.subtitle]])
    expect([...shapes.querySelectorAll('.project-meta > div')].map((group) =>
      [...group.children].map((child) => [child.tagName.toLowerCase(), child.textContent]),
    )).toEqual([[['dt', 'type'], ['dd', appProject.type]], [['dt', 'model'], ['dd', appProject.model]]])
  }
})
