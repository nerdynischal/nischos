import type { BlogPost, Project, SettingsSection } from './content/types'

export const projects: Project[] = [
  {
    id: 'workout-board',
    title: 'Workout Board',
    subtitle: 'A focused, local-first planner for a single training session.',
    iconTone: 'mint',
    thumbnail: '/project-media/workout-board/icon.svg',
    type: 'Fitness',
    model: 'GPT-5.6 Sol',
    story:
      'Workout Board keeps exercises, individual sets, reps, and weights together in one focused session view. Progress saves automatically in the browser, while a built-in countdown timer and stopwatch keep rest periods close at hand without requiring an account.',
    screenshots: [
      '/project-media/workout-board/workout-board-session.png',
      '/project-media/workout-board/workout-board-overview.png',
    ],
    demoUrl: 'https://nerdynischal.github.io/workout-board/',
    sourceUrl: 'https://github.com/nerdynischal/workout-board',
  },
  {
    id: 'still',
    title: 'Still',
    subtitle: 'A private, local-first visual library for websites worth remembering.',
    iconTone: 'coral',
    thumbnail: '/project-media/still/icon.png',
    type: 'desktop app',
    model: 'GPT-5.6 Sol',
    story:
      'Still captures full-page website screenshots, extracts useful metadata, and organises everything into a searchable personal collection stored entirely on the Mac.',
    screenshots: ['/project-media/still/still-preview.webp'],
  },
  {
    id: 'keyform',
    title: 'Keyform',
    subtitle: 'An interactive ANSI QWERTY keyboard that responds to every physical key press.',
    iconTone: 'graphite',
    thumbnail:
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-key.svg',
    type: 'interactive experiment',
    model: 'GPT-5.6 Sol',
    story:
      'Keyform turns the keyboard into the interface. It mirrors physical input across a full ANSI QWERTY layout, supports Mac and Windows legends, and pairs responsive key states with optional sound so every press feels immediate.',
    screenshots: [
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-typing.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-mac.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/keyform/keyform-windows.jpg',
    ],
    demoUrl: 'https://nerdynischal.github.io/keyform/',
    sourceUrl: 'https://github.com/nerdynischal/keyform',
  },
  {
    id: 'my-toolkit',
    title: "Nisch's Toolkit",
    subtitle: 'A living catalogue of the tools in my design and development workflow.',
    iconTone: 'blue',
    thumbnail:
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/brand-logo.svg',
    type: 'reference tool',
    model: 'GPT-5.5',
    story:
      'I wanted one place to document the tools that shape my design and development workflow. The result is an interactive catalogue that separates everyday tools from things I am exploring, watching, or have moved on from.',
    screenshots: [
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/toolkit-overview.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/codex-detail.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/toolkit/tool-categories.jpg',
    ],
    demoUrl: 'https://nerdynischal.github.io/my-toolkit/',
    sourceUrl: 'https://github.com/nerdynischal/my-toolkit',
  },
  {
    id: 'maneki-neko-catalog',
    title: 'Maneki Neko Catalog',
    subtitle: 'A personal checklist for tracking lucky cat figures.',
    iconTone: 'amber',
    thumbnail:
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/app-logo-medallion.svg',
    type: 'hobby app',
    model: 'GPT-5.5',
    story:
      'A lightweight catalog for Donkey Products Maneki Neko figures, with a visual product grid, local ownership tracking, and owned cats sorted to the front so the collection stays easy to scan.',
    screenshots: [
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/product-01-catalog.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/product-02-collection-status.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/product-03-product-details.jpg',
    ],
    demoUrl: 'https://nerdynischal.github.io/my-maneki-neko-collection/',
    sourceUrl: 'https://github.com/nerdynischal/my-maneki-neko-collection',
  },
]

export const posts: BlogPost[] = [
  {
    id: 'welcome-to-nischos',
    title: 'Welcome to nischOS',
    date: '2026-08-25',
    folder: 'Notes',
    isPinned: true,
    contentMarkdown: `Welcome — this is my corner of the internet, designed less like a traditional portfolio and more like a small desktop.

## A portfolio you can explore

nischOS brings together the projects I build, the ideas I write down, and a little about who I am. Everything opens in its own window, so you can move around the site in whatever order feels natural.

## Finding your way around

- **Projects** open from the icons on the desktop. Each one includes the story behind it, a closer look at the interface, and links to visit the finished work or view its source when available.
- **Notes** is where I share build logs, decisions, experiments, and things I learn along the way.
- **About** has the short version of who I am and what I am currently focused on.

Select any desktop icon to open it, or use the dock at the bottom to jump between open windows. You can move and layer windows just like you would on a desktop.

## Always in progress

This website is also one of the projects. I will keep refining the system, adding new work, and writing about what I discover while making it.

Thanks for stopping by.`,
  },
]

export const settingsSections: SettingsSection[] = [
  {
    id: 'about',
    label: 'About',
    displayTitle: 'Nischal',
    displaySubtitle: 'Design Engineer',
    body:
      'I build personal software, AI-assisted product experiments, and interfaces that feel precise but alive.',
    details: [
      { label: 'Name', value: 'Nischal' },
      { label: 'Location', value: 'London, UK' },
      { label: 'Role', value: 'Design Engineer' },
      { label: 'Focus', value: 'Creative tools, systems, and interaction design' },
      { label: 'Status', value: 'Building nischOS' },
    ],
    items: [],
  },
]

export const DEFAULT_SETTINGS_SECTION_ID = settingsSections[0].id
