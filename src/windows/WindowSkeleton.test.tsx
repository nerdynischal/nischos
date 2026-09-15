// @vitest-environment jsdom
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { WindowSkeleton } from './WindowSkeleton'
import { legacyProjectSummaries } from '../content/legacyProjectSummaries'
import { projects, posts, settingsSections } from '../content'
import type { WindowCategory } from '../types'

function render(category: WindowCategory, refId?: string) {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(<WindowSkeleton
    desktopWindow={{ id: 'preview', category, refId, title: 'Preview', x: 0, y: 0, width: 800, height: 600, z: 1 }}
    projects={projects} posts={posts} settingsSections={settingsSections} activeSection="about"
  />)
  return container
}

it('uses the actual folder file count, toolbar, and inert controls', () => {
  const container = render('folder')
  expect(container.querySelectorAll('.legacy-file')).toHaveLength(legacyProjectSummaries.length)
  expect(container.querySelector('.legacy-folder-toolbar')?.textContent).toContain(`${legacyProjectSummaries.length} files`)
  expect(container.querySelector('.skeleton-shapes')?.hasAttribute('inert')).toBe(true)
})

it('distinguishes case studies from app-style project layouts', () => {
  const legacy = render('project', legacyProjectSummaries[0].id)
  expect(legacy.querySelector('.legacy-project-cover')).not.toBeNull()
  expect(legacy.querySelector('.project-hero')).toBeNull()
  const project = projects.find((item) => !legacyProjectSummaries.some((legacy) => legacy.id === item.id))!
  const app = render('project', project.id)
  expect(app.querySelector('.project-hero')).not.toBeNull()
  expect(app.querySelector('.project-meta')).not.toBeNull()
})

it('matches the note selection and mobile list/detail state', () => {
  expect(render('blog').querySelector('.finder')?.getAttribute('data-mobile-detail')).toBe('false')
  const detail = render('blog', posts[0].id)
  expect(detail.querySelector('.finder')?.getAttribute('data-mobile-detail')).toBe('true')
  expect(detail.querySelectorAll('.blog-post-nav button')).toHaveLength(posts.length)
  expect(detail.querySelector('header h3')?.textContent).toBe(posts[0].title)
})
