import { useEffect, useRef, useState } from 'react'
import {
  AtSign,
  Check,
  CircleUserRound,
  Copy,
  ExternalLink,
  Gem,
  Mail,
  Shapes,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { SettingsDetail, SettingsSection } from '../../content/types'
import { EmptyState } from '../../components/EmptyState'
import { resolveAssetUrl } from '../../lib/assetUrl'
import { ToolkitSection } from './ToolkitSection'

const GITHUB_PROFILE_URL = 'https://github.com/nerdynischal'
const CONTACT_ICON_ASSETS: Record<string, string> = {
  LinkedIn: '/contact-icons/linkedin.svg',
  GitHub: '/contact-icons/github.svg',
}
const SETTINGS_SECTION_ICONS: Record<string, LucideIcon> = {
  about: CircleUserRound,
  values: Gem,
  hobbies: Shapes,
  tools: Wrench,
  contact: AtSign,
}

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
      <aside className="settings-sidebar" aria-label="Settings sections">
        <div className="settings-sidebar-group">
          <p className="settings-sidebar-title">Nischal</p>
        </div>
        {settingsSections.map((item) => {
          const SectionIcon = SETTINGS_SECTION_ICONS[item.id]

          return (
            <button
              key={item.id}
              type="button"
              className={item.id === section.id ? 'is-selected' : ''}
              onClick={() => onChangeSection(item.id)}
              aria-current={item.id === section.id ? 'page' : undefined}
            >
              {SectionIcon ? (
                <SectionIcon className="settings-sidebar-icon" aria-hidden="true" />
              ) : null}
              <span>{item.label}</span>
            </button>
          )
        })}
      </aside>
      <section className="settings-detail">
        <div className="avatar-orbit" aria-hidden="true">
          <img
            className="about-portrait"
            src={resolveAssetUrl('/about-icon.png')}
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

function ContactIcon({ label }: { label: string }) {
  if (label === 'Email') {
    return (
      <span className="contact-icon-tile" aria-hidden="true">
        <Mail className="contact-icon contact-icon--email" />
      </span>
    )
  }

  const icon = CONTACT_ICON_ASSETS[label]

  return icon ? (
    <span className="contact-icon-tile" aria-hidden="true">
      <img
        className={`contact-icon contact-icon--${label.toLowerCase()}`}
        src={resolveAssetUrl(icon)}
        alt=""
      />
    </span>
  ) : null
}

function ContactDetails({ details }: { details: SettingsDetail[] }) {
  return (
    <div className="profile-details" aria-label="Contact links">
      {details.map((detail) => (
        <ContactRow key={detail.label} detail={detail} />
      ))}
    </div>
  )
}

function ContactRow({ detail }: { detail: SettingsDetail }) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(detail.value)
      setCopied(true)
      window.clearTimeout(resetTimer.current)
      resetTimer.current = window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  const content = (
    <>
      <span className="contact-row-label">
        <ContactIcon label={detail.label} />
        <span>{detail.label}</span>
      </span>
      <span className="contact-row-value">
        <span>{detail.value}</span>
        <span className="contact-action" aria-hidden="true">
          {detail.label === 'Email' ? (
            <>
              <span
                className="contact-copy-toast"
                data-visible={copied}
              >
                Email copied
              </span>
              {copied ? <Check /> : <Copy />}
            </>
          ) : (
            <ExternalLink />
          )}
        </span>
      </span>
    </>
  )

  if (detail.label === 'Email') {
    return (
      <button
        type="button"
        className="profile-row contact-row"
        onClick={copyEmail}
        aria-label={`Copy email address ${detail.value}`}
        title={copied ? 'Copied' : 'Copy email address'}
      >
        {content}
      </button>
    )
  }

  return detail.href ? (
    <a
      className="profile-row contact-row"
      href={detail.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${detail.label} in a new tab`}
      title={`Open ${detail.label} in a new tab`}
    >
      {content}
    </a>
  ) : null
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
