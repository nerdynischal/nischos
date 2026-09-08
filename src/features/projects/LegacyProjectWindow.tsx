import type { Project } from '../../content/types'
import { resolveAssetUrl } from '../../lib/assetUrl'

export function LegacyProjectWindow({ project }: { project: Project }) {
  const caseStudy = project.caseStudy
  if (!caseStudy) return null

  return (
    <article className="legacy-project-window">
      {project.thumbnail ? (
        <div className="legacy-project-cover">
          <img src={resolveAssetUrl(project.thumbnail)} alt="" decoding="async" />
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
                    <figure key={image.src}>
                      <img
                        src={resolveAssetUrl(image.src)}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
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
    </article>
  )
}
