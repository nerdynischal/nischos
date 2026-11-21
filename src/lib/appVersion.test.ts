import { afterEach, expect, it, vi } from 'vitest'
import { withOsVersion } from './appVersion'

afterEach(() => vi.unstubAllEnvs())

it('replaces the remote OS version with the deployed version and build', () => {
  vi.stubEnv('VITE_APP_VERSION', '2.0.0')
  vi.stubEnv('VITE_BUILD_NUMBER', '42')
  const details = [{ label: 'Name', value: 'Nischal' }, { label: 'OS', value: 'nischOS 1.9.1' }]
  expect(withOsVersion(details)).toEqual([
    details[0], { label: 'OS', value: 'nischOS 2.0.0 · Build 42' },
  ])
  expect(details[1].value).toBe('nischOS 1.9.1')
})

it('adds the OS row to local content and marks builds without a CI number as development', () => {
  vi.stubEnv('VITE_APP_VERSION', '1.9.1')
  vi.stubEnv('VITE_BUILD_NUMBER', '')
  expect(withOsVersion()).toEqual([{ label: 'OS', value: 'nischOS 1.9.1 · Development' }])
})
