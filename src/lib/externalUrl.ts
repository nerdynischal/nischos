/** Only allow web destinations in content-controlled links. */
export function externalUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? value.trim()
      : undefined
  } catch {
    return undefined
  }
}
