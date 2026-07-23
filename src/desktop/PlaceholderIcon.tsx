import type { DesktopIcon } from '../types'

export function PlaceholderIcon({ variant }: { variant: DesktopIcon['kind'] }) {
  return (
    <svg
      className={`placeholder-svg placeholder-${variant}`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
    >
      <rect x="10" y="10" width="28" height="28" rx="8" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 31.5L21.5 25.5L26 29.5L31.5 21L36 31.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="19" r="2.5" fill="currentColor" />
    </svg>
  )
}
