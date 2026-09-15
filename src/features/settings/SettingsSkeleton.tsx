import type { SettingsSection } from '../../content/types'
import { SkeletonText as Text } from '../../components/ContentSkeleton'

export function SettingsSkeleton({ sections, activeSection }: { sections: SettingsSection[]; activeSection: string }) {
  const section = sections.find((item) => item.id === activeSection) ?? sections[0]
  if (!section) return null
  return <div className="settings-window" data-mobile-detail="false">
    <aside className="settings-sidebar">
      <div className="avatar-orbit settings-list-portrait skeleton-fill" />
      <div className="settings-sidebar-group"><p className="settings-sidebar-title">Nischal</p></div>
      {sections.map((item) => <button type="button" tabIndex={-1} key={item.id} className={item.id === section.id ? 'is-selected' : ''}>
        <span className="settings-sidebar-icon skeleton-fill" /><span><Text>{item.label}</Text></span><span className="settings-section-chevron skeleton-fill" />
      </button>)}
    </aside>
    <section className="settings-detail">
      <div className="avatar-orbit skeleton-fill" />
      <div className="profile-heading"><h3><Text>{section.displayTitle ?? section.label}</Text></h3>{section.displaySubtitle && <p className="profile-subtitle"><Text>{section.displaySubtitle}</Text></p>}</div>
      {section.toolGroups?.length ? <div className="toolkit-groups">{section.toolGroups.map((group) => <section className="toolkit-group" key={group.id}>
        <h4><Text>{group.label}</Text></h4><ul className="toolkit-list">{group.tools.map((tool) => <li className="toolkit-row" key={tool.title}>
          <span className="toolkit-icon skeleton-fill" /><div className="toolkit-copy"><h5><Text>{tool.title}</Text></h5><p><Text>{tool.description}</Text></p></div>
        </li>)}</ul>
      </section>)}</div> : section.details?.length ? <dl className="profile-details">{section.details.map((item) => <div className={`profile-row${section.id === 'contact' ? ' contact-row' : ''}`} key={item.label}>
        <dt><Text>{item.label}</Text></dt><dd><Text>{item.value}</Text></dd>
      </div>)}</dl> : <>
        {section.body && <p><Text>{section.body}</Text></p>}
        {section.items.length > 0 && <ul className="settings-items">{section.items.map((item) => <li className="settings-item" key={item}><Text>{item}</Text></li>)}</ul>}
      </>}
      {section.id === 'about' && <footer className="about-footer"><nav className="about-footer-links"><span><Text>GitHub Profile</Text></span></nav><p className="about-copyright"><Text>© 2026 Nischal. All rights reserved.</Text></p></footer>}
    </section>
  </div>
}
