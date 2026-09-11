import generatedMedia from '../generated/media.json'
import { resolveAssetUrl } from './assetUrl'

type ImageMetadata = {
  width: number
  height: number
  variants: { src: string; width: number }[]
}

const media: Record<string, ImageMetadata> = generatedMedia

/** Unknown and remote media retain their original URL. Originals remain available for zooming. */
export function responsiveImage(source: string, sizes: string, baseUrl = import.meta.env.BASE_URL) {
  const metadata = media[source]
  if (!metadata) return { src: resolveAssetUrl(source, baseUrl) }

  return {
    src: resolveAssetUrl(metadata.variants[0].src, baseUrl),
    srcSet: metadata.variants.map(({ src, width }) => `${resolveAssetUrl(src, baseUrl)} ${width}w`).join(', '),
    sizes,
    width: metadata.width,
    height: metadata.height,
  }
}
