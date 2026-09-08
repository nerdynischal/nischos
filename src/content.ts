import { loadProjectManifests } from './content/projectManifest'
import { sortProjects } from './content/projectOrdering'
import type { BlogPost, SettingsSection } from './content/types'

export const projects = sortProjects(loadProjectManifests())

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
  {
    id: 'values',
    label: 'Values',
    displayTitle: 'Values',
    displaySubtitle: 'Design Principles',
    body: '',
    items: [
      'Design with intention',
      'Design with integrity',
      'Design with curiosity',
      'Design with simplicity',
      'Design with empathy',
    ],
  },
  {
    id: 'hobbies',
    label: 'Hobbies',
    displayTitle: 'Hobbies',
    displaySubtitle: 'Current interests',
    body: '',
    details: [
      { label: 'Exploring', value: 'AI tools & Front End Development' },
      { label: 'Reading', value: 'Building a Second Brain by Tiago Forte' },
      { label: 'Listening', value: 'Dive Club, How to be a Better Human' },
      { label: 'Playing', value: 'Dunk City Dynasty, PES' },
    ],
    items: [],
  },
]

export const DEFAULT_SETTINGS_SECTION_ID = settingsSections[0].id
