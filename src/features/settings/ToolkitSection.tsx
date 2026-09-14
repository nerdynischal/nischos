import type { SettingsToolGroup } from '../../content/types'
import { responsiveImage } from '../../lib/responsiveImage'

export function ToolkitSection({ groups }: { groups: SettingsToolGroup[] }) {
  return (
    <div className="toolkit-groups">
      {groups.map((group) => {
        const headingId = `toolkit-group-${group.id}`

        return (
          <section key={group.id} className="toolkit-group" aria-labelledby={headingId}>
            <h4 id={headingId}>{group.label}</h4>
            <ul className="toolkit-list">
              {group.tools.map((tool) => (
                <li key={tool.title} className="toolkit-row">
                  <span className="toolkit-icon" aria-hidden="true">
                    {/* This section mounts on selection; load its small icons without
                        waiting for lazy-load visibility checks inside the window. */}
                    <img {...responsiveImage(tool.icon, '40px')} alt="" loading="eager" decoding="async" />
                  </span>
                  <div className="toolkit-copy">
                    <h5>{tool.title}</h5>
                    <p>{tool.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
