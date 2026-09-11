import { fetchPostContent } from '../../lib/supabase'

const CACHE_TTL_MS = 5 * 60 * 1000
const MAX_CACHED_NOTES = 50

export function createPostContentLoader(fetchContent: (id: string) => Promise<string>) {
  const cache = new Map<string, { promise: Promise<string>; expires: number }>()

  return function load(id: string) {
    const existing = cache.get(id)
    if (existing && existing.expires > Date.now()) return existing.promise

    const entry = {
      expires: Infinity,
      promise: Promise.resolve().then(() => fetchContent(id)),
    }
    entry.promise = entry.promise.then((markdown) => {
      entry.expires = Date.now() + CACHE_TTL_MS
      return markdown
    }).catch((error: unknown) => {
      if (cache.get(id) === entry) cache.delete(id)
      throw error
    })
    cache.delete(id)
    cache.set(id, entry)
    if (cache.size > MAX_CACHED_NOTES) cache.delete(cache.keys().next().value!)
    return entry.promise
  }
}

export const loadPostContent = createPostContentLoader(fetchPostContent)
