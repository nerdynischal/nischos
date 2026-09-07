import { resolveAssetUrl } from '../lib/assetUrl'
import type { SupabaseLoadStatus } from '../hooks/usePortfolioContent'
import { useTheme } from '../theme/theme-context'
import { getNextTheme } from '../theme/theme'

type DateTime = {
  date: string
  time: string
}

const SUPABASE_STATUS_COPY: Record<SupabaseLoadStatus, string> = {
  loading: 'Loading Supabase data',
  connected: 'Supabase data loaded',
  fallback: 'Supabase data unavailable; using local fallbacks',
}

export function MenuBar({
  activeTitle,
  dateTime,
  supabaseStatus,
  onOpenAbout,
}: {
  activeTitle?: string
  dateTime: DateTime
  supabaseStatus: SupabaseLoadStatus
  onOpenAbout: () => void
}) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const nextTheme = getNextTheme(resolvedTheme)
  const toggleLabel = `Switch to ${nextTheme} appearance`

  return (
    <header className="menu-bar">
      <div className="menu-left">
        <button type="button" className="brand-button" onClick={onOpenAbout}>
          <img
            className="brand-logo"
            src={resolveAssetUrl('/logo.svg')}
            alt=""
            aria-hidden="true"
          />
          nischOS
        </button>
        {activeTitle ? <span className="active-app-label">{activeTitle}</span> : null}
      </div>
      <div className="menu-status" aria-label="Desktop status">
        <div
          className="supabase-status"
          data-status={supabaseStatus}
          role="status"
          aria-atomic="true"
          aria-label={SUPABASE_STATUS_COPY[supabaseStatus]}
          title={SUPABASE_STATUS_COPY[supabaseStatus]}
        >
          <svg
            className="supabase-status-icon"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <ellipse cx="10" cy="5" rx="6" ry="2.5" />
            <path d="M4 5V10C4 11.38 6.69 12.5 10 12.5C13.31 12.5 16 11.38 16 10V5" />
            <path d="M4 10V15C4 16.38 6.69 17.5 10 17.5C13.31 17.5 16 16.38 16 15V10" />
            {supabaseStatus === 'connected' ? (
              <path className="supabase-status-mark" d="M12.75 15.25L14.25 16.75L17.25 13.75" />
            ) : null}
            {supabaseStatus === 'fallback' ? (
              <path className="supabase-status-mark" d="M13.25 13.75L16.75 17.25M16.75 13.75L13.25 17.25" />
            ) : null}
          </svg>
        </div>
        <button
          type="button"
          className="theme-toggle"
          aria-label={toggleLabel}
          aria-pressed={resolvedTheme === 'light'}
          title={toggleLabel}
          onClick={toggleTheme}
        >
          {nextTheme === 'light' ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3.5" />
              <path d="M12 2v2.1M12 19.9V22M4.93 4.93l1.49 1.49M17.58 17.58l1.49 1.49M2 12h2.1M19.9 12H22M4.93 19.07l1.49-1.49M17.58 6.42l1.49-1.49" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.2 15.3A8.7 8.7 0 0 1 8.7 3.8 8.7 8.7 0 1 0 20.2 15.3Z" />
            </svg>
          )}
        </button>
        <span>London, UK</span>
        <time dateTime={dateTime.time}>
          <span className="menu-date">{dateTime.date}</span>
          <span className="menu-clock">{dateTime.time}</span>
        </time>
      </div>
    </header>
  )
}
