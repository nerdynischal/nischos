import type { SettingsSection } from '../../content'

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

  return (
    <div className="settings-window">
      <aside className="settings-sidebar" aria-label="Settings sections">
        <div className="settings-sidebar-group">
          <p className="settings-sidebar-title">Nischal</p>
        </div>
        {settingsSections.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === section.id ? 'is-selected' : ''}
            onClick={() => onChangeSection(item.id)}
            aria-current={item.id === section.id ? 'page' : undefined}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </aside>
      <section className="settings-detail">
        <div className="avatar-orbit" aria-hidden="true">
          <img src="/logo.svg" alt="" />
        </div>
        <div className="profile-heading">
          <h3>{section.displayTitle ?? section.label}</h3>
          {section.displaySubtitle ? <p className="profile-subtitle">{section.displaySubtitle}</p> : null}
        </div>
        {section.details?.length ? (
          <dl className="profile-details">
            {section.details.map((item) => (
              <div key={item.label} className="profile-row">
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <>
            <p>{section.body}</p>
            {section.items.length ? (
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </section>
    </div>
  )
}
