import {
  AtSign,
  CircleUserRound,
  ChevronRight,
  Gem,
  Shapes,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import type { SettingsSection } from '../../content/types'
import { ProfilePortrait } from './ProfilePortrait'

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
    <nav className="settings-sidebar" aria-label="About sections">
      <ProfilePortrait className="settings-list-portrait" />
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
            data-section-id={section.id}
            className={isSelected ? 'is-selected' : ''}
            onClick={() => onChangeSection(section.id)}
            aria-current={isSelected ? 'page' : undefined}
          >
            {SectionIcon ? (
              <SectionIcon className="settings-sidebar-icon" aria-hidden="true" />
            ) : null}
            <span>{section.label}</span>
            <ChevronRight className="settings-section-chevron" aria-hidden="true" />
          </button>
        )
      })}
    </nav>
  )
}
