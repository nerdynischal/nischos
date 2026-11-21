import alternatives from '../../content/screenshot-alternatives.json'
import { mediaAliases } from '../lib/mediaSource'
import type { Project } from './types'

const descriptions: Record<string, string> = { ...alternatives }
for (const [remote, local] of Object.entries(mediaAliases)) {
  const description = descriptions[remote] ?? descriptions[local]
  if (description) {
    descriptions[local] = description
    descriptions[remote] = description
  }
}

/** Match the asset, never its position or basename: remote lists can be reordered. */
export function getScreenshotAlternative(project: Project, source: string): string {
  if (!/^(?:https?:\/\/|\/)/.test(source)) return source
  const description = descriptions[source.split(/[?#]/)[0]]
  // Unreviewed remote assets get project purpose, without inventing visual details.
  return description ?? `Interface preview. ${project.story || project.subtitle}`
}
