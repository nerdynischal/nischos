import { readFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import baseConfig from '../vite.config.ts'

const baseline = process.env.PROFILE_BASELINE_HOOK
const hookPath = path.resolve(import.meta.dirname, '../src/hooks/useDesktopWindows.ts')

export default mergeConfig(baseConfig, defineConfig({
  cacheDir: `node_modules/.vite-profile-${baseline ? 'baseline' : 'optimized'}`,
  define: { __PROFILE_VARIANT__: JSON.stringify(baseline ? 'baseline' : 'optimized') },
  plugins: baseline ? [{
    name: 'profile-baseline-drag',
    enforce: 'pre',
    transform(_code, id) {
      if (id.split('?')[0] === hookPath) return readFileSync(baseline, 'utf8')
    },
  }] : [],
}))
