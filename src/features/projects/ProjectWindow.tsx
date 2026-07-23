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
  const selectedScreenshot = projectScreenshots[activeShot] ?? projectScreenshots[0]
  const selectedScreenshotLabel = selectedScreenshot
    ? getScreenshotLabel(selectedScreenshot, activeShot)
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
                Live Demo
              </a>
            ) : (
              <span className="primary-action disabled-action">Live Demo</span>
            )}
            {project.sourceUrl ? (
              <a href={project.sourceUrl} target="_blank" rel="noreferrer">
                Source
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
        <MetaRow label="kind" value={project.type} />
        <MetaRow label="stack" value={project.stack.join(', ')} />
      </section>

      <section className="story-panel">
        <h4>{project.subtitle}</h4>
        <p>{project.story}</p>
      </section>

      <section className="screenshot-carousel" aria-label={`${project.title} screenshots`}>
        <div
          className={`screenshot-card shot-${activeShot + 1} ${
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
                    className={index === activeShot ? 'is-active' : ''}
                    onClick={() => setActiveShot(index)}
                    aria-label={`Show ${label}`}
                    aria-current={index === activeShot ? 'true' : undefined}
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
