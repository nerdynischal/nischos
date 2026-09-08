import type { SettingsToolGroup } from '../../content/types'
import { resolveAssetUrl } from '../../lib/assetUrl'

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
                    <img src={resolveAssetUrl(tool.icon)} alt="" />
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
