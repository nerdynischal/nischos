import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import type { Project } from '../../content/types'
import { IconArtwork } from '../../desktop/IconArtwork'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { MetaRow } from './MetaRow'
import { LegacyProjectWindow } from './LegacyProjectWindow'

function isImageScreenshot(screenshot: string) {
  return /^(?:https?:\/\/|\/)/.test(screenshot)
}

function getScreenshotLabel(screenshot: string, index: number) {
  if (!isImageScreenshot(screenshot)) return screenshot

  const filename = screenshot.split('/').pop()?.split('?')[0]
  const label = filename?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : `Screenshot ${index + 1}`
}

export function ProjectWindow({
  project,
  hasLinkedPost,
  onOpenBlog,
}: {
  project: Project
  hasLinkedPost: boolean
  onOpenBlog: (postId?: string) => void
}) {
  const [activeShot, setActiveShot] = useState(0)
  const [failedScreenshot, setFailedScreenshot] = useState<string | null>(null)
  const projectScreenshots = project.screenshots
  const screenshotCount = projectScreenshots.length
  const selectedShotIndex = screenshotCount > 0 ? activeShot % screenshotCount : 0
  const selectedScreenshot = projectScreenshots[selectedShotIndex]
  const selectedScreenshotLabel = selectedScreenshot
    ? getScreenshotLabel(selectedScreenshot, selectedShotIndex)
    : 'Screenshot unavailable'
  const selectedScreenshotUrl = selectedScreenshot
    ? resolveAssetUrl(selectedScreenshot)
    : undefined
  const selectedScreenshotIsImage = Boolean(
    selectedScreenshot &&
    selectedScreenshotUrl &&
    isImageScreenshot(selectedScreenshot) &&
    selectedScreenshotUrl !== failedScreenshot,
  )

  if (project.caseStudy) {
    return <LegacyProjectWindow project={project} />
  }

  function showPreviousShot() {
    setActiveShot((index) => (index - 1 + screenshotCount) % screenshotCount)
  }

  function showNextShot() {
    setActiveShot((index) => (index + 1) % screenshotCount)
  }

  return (
    <div className="project-window">
      <section className="project-hero">
        <div className={`project-icon tone-${project.iconTone}`} aria-hidden="true">
          <IconArtwork artworkId={project.id} thumbnail={project.thumbnail} variant="project" />
        </div>
        <div className="project-heading">
          <h3>{project.title}</h3>
          <p>{project.type}</p>
          <div className="project-actions">
            {project.demoUrl ? (
              <a className="primary-action" href={project.demoUrl} target="_blank" rel="noreferrer">
                Visit Website
                <ExternalLink
                  className="external-link-icon"
                  strokeWidth={1.7}
                  absoluteStrokeWidth
                  aria-hidden="true"
                />
              </a>
            ) : (
              <button type="button" className="primary-action disabled-action" disabled>
                Visit Website
              </button>
            )}
            {project.sourceUrl ? (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                Source Code
                <ExternalLink
                  className="external-link-icon"
                  strokeWidth={1.7}
                  absoluteStrokeWidth
                  aria-hidden="true"
                />
              </a>
            ) : (
              <button type="button" className="disabled-action" disabled>
                Source Code
              </button>
            )}
            {hasLinkedPost ? (
              <button type="button" onClick={() => onOpenBlog(project.postId)}>
                Related Note
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="project-meta" aria-label="Project metadata">
        <MetaRow label="type" value={project.type} />
        <MetaRow label="model" value={project.model} />
      </section>

      <section className="story-panel">
        <h4>{project.subtitle}</h4>
        <p>{project.story}</p>
      </section>

      <section className="screenshot-carousel" aria-label={`${project.title} screenshots`}>
        <div
          className={`screenshot-card shot-${selectedShotIndex + 1} ${
            selectedScreenshotIsImage ? 'has-image' : ''
          }`}
        >
          {selectedScreenshotIsImage ? (
            <img
              src={selectedScreenshotUrl}
              alt={`${project.title}: ${selectedScreenshotLabel}`}
              loading="lazy"
              decoding="async"
              onError={() => setFailedScreenshot(selectedScreenshotUrl ?? null)}
            />
          ) : (
            <span>{selectedScreenshotLabel}</span>
          )}
        </div>
        {screenshotCount > 1 ? (
          <div className="carousel-controls" aria-label="Screenshot carousel controls">
            <button type="button" onClick={showPreviousShot} aria-label="Show previous screenshot">
              <ChevronLeft strokeWidth={1.8} absoluteStrokeWidth aria-hidden="true" />
            </button>
            <div className="carousel-dots" aria-label="Screenshot selector">
              {projectScreenshots.map((screenshot, index) => {
                const label = getScreenshotLabel(screenshot, index)
                return (
                  <button
                    key={`${screenshot}-${index}`}
                    type="button"
                    className={index === selectedShotIndex ? 'is-active' : ''}
                    onClick={() => setActiveShot(index)}
                    aria-label={`Show ${label}`}
                    aria-current={index === selectedShotIndex ? 'true' : undefined}
                  />
                )
              })}
            </div>
            <button type="button" onClick={showNextShot} aria-label="Show next screenshot">
              <ChevronRight strokeWidth={1.8} absoluteStrokeWidth aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
