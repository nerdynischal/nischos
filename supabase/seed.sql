insert into public.projects (
  id,
  title,
  subtitle,
  icon_tone,
  thumbnail,
  type,
  model,
  sort_order,
  dock_order,
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
    'Fitness',
    'GPT-5.6 Sol',
    10,
    10,
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
    20,
    20,
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
    30,
    30,
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
    40,
    40,
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
    50,
    50,
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
  sort_order = excluded.sort_order,
  dock_order = excluded.dock_order,
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
  'values',
  'Values',
  'Values',
  'Design Principles',
  '',
  '[]'::jsonb,
  array[
    'Design with intention',
    'Design with integrity',
    'Design with curiosity',
    'Design with simplicity',
    'Design with empathy'
  ],
  10
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;

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
  'hobbies',
  'Hobbies',
  'Hobbies',
  'Current interests',
  '',
  '[
    {"label": "Exploring", "value": "AI tools & Front End Development"},
    {"label": "Reading", "value": "Building a Second Brain by Tiago Forte"},
    {"label": "Listening", "value": "Dive Club, How to be a Better Human"},
    {"label": "Playing", "value": "Dunk City Dynasty, PES"}
  ]'::jsonb,
  array[]::text[],
  20
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;

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
  'tools',
  'Tools',
  'Tools',
  'my toolkit',
  '',
  $$[
    {"id":"main","label":"Main","tools":[
      {"title":"Notion","description":"This is where almost everything gets documented. There’s no fixed template—the structure depends heavily on the project. Some pages contain detailed timelines, while others are just a few paragraphs. At a minimum, you’ll usually find notes, to-dos, and project logs.","icon":"/tool-icons/notion.svg","url":"https://www.notion.com/"},
      {"title":"Figma","description":"I haven’t used it much recently, but it used to be my go-to tool for wireframing and exploring design directions.","icon":"/tool-icons/figma.svg","url":"https://www.figma.com/"},
      {"title":"Visual Studio Code","description":"The dependable choice for anything code-related.","icon":"/tool-icons/visual-studio-code.svg","url":"https://code.visualstudio.com/"},
      {"title":"Codex","description":"Currently my favourite way to access everything AI.","icon":"/tool-icons/codex-lobe.png","url":"https://openai.com/codex/"},
      {"title":"Freeform","description":"A highly underrated tool in the Apple ecosystem. It’s excellent for quickly sketching and exploring ideas during brainstorming sessions.","icon":"/tool-icons/freeform.png","url":"https://apps.apple.com/us/app/freeform/id6443742539"}
    ]},
    {"id":"exploring","label":"Exploring","tools":[
      {"title":"Obsidian","description":"Currently giving it a try for note-taking and writing-related tasks.","icon":"/tool-icons/obsidian.svg","url":"https://obsidian.md/"},
      {"title":"Gemini Notebook","description":"Experimenting with this as a tool for learning and research.","icon":"/tool-icons/notebooklm.svg","url":"https://notebooklm.google/"}
    ]},
    {"id":"watchlist","label":"Watchlist","tools":[
      {"title":"Affinity","description":"A particularly promising option for anything in the graphic design space.","icon":"/tool-icons/affinity.svg","url":"https://affinity.serif.com/"},
      {"title":"Conductor","description":"I’ve been hearing a lot about it on podcasts, so I may give it a try soon.","icon":"/tool-icons/conductor.svg","url":"https://www.conductor.build/"},
      {"title":"Paper","description":"I discovered it through an interview, and it seems like it could suit my workflow. I still need to try it properly, but it looks promising.","icon":"/tool-icons/paper.svg","url":"https://paper.dropbox.com/"}
    ]},
    {"id":"obsolete","label":"Obsolete","tools":[
      {"title":"Cursor","description":"A great experience overall, but ultimately too expensive for me.","icon":"/tool-icons/cursor-light.svg","url":"https://cursor.com/"},
      {"title":"Claude","description":"My go-to before my current go-to. Unfortunately, I burned through tokens far too quickly—and it only seemed to get worse.","icon":"/tool-icons/claude.svg","url":"https://claude.ai/"},
      {"title":"Adobe XD","description":"RIP. It was great while it lasted, and probably the time when I learned the most about design. Shout out to its smart animate feature :)","icon":"/tool-icons/xd.svg"},
      {"title":"Adobe Creative Suite","description":"Glad I no longer need to rely on it.","icon":"/tool-icons/adobe.svg","url":"https://www.adobe.com/creativecloud.html"},
      {"title":"Framer","description":"I’m glad it has now established itself as a website-building tool. Before the current version, though, it was just confusing… if you know, you know.","icon":"/tool-icons/framer-light.svg","url":"https://www.framer.com/"},
      {"title":"Sketch","description":"My very first design tool, although I never connected with it in the same way I did with Adobe XD or Figma.","icon":"/tool-icons/sketch-uxwing.png","url":"https://www.sketch.com/"},
      {"title":"Miro","description":"A great tool, but its alternatives suited my workflow better.","icon":"/tool-icons/miro.svg","url":"https://miro.com/"}
    ]}
  ]$$::jsonb,
  array[]::text[],
  30
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;

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
  'contact',
  'Contact',
  'Contact',
  'Get in touch',
  '',
  '[
    {"label": "Email", "value": "test@example.test"},
    {"label": "LinkedIn", "value": "linkedin.com", "href": "https://www.linkedin.com/"},
    {"label": "GitHub", "value": "github.com", "href": "https://github.com/"}
  ]'::jsonb,
  array[]::text[],
  40
)
on conflict (id) do update set
  label = excluded.label,
  display_title = excluded.display_title,
  display_subtitle = excluded.display_subtitle,
  body = excluded.body,
  details = excluded.details,
  items = excluded.items,
  sort_order = excluded.sort_order;
