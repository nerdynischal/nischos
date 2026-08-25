# nischalOS

A desktop-inspired personal portfolio built with React, TypeScript, Vite, Supabase, and CSS.

Projects, notes, and profile information open as movable desktop windows. The interface includes desktop shortcuts, a dock, responsive window positioning, Markdown note rendering, and local fallback content.

## Entry experience

New browser sessions begin on a macOS-inspired nischalOS lock screen. Unlocking is an experiential gateway rather than authentication: successful entry is stored in `sessionStorage`, so reloads in the same tab return directly to the desktop.

On fine-pointer devices, a lightweight WebGL surface bends the lock-screen grid around the mouse and idles as soon as its ripples settle. Touch devices, reduced-motion preferences, and browsers without WebGL keep the static CSS grid. The effect is unmounted after unlocking; the desktop uses its own static wallpaper grid.

## Local setup

```bash
npm install
npm run dev
```

The site runs at `http://localhost:5173/` by default.

## Content and Supabase

Copy `.env.example` to `.env.local` and add your Supabase project values:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Older projects can keep using `VITE_SUPABASE_ANON_KEY`; the app prefers the
current publishable key when both are present. Never put a secret key or
service-role key in a `VITE_` variable because Vite exposes those values to the
browser.

Run `supabase-schema.sql` in the Supabase SQL editor to create the public-read
tables, least-privilege RLS policies, and the public `project-screenshots` Storage
bucket. The same schema is tracked as a versioned migration under
`supabase/migrations`.

Verify the configured project and public-read policies:

```bash
npm run supabase:check
```

The app currently loads these tables:

- `projects`
- `blog_posts`
- `settings_sections`

The checked-in schema contains the current read model. Running it preserves legacy tables and content. Project metadata uses `type`; the current migration backfills it from the obsolete `category` column before removing that column.

Each content type is loaded independently. If Supabase is not configured, a request fails, or a table is empty, the app keeps the corresponding local fallback content from `src/content.ts`.

The typed browser client lives in `src/lib/supabase.ts`, with its database shape
in `src/lib/database.types.ts`. Regenerate that type after future schema changes
if you adopt the Supabase CLI.

### Project media

Project artwork lives in the public `project-screenshots` bucket, grouped by
project ID. Store the copied public URL in `thumbnail` or `screenshots`; the app
renders those URLs directly.

For a fresh local Supabase project, `supabase/seed.sql` supplies the current
portfolio content, including Keyform.

### Notes

Notes are stored in the existing `blog_posts` table and can use full Markdown in the `content_markdown` column. Existing `content` paragraph arrays still work as a fallback, but new notes should prefer Markdown:

```sql
insert into public.blog_posts (
  id,
  title,
  filename,
  date,
  folder,
  cover_tone,
  is_pinned,
  content_markdown
) values (
  'building-nischalos',
  'Building nischalOS',
  'building-nischalos.md',
  '2026-07-01',
  'Build Logs',
  'mint',
  false,
  $$Paste the full Markdown body here.$$
);
```

For an existing Supabase table created before Markdown and pinning support existed, run:

```sql
alter table public.blog_posts
add column if not exists content_markdown text;

alter table public.blog_posts
add column if not exists is_pinned boolean not null default false;
```

## Project structure

- `src/hooks` contains portfolio data loading, the live clock, and desktop-window state.
- `src/features/entry` contains the lock screen, session persistence, and its isolated water-ripple renderer.
- The remaining `src/features` folders contain the Notes, Project, and About window content.
- `src/desktop` contains desktop icons, dock behavior, artwork, and explicit dock pinning.
- `src/windows` contains reusable window framing and viewport geometry.
- `src/theme` contains the persisted system/light/dark preference model and document theme synchronization.
- `src/styles/tokens` contains the semantic light and dark palettes; `src/styles/theme` contains component-scoped theme rendering.
- `src/assets/fonts` contains the locally bundled Geist fonts and their license.
- `public` contains the favicon and app artwork.

The Markdown notes reader is lazy-loaded so its rendering dependencies are not part of the initial JavaScript bundle.

## Checks

Run the complete pre-commit check:

```bash
npm run check
```

Or run each check individually:

```bash
npm run lint
npm run tokens:check
npm run test
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
