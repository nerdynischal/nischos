import { useTheme } from '../theme/theme-context'
import { getNextTheme } from '../theme/theme'

type DateTime = {
  date: string
  time: string
}

export function MenuBar({
  activeTitle,
  dateTime,
  onOpenAbout,
}: {
  activeTitle?: string
  dateTime: DateTime
  onOpenAbout: () => void
}) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const nextTheme = getNextTheme(resolvedTheme)
  const toggleLabel = `Switch to ${nextTheme} appearance`

  return (
    <header className="menu-bar">
      <div className="menu-left">
        <button type="button" className="brand-button" onClick={onOpenAbout}>
          <img className="brand-logo" src="/logo.svg" alt="" aria-hidden="true" />
          nischalOS
        </button>
        {activeTitle ? <span className="active-app-label">{activeTitle}</span> : null}
      </div>
      <div className="menu-status" aria-label="Desktop status">
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
        <time>
          <span className="menu-date">{dateTime.date}</span>
          <span className="menu-clock">{dateTime.time}</span>
        </time>
      </div>
    </header>
  )
}
