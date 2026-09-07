insert into public.projects (
  id,
  title,
  subtitle,
  icon_tone,
  thumbnail,
  type,
  model,
  story,
  screenshots,
  demo_url,
  source_url
) values
  (
    'workout-board',
    'Workout Board',
    'A focused, local-first planner for a single training session.',
    'mint',
    '/project-media/workout-board/icon.svg',
    'fitness tool',
    'GPT-5.6 Sol',
    'Workout Board keeps exercises, individual sets, reps, and weights together in one focused session view. Progress saves automatically in the browser, while a built-in countdown timer and stopwatch keep rest periods close at hand without requiring an account.',
    array[
      '/project-media/workout-board/workout-board-session.png',
      '/project-media/workout-board/workout-board-overview.png'
    ],
    'https://nerdynischal.github.io/workout-board/',
    'https://github.com/nerdynischal/workout-board'
  ),
  (
    'still',
    'Still',
    'A private, local-first visual library for websites worth remembering.',
    'coral',
    '/project-media/still/icon.png',
    'desktop app',
    'GPT-5.6 Sol',
    'Still captures full-page website screenshots, extracts useful metadata, and organises everything into a searchable personal collection stored entirely on the Mac.',
    array[
      '/project-media/still/still-preview.webp'
    ],
    null,
    null
  ),
  (
    'keyform',
    'Keyform',
    'An interactive ANSI QWERTY keyboard that responds to every physical key press.',
    'graphite',
    'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-key.svg',
    'interactive experiment',
    'GPT-5.6 Sol',
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
    'GPT-5.5',
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
    'GPT-5.5',
    'A lightweight catalog for Donkey Products Maneki Neko figures, with a visual product grid, local ownership tracking, and owned cats sorted to the front so the collection stays easy to scan.',
    array[
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/product-01-catalog.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/product-02-collection-status.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/product-03-product-details.jpg'
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
  model = excluded.model,
  story = excluded.story,
  screenshots = excluded.screenshots,
  demo_url = excluded.demo_url,
  source_url = excluded.source_url;

insert into public.blog_posts (
  id,
  title,
  date,
  folder,
  is_pinned,
  content_markdown
) values (
  'welcome-to-nischos',
  'Welcome to nischOS',
  '2026-08-25',
  'Notes',
  true,
  $$Welcome — this is my corner of the internet, designed less like a traditional portfolio and more like a small desktop.

## A portfolio you can explore

nischOS brings together the projects I build, the ideas I write down, and a little about who I am. Everything opens in its own window, so you can move around the site in whatever order feels natural.

## Finding your way around

- **Projects** open from the icons on the desktop. Each one includes the story behind it, a closer look at the interface, and links to visit the finished work or view its source when available.
- **Notes** is where I share build logs, decisions, experiments, and things I learn along the way.
- **About** has the short version of who I am and what I am currently focused on.

Select any desktop icon to open it, or use the dock at the bottom to jump between open windows. You can move and layer windows just like you would on a desktop.

## Always in progress

This website is also one of the projects. I will keep refining the system, adding new work, and writing about what I discover while making it.

Thanks for stopping by.$$
)
on conflict (id) do update set
  title = excluded.title,
  date = excluded.date,
  folder = excluded.folder,
  is_pinned = excluded.is_pinned,
  content_markdown = excluded.content_markdown;

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
    {"label": "Status", "value": "Building nischOS"}
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
