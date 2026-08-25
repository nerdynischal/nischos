import { useState } from 'react'
import type { Project } from '../../content'
import { IconArtwork } from '../../desktop/IconArtwork'
import { MetaRow } from './MetaRow'

function isImageScreenshot(screenshot: string) {
  return /^(?:https?:\/\/|\/)/.test(screenshot)
}

function getScreenshotLabel(screenshot: string, index: number) {
  if (!isImageScreenshot(screenshot)) return screenshot

  const filename = screenshot.split('/').pop()?.split('?')[0]
  const label = filename?.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
  return label ? label.charAt(0).toUpperCase() + label.slice(1) : `Screenshot ${index + 1}`
}

function ExternalLinkIcon() {
  return (
    <svg
      className="external-link-icon"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9 3H13V7" />
      <path d="M13 3L7.25 8.75" />
      <path d="M11.5 9V11.5C11.5 12.33 10.83 13 10 13H4.5C3.67 13 3 12.33 3 11.5V6C3 5.17 3.67 4.5 4.5 4.5H7" />
    </svg>
  )
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
  const projectScreenshots = project.screenshots
  const screenshotCount = projectScreenshots.length
  const selectedShotIndex = screenshotCount > 0 ? activeShot % screenshotCount : 0
  const selectedScreenshot = projectScreenshots[selectedShotIndex]
  const selectedScreenshotLabel = selectedScreenshot
    ? getScreenshotLabel(selectedScreenshot, selectedShotIndex)
    : 'Screenshot unavailable'
  const selectedScreenshotIsImage = selectedScreenshot
    ? isImageScreenshot(selectedScreenshot)
    : false

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
                <ExternalLinkIcon />
              </a>
            ) : (
              <span className="primary-action disabled-action">Visit Website</span>
            )}
            {project.sourceUrl ? (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                Source Code
                <ExternalLinkIcon />
              </a>
            ) : null}
            {hasLinkedPost ? (
              <button type="button" onClick={() => onOpenBlog(project.postId)}>
                Blog Story
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
            <img src={selectedScreenshot} alt={`${project.title}: ${selectedScreenshotLabel}`} />
          ) : (
            <span>{selectedScreenshotLabel}</span>
          )}
        </div>
        {screenshotCount > 1 ? (
          <div className="carousel-controls" aria-label="Screenshot carousel controls">
            <button type="button" onClick={showPreviousShot} aria-label="Show previous screenshot">
              ‹
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
              ›
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
