-- Initial schema snapshot. Later migrations evolve this shape; the
-- dashboard-friendly supabase-schema.sql is the cumulative current schema.

create table if not exists public.projects (
  id text primary key,
  title text not null,
  subtitle text,
  icon_tone text,
  thumbnail text,
  type text,
  stack text[] default '{}',
  story text,
  screenshots text[] default '{}',
  demo_url text,
  source_url text,
  post_id text,
  created_at timestamptz not null default now()
);

alter table public.projects add column if not exists subtitle text;
alter table public.projects add column if not exists icon_tone text;
alter table public.projects add column if not exists thumbnail text;
alter table public.projects add column if not exists type text;
alter table public.projects add column if not exists stack text[] default '{}';
alter table public.projects add column if not exists story text;
alter table public.projects add column if not exists screenshots text[] default '{}';
alter table public.projects add column if not exists demo_url text;
alter table public.projects add column if not exists source_url text;
alter table public.projects add column if not exists post_id text;
alter table public.projects add column if not exists created_at timestamptz not null default now();

create table if not exists public.blog_posts (
  id text primary key,
  title text not null,
  filename text,
  date text not null,
  folder text check (folder in ('Notes', 'Build Logs', 'Drafts')),
  cover_tone text,
  content_markdown text,
  content text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.blog_posts add column if not exists filename text;
alter table public.blog_posts add column if not exists folder text;
alter table public.blog_posts add column if not exists cover_tone text;
alter table public.blog_posts add column if not exists content_markdown text;
alter table public.blog_posts add column if not exists content text[] default '{}';
alter table public.blog_posts add column if not exists created_at timestamptz not null default now();

create table if not exists public.settings_sections (
  id text primary key,
  label text not null,
  display_title text,
  display_subtitle text,
  body text default '',
  details jsonb default '[]'::jsonb,
  items text[] default '{}',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.settings_sections add column if not exists display_title text;
alter table public.settings_sections add column if not exists display_subtitle text;
alter table public.settings_sections add column if not exists body text default '';
alter table public.settings_sections add column if not exists details jsonb default '[]'::jsonb;
alter table public.settings_sections add column if not exists items text[] default '{}';
alter table public.settings_sections add column if not exists sort_order integer not null default 0;
alter table public.settings_sections add column if not exists created_at timestamptz not null default now();

alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.settings_sections enable row level security;

revoke insert, update, delete, truncate, references, trigger
  on public.projects, public.blog_posts, public.settings_sections
  from anon, authenticated;
grant select
  on public.projects, public.blog_posts, public.settings_sections
  to anon, authenticated;

drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Projects are publicly readable"
  on public.projects for select
  to anon, authenticated
  using (true);

drop policy if exists "Blog posts are publicly readable" on public.blog_posts;
create policy "Blog posts are publicly readable"
  on public.blog_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Settings sections are publicly readable" on public.settings_sections;
create policy "Settings sections are publicly readable"
  on public.settings_sections for select
  to anon, authenticated
  using (true);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
) values (
  'project-screenshots',
  'project-screenshots',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Project screenshots are publicly readable" on storage.objects;
create policy "Project screenshots are publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'project-screenshots');
