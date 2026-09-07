import { DatabaseCheck, DatabaseX, LoaderCircle, Moon, Sun, type LucideIcon } from 'lucide-react'
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

const SUPABASE_STATUS_ICONS = {
  loading: LoaderCircle,
  connected: DatabaseCheck,
  fallback: DatabaseX,
} satisfies Record<SupabaseLoadStatus, LucideIcon>

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
  const SupabaseStatusIcon = SUPABASE_STATUS_ICONS[supabaseStatus]

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
          <SupabaseStatusIcon
            className="supabase-status-icon"
            strokeWidth={1.7}
            absoluteStrokeWidth
            aria-hidden="true"
          />
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
            <Sun strokeWidth={1.7} absoluteStrokeWidth aria-hidden="true" />
          ) : (
            <Moon strokeWidth={1.7} absoluteStrokeWidth aria-hidden="true" />
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
