export const ENTRY_SESSION_STORAGE_KEY = 'nischalos:entry-session'

const ENTRY_SESSION_ENTERED_VALUE = 'entered'

type EntrySessionStorage = Pick<Storage, 'getItem' | 'setItem'>

function getBrowserSessionStorage(): EntrySessionStorage | null {
  if (typeof window === 'undefined') return null

  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

export function parseEntrySession(value: unknown): boolean {
  return value === ENTRY_SESSION_ENTERED_VALUE
}

export function hasEntrySession(
  storage: EntrySessionStorage | null = getBrowserSessionStorage(),
): boolean {
  if (!storage) return false

  try {
    return parseEntrySession(storage.getItem(ENTRY_SESSION_STORAGE_KEY))
  } catch {
    return false
  }
}

export function markEntrySessionEntered(
  storage: EntrySessionStorage | null = getBrowserSessionStorage(),
): boolean {
  if (!storage) return false

  try {
    storage.setItem(ENTRY_SESSION_STORAGE_KEY, ENTRY_SESSION_ENTERED_VALUE)
    return true
  } catch {
    return false
  }
}
