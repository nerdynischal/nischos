export const THEME_STORAGE_KEY = 'nischos-theme'

export const THEME_PREFERENCES = ['system', 'light', 'dark'] as const

export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

export const THEME_COLORS: Record<ResolvedTheme, string> = {
  dark: '#050505',
  light: '#f6f6f6',
}

export function parseThemePreference(value: unknown): ThemePreference {
  return THEME_PREFERENCES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : 'system'
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  if (preference === 'system') return prefersDark ? 'dark' : 'light'
  return preference
}

export function getNextTheme(theme: ResolvedTheme): ResolvedTheme {
  return theme === 'dark' ? 'light' : 'dark'
}
