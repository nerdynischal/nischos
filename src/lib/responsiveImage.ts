import generatedMedia from '../generated/media.json'
import { resolveMediaSource } from './mediaSource'
import { resolveAssetUrl } from './assetUrl'

type ImageMetadata = {
  width: number
  height: number
  variants: { src: string; width: number }[]
}

const media: Record<string, ImageMetadata> = generatedMedia

/** Unknown media retain their original URL. Mirrored remote images use local variants. */
export function responsiveImage(source: string, sizes: string, baseUrl = import.meta.env.BASE_URL) {
  const localSource = resolveMediaSource(source)
  const metadata = media[localSource]
  if (!metadata) return { src: resolveAssetUrl(localSource, baseUrl) }

  return {
    src: resolveAssetUrl(metadata.variants[0].src, baseUrl),
    srcSet: metadata.variants.map(({ src, width }) => `${resolveAssetUrl(src, baseUrl)} ${width}w`).join(', '),
    sizes,
    width: metadata.width,
    height: metadata.height,
  }
}
