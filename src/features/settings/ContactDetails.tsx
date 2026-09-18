import { useEffect, useId, useRef, useState } from 'react'
import { Check, Copy, ExternalLink, Mail } from 'lucide-react'
import type { SettingsDetail } from '../../content/types'
import { resolveAssetUrl } from '../../lib/assetUrl'

const CONTACT_ICON_ASSETS: Record<string, string> = {
  LinkedIn: '/contact-icons/linkedin.svg',
  GitHub: '/contact-icons/github.svg',
}

export function ContactDetails({ details }: { details: SettingsDetail[] }) {
  return (
    <div className="profile-details contact-details" role="group" aria-label="Contact links">
      {details.map((detail) => (
        <ContactRow key={detail.label} detail={detail} />
      ))}
    </div>
  )
}

function ContactRow({ detail }: { detail: SettingsDetail }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const [copyAttempt, setCopyAttempt] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const copying = useRef(false)
  const manualCopyId = useId()
  const copied = copyStatus === 'copied'

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setToastVisible(false), 5000)
    return () => window.clearTimeout(timer)
  }, [copied, copyAttempt])
  const isCopyAction = !detail.href

  const copyValue = async () => {
    if (copying.current) return
    copying.current = true
    setCopyAttempt((attempt) => attempt + 1)
    setToastVisible(false)
    setCopyStatus('copying')
    try {
      await navigator.clipboard.writeText(detail.value)
      setCopyStatus('copied')
      setToastVisible(true)
    } catch {
      setCopyStatus('error')
    } finally {
      copying.current = false
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
        <span className="contact-action-indicator" data-copied={toastVisible} aria-hidden="true">
          {isCopyAction ? (
            <>
              <Copy className="contact-copy-icon" />
              <Check className="contact-check-icon" />
              <span className="contact-copy-toast" data-visible={toastVisible}>Copied</span>
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
      <>
        <button
          type="button"
          className="profile-row contact-row"
          onClick={copyValue}
          aria-disabled={copyStatus === 'copying' || undefined}
          aria-label={`Copy ${detail.label.toLowerCase()} ${detail.value}`}
          title={copied ? 'Copied' : `Copy ${detail.label.toLowerCase()}`}
        >
          {content}
        </button>
        <p className={`contact-copy-status${copyStatus === 'error' ? '' : ' contact-copy-status--announcement'}`} role="status" aria-atomic="true">
          {copyStatus !== 'idle' && <span key={copyAttempt}>{copyStatus === 'copying' ? `Copying ${detail.label.toLowerCase()}…`
            : copied ? `${detail.label} copied.`
              : copyStatus === 'error' ? `Couldn’t copy ${detail.label.toLowerCase()}. Select the value below and copy it manually.`
                : ''}</span>}
        </p>
        {copyStatus === 'error' && (
          <div className="contact-manual-copy">
            <label htmlFor={manualCopyId}>{detail.label} for manual copying</label>
            <textarea
              id={manualCopyId}
              readOnly
              value={detail.value}
              onFocus={(event) => event.currentTarget.select()}
              onClick={(event) => event.currentTarget.select()}
            />
          </div>
        )}
      </>
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
