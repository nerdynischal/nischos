import { useEffect, useState } from 'react'
import { responsiveImage } from '../../lib/responsiveImage'

const screenshotSizes = '(max-width: 760px) calc(100vw - 48px), 1040px'

function loadScreenshot(source: string) {
  const image = new Image()
  const attributes = responsiveImage(source, screenshotSizes)
  image.decoding = 'async'
  if (attributes.sizes) image.sizes = attributes.sizes
  if (attributes.srcSet) image.srcset = attributes.srcSet
  image.src = attributes.src
  return image
}

export function ScreenshotImage({ source, alt, nextSource, direction, onError }: {
  source: string
  alt: string
  nextSource?: string
  direction: 'next' | 'previous'
  onError: () => void
}) {
  const [frame, setFrame] = useState({ source, alt, previous: '', direction })

  useEffect(() => {
    if (!nextSource || nextSource === source) return
    loadScreenshot(nextSource)
  }, [nextSource, source])

  useEffect(() => {
    if (source === frame.source) return
    let cancelled = false
    const image = loadScreenshot(source)
    image.decode().then(() => {
      if (cancelled) return
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setFrame((current) => ({ source, alt, previous: reduceMotion ? '' : current.source, direction }))
    }).catch(() => {
      if (!cancelled) onError()
    })
    return () => { cancelled = true }
  }, [source, alt, frame.source, direction, onError])

  return (
    <>
      <img
        key={frame.source}
        className={frame.previous ? `screenshot-incoming slide-${frame.direction}` : undefined}
        {...responsiveImage(frame.source, screenshotSizes)}
        alt={frame.alt}
        loading="lazy"
        decoding="async"
        onError={onError}
      />
      {frame.previous && (
        <img
          key={`${frame.previous}-${frame.source}`}
          className={`screenshot-outgoing slide-${frame.direction}`}
          {...responsiveImage(frame.previous, screenshotSizes)}
          alt=""
          aria-hidden="true"
          onAnimationEnd={() => setFrame((current) => ({ ...current, previous: '' }))}
        />
      )}
    </>
  )
}
