# nischOS

A desktop-inspired personal portfolio built with React, TypeScript, Vite, Supabase, and CSS.

Projects, notes, and profile information open as movable desktop windows. The interface includes desktop shortcuts, a dock, responsive window positioning, Markdown note rendering, and local fallback content.

## Entry experience

New browser sessions begin on a macOS-inspired nischOS lock screen. Unlocking is an experiential gateway rather than authentication: successful entry is stored in `sessionStorage`, so reloads in the same tab return directly to the desktop.

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

Project records use `sort_order` for desktop placement and nullable
`dock_order` for dock placement. A null `dock_order` keeps a project on the
desktop without pinning it to the dock. Ordering values use gaps of ten so new
projects can be inserted without renumbering the whole collection.

The checked-in schema contains the current read model. Running it preserves legacy tables and content. Project metadata uses `type`; the current migration backfills it from the obsolete `category` column before removing that column.

Each content type is loaded independently. Checked-in projects form the baseline collection, with matching Supabase records overlaid and remote-only projects appended. If Supabase is not configured, a request fails, or another table is empty, the app keeps the corresponding local fallback content.

The typed browser client lives in `src/lib/supabase.ts`, with its database shape
in `src/lib/database.types.ts`. Regenerate that type after future schema changes
if you adopt the Supabase CLI.

### Project media

Project artwork lives in the public `project-screenshots` bucket, grouped by
project ID. Store the copied public URL in `thumbnail` or `screenshots`; the app
renders those URLs directly.

For a fresh local Supabase project, `supabase/seed.sql` supplies the current
portfolio content, including Keyform.

### Project manifests

Checked-in fallback projects live as individual JSON files in
`content/projects`. Vite discovers them automatically, so adding a fallback
project does not require editing an import list or `src/content.ts`.

Each manifest must follow `content/project.schema.json`, and its filename must
match its `id` (for example, `workout-board.json`). `sortOrder` controls desktop
ordering. Set `dockOrder` to a number to pin the project to the dock, or omit it
to keep the project on the desktop only. The dock supports up to five projects.

Local artwork must use a `/project-media/...` path that exists under `public`;
remote media and project links must use HTTPS. Validate manifests with:

```bash
npm run projects:check
```

Manifests provide the offline/deployment fallback. Until the Supabase ingestion
step is added, make the corresponding Supabase record separately when the live
database should serve the new project.

### Notes

Notes are stored in the existing `blog_posts` table as full Markdown in the required `content_markdown` column:

```sql
insert into public.blog_posts (
  id,
  title,
  date,
  folder,
  is_pinned,
  content_markdown
) values (
  'building-nischos',
  'Building nischOS',
  '2026-07-01',
  'Build Logs',
  false,
  $$Paste the full Markdown body here.$$
);
```

For an existing Supabase table created before Markdown and pinning support existed, run the versioned migrations in `supabase/migrations` rather than altering the table manually.

## Project structure

- `src/hooks` contains portfolio data loading, the live clock, and desktop-window state.
- `content/projects` contains validated fallback project manifests.
- `src/content/types.ts` defines the shared portfolio content model; `src/content.ts` assembles project manifests with the checked-in notes and profile fallback.
- `src/features/entry` contains the lock screen, session persistence, and its isolated water-ripple renderer.
- The remaining `src/features` folders contain the Notes, Project, and About window content.
- `src/desktop` contains desktop icons, dock behavior, and artwork.
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
npm run projects:check
npm run tokens:check
npm run test
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## GitHub Pages deployment

The repository includes `.github/workflows/deploy-pages.yml`. A push to `master`, or a manual workflow run, installs dependencies, runs the full production check, builds with the correct repository subpath, and deploys `dist` to GitHub Pages.

Before the first deployment:

1. In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. If the live site should use Supabase content, add `VITE_SUPABASE_URL` and either `VITE_SUPABASE_PUBLISHABLE_KEY` or the legacy `VITE_SUPABASE_ANON_KEY` as repository variables under **Settings → Secrets and variables → Actions → Variables**. The workflow also accepts an existing `ANON_KEY` variable. If they are omitted, the deployed site uses the checked-in fallback content.
3. Push to `master` and follow the **Deploy to GitHub Pages** workflow in the Actions tab.

The workflow derives the Vite base path from the repository name, so both `<username>.github.io` sites and project sites hosted at `<username>.github.io/<repository>/` resolve assets correctly.
