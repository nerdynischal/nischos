import { useId, useLayoutEffect, useRef } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'
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
  const dialogRef = useRef<HTMLDialogElement>(null)
  const captionId = useId()
  const { image, returnFocusTo } = selection

  useLayoutEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // The desktop owns body scroll locking on mobile; lock the root separately
    // so resizing across its breakpoint while viewing an image cannot undo it.
    const scrollRoot = document.documentElement
    const previousOverflow = scrollRoot.style.overflow

    // Native modality makes the whole background inert, including the dock and
    // window chrome. A portal avoids the window's transformed containing block.
    dialog.showModal()
    scrollRoot.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      dialog.close()
      scrollRoot.style.overflow = previousOverflow
      if (returnFocusTo.isConnected) returnFocusTo.focus({ preventScroll: true })
    }
  }, [returnFocusTo])

  function closeViewer() {
    onClose()
  }

  function closeFromBackdrop(event: MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) closeViewer()
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="legacy-image-lightbox"
      aria-modal="true"
      aria-labelledby={captionId}
      onClick={(event) => {
        event.stopPropagation()
        closeFromBackdrop(event)
      }}
      onCancel={(event) => {
        event.preventDefault()
        closeViewer()
      }}
      onClose={(event) => {
        // Ignore a queued close event if StrictMode has already reopened it.
        if (!event.currentTarget.open) onClose()
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
    </dialog>,
    document.body,
  )
}
