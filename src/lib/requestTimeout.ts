export const CONTENT_REQUEST_TIMEOUT_MS = 10_000

/** Abort stalled content queries and release the timer on success or failure. */
export async function withRequestTimeout<T>(request: (signal: AbortSignal) => PromiseLike<T>): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), CONTENT_REQUEST_TIMEOUT_MS)
  try {
    return await request(controller.signal)
  } finally {
    clearTimeout(timeout)
  }
}
