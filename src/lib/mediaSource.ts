import remoteMedia from '../../content/remote-media.json'
import verifiedAliases from '../../content/media-aliases.json'

/** Explicit asset identities: aliases are verified by bytes, never by filename. */
export const mediaAliases: Record<string, string> = { ...remoteMedia, ...verifiedAliases }

export function resolveMediaSource(source: string) {
  return mediaAliases[source.split(/[?#]/)[0]] ?? source
}
