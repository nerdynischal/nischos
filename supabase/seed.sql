insert into public.projects (
  id,
  title,
  subtitle,
  icon_tone,
  thumbnail,
  type,
  stack,
  story,
  screenshots,
  demo_url,
  source_url
) values
  (
    'keyform',
    'Keyform',
    'An interactive ANSI QWERTY keyboard that responds to every physical key press.',
    'graphite',
    'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-key.svg',
    'interactive experiment',
    array['Vite', 'JavaScript', 'CSS', 'Web Audio'],
    'Keyform turns the keyboard into the interface. It mirrors physical input across a full ANSI QWERTY layout, supports Mac and Windows legends, and pairs responsive key states with optional sound so every press feels immediate.',
    array[
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-typing.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-mac.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-windows.jpg'
    ],
    'https://nerdynischal.github.io/keyform/',
    'https://github.com/nerdynischal/keyform'
  ),
  (
    'my-toolkit',
    'Nisch''s Toolkit',
    'A living catalogue of the tools in my design and development workflow.',
    'blue',
    'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/brand-logo.svg',
    'reference tool',
    array['React', 'TypeScript', 'CSS', 'Vite'],
    'I wanted one place to document the tools that shape my design and development workflow. The result is an interactive catalogue that separates everyday tools from things I am exploring, watching, or have moved on from.',
    array[
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/toolkit-overview.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/codex-detail.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/tool-categories.jpg'
    ],
    'https://nerdynischal.github.io/my-toolkit/',
    'https://github.com/nerdynischal/my-toolkit'
  ),
  (
    'maneki-neko-catalog',
    'Maneki Neko Catalog',
    'A personal checklist for tracking lucky cat figures.',
    'amber',
    'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/app-logo-medallion.svg',
    'hobby app',
    array['React', 'TypeScript', 'Vite'],
    'A lightweight catalog for Donkey Products Maneki Neko figures, with a visual product grid, local ownership tracking, and owned cats sorted to the front so the collection stays easy to scan.',
    array[
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/cat-detail.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/catalog-overview.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/color-collection.jpg'
    ],
    'https://nerdynischal.github.io/my-maneki-neko-collection/',
    'https://github.com/nerdynischal/my-maneki-neko-collection'
  )
on conflict (id) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  icon_tone = excluded.icon_tone,
  thumbnail = excluded.thumbnail,
  type = excluded.type,
  stack = excluded.stack,
  story = excluded.story,
  screenshots = excluded.screenshots,
  demo_url = excluded.demo_url,
  source_url = excluded.source_url;

insert into public.blog_posts (
  id,
  title,
  filename,
  date,
  folder,
  cover_tone,
  content
) values (
  'welcome-to-nischalos',
  'Welcome to nischalOS',
  'welcome-to-nischalos.md',
  '2026-07-23',
  'Build Logs',
  'graphite',
  array[
    'nischalOS is a desktop-inspired home for my projects, experiments, and notes.',
    'Projects open as movable windows, the dock keeps frequently used apps close, and Supabase supplies the live portfolio content.',
    'When the remote content is unavailable, this local note and a small selection of real projects keep the desktop useful.'
  ]
)
on conflict (id) do update set
  title = excluded.title,
  filename = excluded.filename,
  date = excluded.date,
  folder = excluded.folder,
  cover_tone = excluded.cover_tone,
  content = excluded.content;

insert into public.settings_sections (
  id,
  label,
  display_title,
  display_subtitle,
  body,
  details,
  items,
  sort_order
) values (
  'about',
  'About',
  'Nischal',
  'Design Engineer',
  'I build personal software, AI-assisted product experiments, and interfaces that feel precise but alive.',
  '[
    {"label": "Name", "value": "Nischal"},
    {"label": "Location", "value": "London, UK"},
    {"label": "Role", "value": "Design Engineer"},
    {"label": "Focus", "value": "Creative tools, systems, and interaction design"},
    {"label": "Status", "value": "Building nischalOS"}
  ]'::jsonb,
  array[]::text[],
  0
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;
