import type { SettingsDetail } from '../content/types'

export function withOsVersion(details: SettingsDetail[] = []): SettingsDetail[] {
  const build = import.meta.env.VITE_BUILD_NUMBER?.trim()
  const value = `nischOS ${import.meta.env.VITE_APP_VERSION} · ${build ? `Build ${build}` : 'Development'}`
  const osDetail = { label: 'OS', value }
  const isOs = (detail: SettingsDetail) => detail.label.trim().toLowerCase() === 'os'

  // Build metadata takes precedence over manually maintained remote content.
  return details.some(isOs)
    ? details.map((detail) => isOs(detail) ? osDetail : detail)
    : [...details, osDetail]
}
