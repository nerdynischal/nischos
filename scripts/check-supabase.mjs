import { createClient } from '@supabase/supabase-js'
import { loadEnv } from 'vite'

const env = loadEnv('development', process.cwd(), 'VITE_')
const url = env.VITE_SUPABASE_URL?.trim()
const key = (
  env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY
)?.trim()

if (!url || !key) {
  console.error(
    'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env.local.',
  )
  process.exitCode = 1
} else {
  const supabase = createClient(url, key)
  const tables = ['projects', 'blog_posts', 'settings_sections']
  let hasFailure = false

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })

    if (error) {
      hasFailure = true
      console.error(`✗ ${table}: ${error.message}`)
    } else {
      console.log(`✓ ${table}: public read works (${count ?? 0} rows)`)
    }
  }

  if (hasFailure) process.exitCode = 1
}
