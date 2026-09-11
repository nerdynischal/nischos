import { useEffect, useId, useRef } from 'react'
import type { MouseEvent } from 'react'
import { X, ZoomIn } from 'lucide-react'
import type { ProjectCaseStudyImage } from '../../content/types'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { responsiveImage } from '../../lib/responsiveImage'

export type ImageViewerSelection = {
  image: ProjectCaseStudyImage
  returnFocusTo: HTMLButtonElement
}

export function ImageZoomButton({
  image,
  previewAlt = image.alt,
  loading = 'lazy',
  sizes = '(max-width: 760px) calc(100vw - 48px), 704px',
  onOpen,
}: {
  image: ProjectCaseStudyImage
  previewAlt?: string
  loading?: 'eager' | 'lazy'
  sizes?: string
  onOpen: (selection: ImageViewerSelection) => void
}) {
  function openViewer(event: MouseEvent<HTMLButtonElement>) {
    onOpen({ image, returnFocusTo: event.currentTarget })
  }

  return (
    <button
      type="button"
      className="legacy-image-zoom-trigger"
      aria-label={`View ${image.caption ?? image.alt} larger`}
      onClick={openViewer}
    >
      <img
        {...responsiveImage(image.src, sizes)}
        alt={previewAlt}
        loading={loading}
        decoding="async"
      />
      <span className="legacy-image-zoom-indicator" aria-hidden="true">
        <ZoomIn size={16} strokeWidth={1.8} />
      </span>
    </button>
  )
}

export function LegacyImageLightbox({
  selection,
  onClose,
}: {
  selection: ImageViewerSelection
  onClose: () => void
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const captionId = useId()
  const { image, returnFocusTo } = selection

  useEffect(() => {
    const windowBody = closeButtonRef.current?.closest<HTMLElement>('.window-body')
    const previousOverflow = windowBody?.style.overflow

    if (windowBody) windowBody.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      if (windowBody) windowBody.style.overflow = previousOverflow ?? ''
    }
  }, [])

  function closeViewer() {
    onClose()
    window.requestAnimationFrame(() => returnFocusTo.focus())
  }

  function closeFromBackdrop(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) closeViewer()
  }

  return (
    <div
      className="legacy-image-lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby={captionId}
      onClick={closeFromBackdrop}
      onKeyDown={(event) => {
        if (event.key === 'Escape') closeViewer()
        if (event.key === 'Tab') {
          event.preventDefault()
          closeButtonRef.current?.focus()
        }
      }}
    >
      <figure className="legacy-image-lightbox-content" onClick={closeFromBackdrop}>
        <img src={resolveAssetUrl(image.src)} alt={image.alt} />
        <figcaption id={captionId}>{image.caption ?? image.alt}</figcaption>
      </figure>
      <button
        ref={closeButtonRef}
        type="button"
        className="legacy-image-lightbox-close"
        aria-label="Close image viewer"
        onClick={closeViewer}
      >
        <X size={18} strokeWidth={1.8} />
      </button>
    </div>
  )
}
