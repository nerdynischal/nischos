import type { SettingsSection } from '../../content/types'
import { EmptyState } from '../../components/EmptyState'
import { responsiveImage } from '../../lib/responsiveImage'
import { ContactDetails } from './ContactDetails'
import { SettingsSidebar } from './SettingsSidebar'
import { ToolkitSection } from './ToolkitSection'

const GITHUB_PROFILE_URL = 'https://github.com/nerdynischal'

export function SettingsWindow({
  activeSection,
  onChangeSection,
  settingsSections,
}: {
  activeSection: string
  onChangeSection: (sectionId: string) => void
  settingsSections: SettingsSection[]
}) {
  const section = settingsSections.find((item) => item.id === activeSection) ?? settingsSections[0]

  if (!section) {
    return <EmptyState title="About unavailable" body="Profile information could not be loaded." />
  }

  return (
    <div className="settings-window">
      <SettingsSidebar
        activeSectionId={section.id}
        onChangeSection={onChangeSection}
        sections={settingsSections}
      />
      <section className="settings-detail">
        <div className="avatar-orbit" aria-hidden="true">
          <img
            className="about-portrait"
            {...responsiveImage('/about-icon.png', '120px')}
            alt=""
          />
        </div>
        <div className="profile-heading">
          <h3>{section.displayTitle ?? section.label}</h3>
          {section.displaySubtitle ? (
            <p className="profile-subtitle">{section.displaySubtitle}</p>
          ) : null}
        </div>
        {section.toolGroups?.length ? (
          <ToolkitSection groups={section.toolGroups} />
        ) : section.details?.length ? (
          section.id === 'contact' ? (
            <ContactDetails details={section.details} />
          ) : (
            <dl className="profile-details">
              {section.details.map((item) => (
                <div key={item.label} className="profile-row">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )
        ) : (
          <>
            {section.body ? <p>{section.body}</p> : null}
            {section.items.length ? (
              <ul className="settings-items">
                {section.items.map((item) => (
                  <li key={item} className="settings-item">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
        {section.id === 'about' ? <AboutFooter /> : null}
      </section>
    </div>
  )
}

function AboutFooter() {
  return (
    <footer className="about-footer" aria-label="About nischOS">
      <nav className="about-footer-links" aria-label="Project links">
        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
          GitHub Profile
        </a>
      </nav>
      <p className="about-copyright">© 2026 Nischal. All rights reserved.</p>
    </footer>
  )
}
