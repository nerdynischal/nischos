import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import type { Project } from '../../content/types'
import { IconArtwork } from '../../desktop/IconArtwork'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { ScreenshotImage } from './ScreenshotImage'
import { MetaRow } from './MetaRow'
import { ProjectActions } from './ProjectActions'
import { getScreenshotAlternative } from '../../content/screenshotAlternatives'

function isImageScreenshot(screenshot: string) {
  return /^(?:https?:\/\/|\/)/.test(screenshot)
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
  const [slideDirection, setSlideDirection] = useState<'next' | 'previous'>('next')
  const [failedScreenshots, setFailedScreenshots] = useState<Set<string>>(() => new Set())
  const markScreenshotFailed = useCallback((source: string) => {
    setFailedScreenshots((current) => current.has(source) ? current : new Set(current).add(source))
  }, [])
  const projectScreenshots = project.screenshots
  const screenshotCount = projectScreenshots.length
  const selectedShotIndex = Math.max(0, Math.min(activeShot, screenshotCount - 1))
  const selectedScreenshot = projectScreenshots[selectedShotIndex]
  const selectedScreenshotLabel = selectedScreenshot
    ? getScreenshotAlternative(project, selectedScreenshot)
    : 'Screenshot unavailable'
  const selectedScreenshotUrl = selectedScreenshot
    ? resolveAssetUrl(selectedScreenshot)
    : undefined
  const selectedScreenshotIsImage = Boolean(
    selectedScreenshot &&
    selectedScreenshotUrl &&
    isImageScreenshot(selectedScreenshot) &&
    !failedScreenshots.has(selectedScreenshot),
  )

  function showPreviousShot() {
    setSlideDirection('previous')
    setActiveShot(Math.max(0, selectedShotIndex - 1))
  }

  function showNextShot() {
    setSlideDirection('next')
    setActiveShot(Math.max(0, Math.min(selectedShotIndex + 1, screenshotCount - 1)))
  }

  return (
    <div className="project-window">
      <section className="project-hero">
        <div className={`project-icon tone-${project.iconTone}`} aria-hidden="true">
          <IconArtwork artworkId={project.id} thumbnail={project.thumbnail} variant="project" />
        </div>
        <div className="project-heading">
          <h1>{project.title}</h1>
          <p>{project.type}</p>
          <ProjectActions project={project} hasLinkedPost={hasLinkedPost} onOpenBlog={onOpenBlog} />
        </div>
      </section>

      <dl className="project-meta">
        <MetaRow label="type" value={project.type} />
        <MetaRow label="model" value={project.model} />
      </dl>

      <section className="story-panel">
        <h2>{project.subtitle}</h2>
        <p>{project.story}</p>
      </section>

      <section className="screenshot-carousel" aria-label={`${project.title} screenshots`}>
        <div
          className={`screenshot-card shot-${selectedShotIndex + 1} ${
            selectedScreenshotIsImage ? 'has-image' : ''
          }`}
        >
          {selectedScreenshotIsImage ? (
            <ScreenshotImage
              source={selectedScreenshot}
              direction={slideDirection}
              nextSource={isImageScreenshot(projectScreenshots[selectedShotIndex + 1] ?? '')
                ? projectScreenshots[selectedShotIndex + 1]
                : undefined}
              alt={`${project.title}: ${selectedScreenshotLabel}`}
              onError={markScreenshotFailed}
            />
          ) : (
            <span>{selectedScreenshotLabel}</span>
          )}
        </div>
        {screenshotCount > 1 ? (
          <div className="carousel-controls" role="group" aria-label="Screenshot carousel controls">
            <button type="button" onClick={showPreviousShot} disabled={selectedShotIndex === 0} aria-label="Show previous screenshot">
              <ChevronLeft strokeWidth={1.8} absoluteStrokeWidth aria-hidden="true" />
            </button>
            <div className="carousel-dots">
              {projectScreenshots.map((screenshot, index) => {
                const label = getScreenshotAlternative(project, screenshot)
                return (
                  <button
                    key={`${screenshot}-${index}`}
                    type="button"
                    className={index === selectedShotIndex ? 'is-active' : ''}
                    onClick={() => {
                      setSlideDirection(index > selectedShotIndex ? 'next' : 'previous')
                      setActiveShot(index)
                    }}
                    aria-label={`Show screenshot ${index + 1}: ${label}`}
                    aria-current={index === selectedShotIndex ? 'true' : undefined}
                  />
                )
              })}
            </div>
            <button type="button" onClick={showNextShot} disabled={selectedShotIndex === screenshotCount - 1} aria-label="Show next screenshot">
              <ChevronRight strokeWidth={1.8} absoluteStrokeWidth aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
