const ABSOLUTE_URL_PATTERN = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i

export function resolveAssetUrl(
  url: string,
  baseUrl = import.meta.env.BASE_URL,
) {
  if (!url.startsWith('/') || ABSOLUTE_URL_PATTERN.test(url)) return url

  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
  return `${normalizedBaseUrl}${url.replace(/^\/+/, '')}`
}
