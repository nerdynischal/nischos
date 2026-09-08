import {
  AtSign,
  CircleUserRound,
  Gem,
  Shapes,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { SettingsSection } from '../../content/types'

const SECTION_ICONS: Record<string, LucideIcon> = {
  about: CircleUserRound,
  values: Gem,
  hobbies: Shapes,
  tools: Wrench,
  contact: AtSign,
}

export function SettingsSidebar({
  activeSectionId,
  onChangeSection,
  sections,
}: {
  activeSectionId: string
  onChangeSection: (sectionId: string) => void
  sections: SettingsSection[]
}) {
  return (
    <aside className="settings-sidebar" aria-label="Settings sections">
      <div className="settings-sidebar-group">
        <p className="settings-sidebar-title">Nischal</p>
      </div>
      {sections.map((section) => {
        const SectionIcon = SECTION_ICONS[section.id]
        const isSelected = section.id === activeSectionId

        return (
          <button
            key={section.id}
            type="button"
            className={isSelected ? 'is-selected' : ''}
            onClick={() => onChangeSection(section.id)}
            aria-current={isSelected ? 'page' : undefined}
          >
            {SectionIcon ? (
              <SectionIcon className="settings-sidebar-icon" aria-hidden="true" />
            ) : null}
            <span>{section.label}</span>
          </button>
        )
      })}
    </aside>
  )
}
