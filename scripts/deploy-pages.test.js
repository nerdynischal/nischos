import { expect, it, vi } from 'vitest'
import { deployPages } from './deploy-pages.mjs'

const env = {
  GITHUB_REPOSITORY: 'owner/site', GITHUB_SHA: 'reviewed-commit',
  GITHUB_TOKEN: 'test-token', PAGES_ARTIFACT_ID: '123',
  ACTIONS_ID_TOKEN_REQUEST_URL: 'https://oidc.example/token',
  ACTIONS_ID_TOKEN_REQUEST_TOKEN: 'test-runtime-token',
}
const response = (data, status = 200) => new Response(JSON.stringify(data), { status })

it('deploys the exact uploaded artifact with OIDC and waits for success', async () => {
  const fetchImpl = vi.fn()
    .mockResolvedValueOnce(response({ value: 'test-identity' }))
    .mockResolvedValueOnce(response({ id: 'deployment', page_url: 'owner.github.io/site/' }))
    .mockResolvedValueOnce(response({ status: 'queued' }))
    .mockResolvedValueOnce(response({ status: 'succeed' }))
  const sleep = vi.fn(async () => {})
  await expect(deployPages({ env, fetchImpl, sleep })).resolves.toEqual({ pageUrl: 'https://owner.github.io/site/' })
  expect(JSON.parse(fetchImpl.mock.calls[1][1].body)).toEqual({
    artifact_id: 123, pages_build_version: 'reviewed-commit', oidc_token: 'test-identity',
  })
  expect(fetchImpl.mock.calls[1][0]).toBe('https://api.github.com/repos/owner/site/pages/deployments')
  expect(sleep).toHaveBeenCalledTimes(2)
})

it('reports a failed deployment and requests cancellation', async () => {
  const fetchImpl = vi.fn()
    .mockResolvedValueOnce(response({ value: 'test-identity' }))
    .mockResolvedValueOnce(response({ id: 'deployment', page_url: 'https://owner.github.io/site/' }))
    .mockResolvedValueOnce(response({ status: 'deployment_failed' }))
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
  await expect(deployPages({ env, fetchImpl, sleep: async () => {} })).rejects.toThrow('deployment_failed')
  expect(fetchImpl.mock.calls[3][0]).toBe('https://api.github.com/repos/owner/site/pages/deployments/deployment/cancel')
})

it('rejects an invalid artifact ID before making requests', async () => {
  const fetchImpl = vi.fn()
  await expect(deployPages({ env: { ...env, PAGES_ARTIFACT_ID: '' }, fetchImpl })).rejects.toThrow('PAGES_ARTIFACT_ID')
  expect(fetchImpl).not.toHaveBeenCalled()
})

it('does not include sensitive response contents in HTTP errors', async () => {
  const fetchImpl = vi.fn().mockResolvedValue(response({ value: 'do-not-log-this' }, 403))
  await expect(deployPages({ env, fetchImpl })).rejects.toThrow(/^Pages request failed: HTTP 403$/)
})
