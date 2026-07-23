# nischalOS

A desktop-inspired personal portfolio built with React, TypeScript, Vite, Supabase, and CSS.

Projects, blog posts, and profile information open as movable desktop windows. The interface includes desktop shortcuts, a dock, responsive window positioning, Markdown blog rendering, and local fallback content.

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
VITE_SUPABASE_ANON_KEY=
```

Run `supabase-schema.sql` in the Supabase SQL editor to create the public read tables.

The app currently loads these tables:

- `projects`
- `blog_posts`
- `settings_sections`

The checked-in schema contains only this current read model. Running it does not remove legacy columns or tables that may already exist in an older Supabase project.

Each content type is loaded independently. If Supabase is not configured, a request fails, or a table is empty, the app keeps the corresponding local fallback content from `src/content.ts`.

### Blog posts

Blog posts can be stored as full Markdown in the `content_markdown` column. Existing `content` paragraph arrays still work as a fallback, but new posts should prefer Markdown:

```sql
insert into public.blog_posts (
  id,
  title,
  filename,
  date,
  folder,
  cover_tone,
  content_markdown
) values (
  'building-nischalos',
  'Building nischalOS',
  'building-nischalos.md',
  '2026-07-01',
  'Build Logs',
  'mint',
  $$Paste the full Markdown body here.$$
);
```

For an existing Supabase table created before `content_markdown` existed, run:

```sql
alter table public.blog_posts
add column if not exists content_markdown text;
```

## Project structure

- `src/hooks` contains portfolio data loading, the live clock, and desktop-window state.
- `src/features` contains the Blog, Project, and About window content.
- `src/desktop` contains desktop icons, dock behavior, artwork, and explicit dock pinning.
- `src/windows` contains reusable window framing and viewport geometry.
- `src/styles/theme` contains the component-scoped dark theme layers.
- `src/assets/fonts` contains the locally bundled Geist fonts and their license.
- `public` contains the favicon and app artwork.

The Markdown blog reader is lazy-loaded so its rendering dependencies are not part of the initial JavaScript bundle.

## Checks

Run the complete pre-commit check:

```bash
npm run check
```

Or run each check individually:

```bash
npm run lint
npm run test
npm run build
```

To preview the production build locally:

```bash
npm run preview
```
