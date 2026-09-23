import alternatives from '../../content/screenshot-alternatives.json'
import remoteMedia from '../../content/remote-media.json'
import type { Project } from './types'

const descriptions: Record<string, string> = { ...alternatives }
for (const [remote, local] of Object.entries(remoteMedia)) {
  if (descriptions[remote]) descriptions[local] = descriptions[remote]
}

/** Match the asset, never its position or basename: remote lists can be reordered. */
export function getScreenshotAlternative(project: Project, source: string): string {
  if (!/^(?:https?:\/\/|\/)/.test(source)) return source
  const description = descriptions[source.split(/[?#]/)[0]]
  // Unreviewed remote assets get project purpose, without inventing visual details.
  return description ?? `Interface preview. ${project.story || project.subtitle}`
}
