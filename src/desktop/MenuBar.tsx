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
        <span>London, UK</span>
        <time>
          <span className="menu-date">{dateTime.date}</span>
          <span className="menu-clock">{dateTime.time}</span>
        </time>
      </div>
    </header>
  )
}
