alter table public.blog_posts
add column if not exists is_pinned boolean not null default false;

insert into public.blog_posts (
  id,
  title,
  filename,
  date,
  folder,
  cover_tone,
  is_pinned,
  content_markdown,
  content
) values (
  'welcome-to-nischalos',
  'Welcome to nischalOS',
  'welcome-to-nischalos.md',
  '2026-08-25',
  'Notes',
  'graphite',
  true,
  $$Welcome — this is my corner of the internet, designed less like a traditional portfolio and more like a small desktop.

## A portfolio you can explore

nischalOS brings together the projects I build, the ideas I write down, and a little about who I am. Everything opens in its own window, so you can move around the site in whatever order feels natural.

## Finding your way around

- **Projects** open from the icons on the desktop. Each one includes the story behind it, a closer look at the interface, and links to visit the finished work or view its source when available.
- **Notes** is where I share build logs, decisions, experiments, and things I learn along the way.
- **About** has the short version of who I am and what I am currently focused on.

Select any desktop icon to open it, or use the dock at the bottom to jump between open windows. You can move and layer windows just like you would on a desktop.

## Always in progress

This website is also one of the projects. I will keep refining the system, adding new work, and writing about what I discover while making it.

Thanks for stopping by.$$,
  array[]::text[]
)
on conflict (id) do update set
  title = excluded.title,
  filename = excluded.filename,
  date = excluded.date,
  folder = excluded.folder,
  cover_tone = excluded.cover_tone,
  is_pinned = excluded.is_pinned,
  content_markdown = excluded.content_markdown,
  content = excluded.content;
