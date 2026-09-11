import { useState } from 'react'
import type { Project, ProjectCaseStudy } from '../../content/types'
import {
  ImageZoomButton,
  LegacyImageLightbox,
  type ImageViewerSelection,
} from './LegacyImageViewer'

export function LegacyProjectWindow({ project }: { project: Project }) {
  if (!project.caseStudy) return null

  return <LegacyProjectCaseStudy project={project} caseStudy={project.caseStudy} />
}

function LegacyProjectCaseStudy({
  project,
  caseStudy,
}: {
  project: Project
  caseStudy: ProjectCaseStudy
}) {
  const [viewerSelection, setViewerSelection] = useState<ImageViewerSelection | null>(null)
  const coverImage = project.thumbnail
    ? {
        src: project.thumbnail,
        alt: `${project.title} project cover`,
        caption: `${project.title} cover`,
      }
    : null

  return (
    <article className="legacy-project-window">
      {coverImage ? (
        <div className="legacy-project-cover">
          <ImageZoomButton
            image={coverImage}
            previewAlt=""
            loading="eager"
            sizes="(max-width: 760px) calc(100vw - 16px), 1120px"
            onOpen={setViewerSelection}
          />
        </div>
      ) : null}

      <header className="legacy-project-header">
        <h3>{project.title}</h3>
        <p>{project.subtitle}</p>
        <ul className="legacy-project-tags" aria-label="Project disciplines">
          {caseStudy.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </header>

      <p className="legacy-project-intro">{project.story}</p>

      <div className="legacy-case-study">
        {caseStudy.sections.map((section, sectionIndex) => (
          <section key={section.title} className="legacy-case-study-section">
            <span className="legacy-section-number" aria-hidden="true">
              {String(sectionIndex + 1).padStart(2, '0')}
            </span>
            <div className="legacy-section-content">
              <h4>{section.title}</h4>
              {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
              ) : null}
              {section.images ? (
                <div className="legacy-section-gallery" data-layout={section.imageLayout}>
                  {section.images.map((image) => (
                    <figure key={image.src} data-size={image.displaySize}>
                      <ImageZoomButton
                        image={image}
                        sizes={image.displaySize === 'compact'
                          ? '128px'
                          : section.imageLayout === 'masonry'
                            ? '(max-width: 760px) calc(100vw - 48px), 340px'
                            : undefined}
                        onOpen={setViewerSelection}
                      />
                      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      {viewerSelection ? (
        <LegacyImageLightbox
          selection={viewerSelection}
          onClose={() => setViewerSelection(null)}
        />
      ) : null}
    </article>
  )
}
