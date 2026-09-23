import { useContext, useEffect, useRef, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { SettingsSection } from '../../content/types'
import { EmptyState } from '../../components/EmptyState'
import { WindowTitleContext } from '../../windows/WindowTitleContext'
import { ContactDetails } from './ContactDetails'
import { ProfilePortrait } from './ProfilePortrait'
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
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [hasMobileNavigation, setHasMobileNavigation] = useState(false)
  const setMobileTitle = useContext(WindowTitleContext)
  const containerRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const pendingFocus = useRef<'detail' | 'list' | null>(null)
  const section = settingsSections.find((item) => item.id === activeSection) ?? settingsSections[0]

  useEffect(() => {
    setMobileTitle?.(showMobileDetail ? section?.label ?? null : null)
    return () => setMobileTitle?.(null)
  }, [setMobileTitle, showMobileDetail, section?.label])

  useEffect(() => {
    if (pendingFocus.current === 'detail') {
      const detail = containerRef.current?.querySelector('.settings-detail')
      if (detail) detail.scrollTop = 0
      backRef.current?.focus({ preventScroll: true })
    } else if (pendingFocus.current === 'list') {
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[data-section-id]')
      Array.from(buttons ?? []).find((button) => button.dataset.sectionId === section?.id)?.focus({ preventScroll: true })
    }
    pendingFocus.current = null
  }, [showMobileDetail, section?.id])

  if (!section) {
    return <EmptyState title="About unavailable" body="Profile information could not be loaded." />
  }

  return (
    <div ref={containerRef} className="settings-window" data-mobile-detail={showMobileDetail} data-mobile-navigation={hasMobileNavigation}>
      <SettingsSidebar
        activeSectionId={section.id}
        onChangeSection={(id) => {
          onChangeSection(id)
          if (window.matchMedia('(max-width: 760px)').matches) {
            setHasMobileNavigation(true)
            pendingFocus.current = 'detail'
            setShowMobileDetail(true)
          }
        }}
        sections={settingsSections}
      />
      <section className="settings-detail">
        <div className="settings-mobile-header">
          <button
            ref={backRef}
            type="button"
            className="settings-mobile-back"
            aria-label="Back to About sections"
            onClick={() => {
              pendingFocus.current = 'list'
              setShowMobileDetail(false)
            }}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <h1 className="settings-mobile-heading">
            {section.displaySubtitle ?? section.displayTitle ?? section.label}
          </h1>
        </div>
        <ProfilePortrait />
        <div className="profile-heading">
          <h1>{section.displayTitle ?? section.label}</h1>
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
