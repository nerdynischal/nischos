import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import alternatives from '../../content/screenshot-alternatives.json'
import remoteMedia from '../../content/remote-media.json'
import { loadProjectManifests } from './projectManifest'
import { getScreenshotAlternative } from './screenshotAlternatives'
import { mergeProjects } from '../lib/supabase'
import { ProjectWindow } from '../features/projects/ProjectWindow'

const projects = loadProjectManifests()
const project = projects.find(({ id }) => id === 'keyform')!

describe('screenshot alternatives', () => {
  it('provides an authored description for every published project screenshot', () => {
    for (const item of projects) {
      for (const source of item.screenshots) {
        expect(alternatives, source).toHaveProperty(source)
      }
    }
  })

  it('uses the same description for remote originals, mirrors and query variants', () => {
    for (const [remote, local] of Object.entries(remoteMedia)) {
      const description = getScreenshotAlternative(project, remote)
      expect(getScreenshotAlternative(project, local)).toBe(description)
      expect(getScreenshotAlternative(project, `${remote}?version=2#preview`)).toBe(description)
    }
  })

  it('keeps descriptions attached to assets when remote content reorders screenshots', () => {
    const remote = { ...project, screenshots: [...project.screenshots].reverse() }
    const [merged] = mergeProjects([remote], [project])
    const markup = renderToStaticMarkup(
      <ProjectWindow project={merged} hasLinkedPost={false} onOpenBlog={() => {}} />,
    )
    expect(markup).toContain('alt="Keyform: Keyform in Windows mode, showing Windows and Alt key legends on the interactive keyboard."')
    expect(markup).toContain('Show screenshot 1: Keyform in Windows mode')
    expect(markup).not.toContain('Keyform windows')
    expect(markup).toContain('aria-hidden="true"')
    expect(markup).toContain('alt=""')
  })

  it('uses project purpose for unreviewed remote assets without guessing from filenames or positions', () => {
    const description = getScreenshotAlternative(project, 'https://example.com/keyform-mac.jpg')
    expect(description).toBe(`Interface preview. ${project.story}`)
    expect(description).not.toContain('Mac mode')
    expect(getScreenshotAlternative(project, 'An authored text-only preview')).toBe('An authored text-only preview')
  })
})
