export type Project = {
  id: string
  title: string
  subtitle: string
  iconTone: string
  thumbnail?: string
  type: string
  model: string
  story: string
  screenshots: string[]
  demoUrl?: string
  sourceUrl?: string
  postId?: string
}

export type BlogPost = {
  id: string
  title: string
  filename: string
  date: string
  folder: 'Notes' | 'Build Logs' | 'Drafts'
  coverTone: string
  contentMarkdown?: string
  content: string[]
}

export type SettingsSection = {
  id: string
  label: string
  displayTitle?: string
  displaySubtitle?: string
  body: string
  details?: Array<{
    label: string
    value: string
  }>
  items: string[]
}

export const projects: Project[] = [
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
    screenshots: ['/project-media/still/still-preview.png'],
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
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/cat-detail.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/catalog-overview.jpg',
      'https://twrilkmctqxdizoojgzd.supabase.co/storage/v1/object/public/project-screenshots/maneki-neko/color-collection.jpg',
    ],
    demoUrl: 'https://nerdynischal.github.io/my-maneki-neko-collection/',
    sourceUrl: 'https://github.com/nerdynischal/my-maneki-neko-collection',
  },
]

export const posts: BlogPost[] = [
  {
    id: 'welcome-to-nischalos',
    title: 'Welcome to nischalOS',
    filename: 'welcome-to-nischalos.md',
    date: '2026-07-23',
    folder: 'Build Logs',
    coverTone: 'graphite',
    content: [
      'nischalOS is a desktop-inspired home for my projects, experiments, and notes.',
      'Projects open as movable windows, the dock keeps frequently used apps close, and Supabase supplies the live portfolio content.',
      'When the remote content is unavailable, this local note and a small selection of real projects keep the desktop useful.',
    ],
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
      { label: 'Status', value: 'Building nischalOS' },
    ],
    items: [],
  },
]

export const DEFAULT_SETTINGS_SECTION_ID = settingsSections[0].id
