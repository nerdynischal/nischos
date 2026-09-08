import { useEffect, useRef, useState } from 'react'
import { Check, Copy, ExternalLink, Mail } from 'lucide-react'
import type { SettingsDetail } from '../../content/types'
import { resolveAssetUrl } from '../../lib/assetUrl'

const CONTACT_ICON_ASSETS: Record<string, string> = {
  LinkedIn: '/contact-icons/linkedin.svg',
  GitHub: '/contact-icons/github.svg',
}

export function ContactDetails({ details }: { details: SettingsDetail[] }) {
  return (
    <div className="profile-details" role="group" aria-label="Contact links">
      {details.map((detail) => (
        <ContactRow key={detail.label} detail={detail} />
      ))}
    </div>
  )
}

function ContactRow({ detail }: { detail: SettingsDetail }) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)
  const isCopyAction = !detail.href

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const copyValue = async () => {
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
        <span className="contact-action-indicator" aria-hidden="true">
          {isCopyAction ? (
            <>
              <span className="contact-copy-toast" data-visible={copied}>
                {detail.label} copied
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

  if (isCopyAction) {
    return (
      <button
        type="button"
        className="profile-row contact-row"
        onClick={copyValue}
        aria-label={`Copy ${detail.label.toLowerCase()} ${detail.value}`}
        title={copied ? 'Copied' : `Copy ${detail.label.toLowerCase()}`}
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
