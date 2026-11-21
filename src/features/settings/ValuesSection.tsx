import { ChevronRight } from 'lucide-react'

// Temporary copy, ready to replace with the final descriptions.
const descriptions: Record<string, string> = {
  'Design with intention': 'Start with a clear purpose. Every decision should help someone do what they came to do, from the overall flow to the smallest detail.',
  'Design with integrity': 'Build trust through honest, thoughtful choices. Make the experience clear, respect people’s attention, and follow through on what the product promises.',
  'Design with curiosity': 'Ask questions, explore possibilities, and stay open to being surprised. Trying something unfamiliar often reveals a better way forward.',
  'Design with simplicity': 'Make room for what matters. Remove unnecessary steps and distractions so the experience feels clear, calm, and easy to understand.',
  'Design with empathy': 'Look at the experience through someone else’s eyes. Listen to different needs and create things that help people feel understood and supported.',
}

export function ValuesSection({ items, selectedValue, hasNavigated, onSelect }: {
  items: string[]
  selectedValue: string | null
  hasNavigated: boolean
  onSelect: (value: string) => void
}) {
  return (
    <div key={selectedValue ?? 'list'} className="values-pane" data-detail={Boolean(selectedValue)} data-navigated={hasNavigated}>
      {selectedValue ? (
        <>
          <div className="value-description">
            <p className="value-placeholder-label">Placeholder copy</p>
            <p>{descriptions[selectedValue] ?? 'A little more about this value, why it matters, and how it shapes my approach. More to come.'}</p>
          </div>
        </>
      ) : (
        <ul className="settings-items values-list">
          {items.map((item) => (
            <li key={item} className="settings-item">
              <button type="button" className="value-button" data-value={item} onClick={() => onSelect(item)}>
                <span>{item}</span><ChevronRight aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
