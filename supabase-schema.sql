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

alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.settings_sections enable row level security;

drop policy if exists "Projects are publicly readable" on public.projects;
create policy "Projects are publicly readable"
  on public.projects for select
  using (true);

drop policy if exists "Blog posts are publicly readable" on public.blog_posts;
create policy "Blog posts are publicly readable"
  on public.blog_posts for select
  using (true);

drop policy if exists "Settings sections are publicly readable" on public.settings_sections;
create policy "Settings sections are publicly readable"
  on public.settings_sections for select
  using (true);
