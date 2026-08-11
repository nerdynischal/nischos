import { describe, expect, it } from 'vitest'
import {
  getNextTheme,
  parseThemePreference,
  resolveTheme,
  THEME_COLORS,
  THEME_PREFERENCES,
} from './theme'

describe('theme preferences', () => {
  it('accepts every supported preference', () => {
    for (const preference of THEME_PREFERENCES) {
      expect(parseThemePreference(preference)).toBe(preference)
    }
  })

  it('falls back to system for missing or invalid stored values', () => {
    expect(parseThemePreference(null)).toBe('system')
    expect(parseThemePreference('sepia')).toBe('system')
  })

  it('resolves system preference without changing explicit choices', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('provides a browser chrome colour for both resolved themes', () => {
    expect(THEME_COLORS.dark).toMatch(/^#[\da-f]{6}$/i)
    expect(THEME_COLORS.light).toMatch(/^#[\da-f]{6}$/i)
  })

  it('toggles directly between light and dark', () => {
    expect(getNextTheme('dark')).toBe('light')
    expect(getNextTheme('light')).toBe('dark')
  })
})
