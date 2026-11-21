import { ChevronLeft } from 'lucide-react'
import type { SettingsSection } from '../../content/types'
import { EmptyState } from '../../components/EmptyState'
import { useSettingsNavigation } from './useSettingsNavigation'
import { ContactDetails } from './ContactDetails'
import { ProfilePortrait } from './ProfilePortrait'
import { SettingsSidebar } from './SettingsSidebar'
import { ToolkitSection } from './ToolkitSection'
import { ValuesSection } from './ValuesSection'
import { withOsVersion } from '../../lib/appVersion'

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
  const {
    containerRef, backRef, value, valueNavigation, showMobileDetail,
    hasMobileNavigation, selectSection, selectValue, goBack, returnToValues,
  } = useSettingsNavigation(section, onChangeSection)
  const details = section?.id === 'about' ? withOsVersion(section.details) : section?.details

  if (!section) {
    return <EmptyState title="About unavailable" body="Profile information could not be loaded." />
  }

  return (
    <div ref={containerRef} className="settings-window" data-mobile-detail={showMobileDetail} data-mobile-navigation={hasMobileNavigation}>
      <SettingsSidebar
        activeSectionId={section.id}
        onChangeSection={selectSection}
        sections={settingsSections}
      />
      <section className="settings-detail">
        <div className="settings-mobile-header">
          <button
            ref={backRef}
            type="button"
            className="settings-mobile-back"
            aria-label={value ? "Back to Values" : "Back to About sections"}
            onClick={goBack}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <h1 className="settings-mobile-heading">
            {value ?? section.displaySubtitle ?? section.displayTitle ?? section.label}
          </h1>
        </div>
        {!value && <ProfilePortrait />}
        <div className={`profile-heading${value ? ' values-heading' : ''}`}>
          {value && (
            <button type="button" className="values-back" aria-label="Back to Values" onClick={returnToValues}>
              <ChevronLeft aria-hidden="true" />
            </button>
          )}
          <h1>{value ?? section.displayTitle ?? section.label}</h1>
          {!value && section.displaySubtitle ? (
            <p className="profile-subtitle">{section.displaySubtitle}</p>
          ) : null}
        </div>
        {section.id === 'values' ? (
          <ValuesSection
            items={section.items}
            selectedValue={value}
            hasNavigated={valueNavigation}
            onSelect={selectValue}
          />
        ) : section.toolGroups?.length ? (
          <ToolkitSection groups={section.toolGroups} />
        ) : details?.length ? (
          section.id === 'contact' ? (
            <ContactDetails details={details} />
          ) : (
            <dl className="profile-details">
              {details.map((item) => (
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
    <footer className="about-footer">
      <nav className="about-footer-links" aria-label="Profile links">
        <a href={GITHUB_PROFILE_URL} target="_blank" rel="noreferrer">
          GitHub Profile
        </a>
      </nav>
      <p className="about-copyright">© 2026 Nischal. All rights reserved.</p>
    </footer>
  )
}
