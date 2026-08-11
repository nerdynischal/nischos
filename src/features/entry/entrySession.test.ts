import { describe, expect, it } from 'vitest'
import {
  ENTRY_SESSION_STORAGE_KEY,
  hasEntrySession,
  markEntrySessionEntered,
  parseEntrySession,
} from './entrySession'

function createMemoryStorage(initialValue: string | null = null) {
  let value = initialValue

  return {
    getItem(key: string) {
      return key === ENTRY_SESSION_STORAGE_KEY ? value : null
    },
    setItem(key: string, nextValue: string) {
      if (key === ENTRY_SESSION_STORAGE_KEY) value = nextValue
    },
  }
}

describe('entry session', () => {
  it('accepts only the entered session value', () => {
    expect(parseEntrySession('entered')).toBe(true)
    expect(parseEntrySession('true')).toBe(false)
    expect(parseEntrySession(null)).toBe(false)
  })

  it('persists and reads entry for the current session', () => {
    const storage = createMemoryStorage()

    expect(hasEntrySession(storage)).toBe(false)
    expect(markEntrySessionEntered(storage)).toBe(true)
    expect(hasEntrySession(storage)).toBe(true)
  })

  it('falls back to locked when storage is missing', () => {
    expect(hasEntrySession(null)).toBe(false)
    expect(markEntrySessionEntered(null)).toBe(false)
  })

  it('handles storage read and write errors', () => {
    const unavailableStorage = {
      getItem() {
        throw new Error('Storage unavailable')
      },
      setItem() {
        throw new Error('Storage unavailable')
      },
    }

    expect(hasEntrySession(unavailableStorage)).toBe(false)
    expect(markEntrySessionEntered(unavailableStorage)).toBe(false)
  })
})
