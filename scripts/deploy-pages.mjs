import { appendFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { setTimeout as wait } from 'node:timers/promises'

// The official deploy action's artifact-service lookup can return an empty list
// even when the REST API lists the upload. Use its exact output ID instead.
export async function deployPages({ env = process.env, fetchImpl = fetch, sleep = wait } = {}) {
  for (const key of ['GITHUB_REPOSITORY', 'GITHUB_SHA', 'GITHUB_TOKEN', 'PAGES_ARTIFACT_ID',
    'ACTIONS_ID_TOKEN_REQUEST_URL', 'ACTIONS_ID_TOKEN_REQUEST_TOKEN']) {
    if (!env[key]) throw new Error(`Missing deployment environment variable: ${key}`)
  }
  if (!/^\d+$/.test(env.PAGES_ARTIFACT_ID)) throw new Error('Invalid Pages artifact ID')
  const api = `${env.GITHUB_API_URL ?? 'https://api.github.com'}/repos/${env.GITHUB_REPOSITORY}/pages/deployments`

  async function request(url, token, body) {
    const response = await fetchImpl(url, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'nischOS-pages-deployment',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30_000),
    })
    // Never include request headers, OIDC tokens, or response bodies in errors.
    if (!response.ok) throw new Error(`Pages request failed: HTTP ${response.status}`)
    return response.status === 204 ? null : response.json()
  }

  const identity = await request(env.ACTIONS_ID_TOKEN_REQUEST_URL, env.ACTIONS_ID_TOKEN_REQUEST_TOKEN)
  if (!identity?.value) throw new Error('GitHub did not return a deployment identity')
  const deployment = await request(api, env.GITHUB_TOKEN, {
    artifact_id: Number(env.PAGES_ARTIFACT_ID),
    pages_build_version: env.GITHUB_SHA,
    oidc_token: identity.value,
  })
  if (!deployment?.page_url) throw new Error('GitHub did not return a Pages URL')
  const statusUrl = `${api}/${encodeURIComponent(deployment.id ?? env.GITHUB_SHA)}`
  try {
    const deadline = Date.now() + 600_000
    while (Date.now() < deadline) {
      await sleep(5000)
      const result = await request(statusUrl, env.GITHUB_TOKEN)
      if (result.status === 'succeed') {
        const pageUrl = deployment.page_url.startsWith('https://') ? deployment.page_url : `https://${deployment.page_url}`
        return { pageUrl: new URL(pageUrl).href }
      }
      if (['deployment_failed', 'deployment_content_failed', 'deployment_cancelled', 'deployment_lost'].includes(result.status)) {
        throw new Error(`Pages deployment ended: ${result.status}`)
      }
    }
    throw new Error('Pages deployment timed out')
  } catch (error) {
    await request(`${statusUrl}/cancel`, env.GITHUB_TOKEN, {}).catch(() => {})
    throw error
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { pageUrl } = await deployPages()
    await appendFile(process.env.GITHUB_OUTPUT, `page_url=${pageUrl}\n`)
    console.log(`Pages deployment succeeded: ${pageUrl}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
