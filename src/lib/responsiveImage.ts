import generatedMedia from '../generated/media.json'
import remoteMedia from '../../content/remote-media.json'
import { resolveAssetUrl } from './assetUrl'

type ImageMetadata = {
  width: number
  height: number
  variants: { src: string; width: number }[]
}

const media: Record<string, ImageMetadata> = generatedMedia
const remoteAliases: Record<string, string> = remoteMedia

/** Unknown media retain their original URL. Mirrored remote images use local variants. */
export function responsiveImage(source: string, sizes: string, baseUrl = import.meta.env.BASE_URL) {
  const metadata = media[remoteAliases[source] ?? source]
  if (!metadata) return { src: resolveAssetUrl(source, baseUrl) }

  return {
    src: resolveAssetUrl(metadata.variants[0].src, baseUrl),
    srcSet: metadata.variants.map(({ src, width }) => `${resolveAssetUrl(src, baseUrl)} ${width}w`).join(', '),
    sizes,
    width: metadata.width,
    height: metadata.height,
  }
}
