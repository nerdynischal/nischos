import type { SettingsToolGroup } from './types'

export const toolkitGroups: SettingsToolGroup[] = [
  {
    id: 'main',
    label: 'Main',
    tools: [
      {
        title: 'Notion',
        description:
          'This is where almost everything gets documented. There’s no fixed template—the structure depends heavily on the project. Some pages contain detailed timelines, while others are just a few paragraphs. At a minimum, you’ll usually find notes, to-dos, and project logs.',
        icon: '/tool-icons/notion.svg',
        url: 'https://www.notion.com/',
      },
      {
        title: 'Figma',
        description:
          'I haven’t used it much recently, but it used to be my go-to tool for wireframing and exploring design directions.',
        icon: '/tool-icons/figma.svg',
        url: 'https://www.figma.com/',
      },
      {
        title: 'Visual Studio Code',
        description: 'The dependable choice for anything code-related.',
        icon: '/tool-icons/visual-studio-code.svg',
        url: 'https://code.visualstudio.com/',
      },
      {
        title: 'Codex',
        description: 'Currently my favourite way to access everything AI.',
        icon: '/tool-icons/codex-lobe.png',
        url: 'https://openai.com/codex/',
      },
      {
        title: 'Freeform',
        description:
          'A highly underrated tool in the Apple ecosystem. It’s excellent for quickly sketching and exploring ideas during brainstorming sessions.',
        icon: '/tool-icons/freeform.png',
        url: 'https://apps.apple.com/us/app/freeform/id6443742539',
      },
    ],
  },
  {
    id: 'exploring',
    label: 'Exploring',
    tools: [
      {
        title: 'Obsidian',
        description: 'Currently giving it a try for note-taking and writing-related tasks.',
        icon: '/tool-icons/obsidian.svg',
        url: 'https://obsidian.md/',
      },
      {
        title: 'Gemini Notebook',
        description: 'Experimenting with this as a tool for learning and research.',
        icon: '/tool-icons/notebooklm.svg',
        url: 'https://notebooklm.google/',
      },
    ],
  },
  {
    id: 'watchlist',
    label: 'Watchlist',
    tools: [
      {
        title: 'Affinity',
        description: 'A particularly promising option for anything in the graphic design space.',
        icon: '/tool-icons/affinity.svg',
        url: 'https://affinity.serif.com/',
      },
      {
        title: 'Conductor',
        description: 'I’ve been hearing a lot about it on podcasts, so I may give it a try soon.',
        icon: '/tool-icons/conductor.svg',
        url: 'https://www.conductor.build/',
      },
      {
        title: 'Paper',
        description:
          'I discovered it through an interview, and it seems like it could suit my workflow. I still need to try it properly, but it looks promising.',
        icon: '/tool-icons/paper.svg',
        url: 'https://paper.dropbox.com/',
      },
    ],
  },
  {
    id: 'obsolete',
    label: 'Obsolete',
    tools: [
      {
        title: 'Cursor',
        description: 'A great experience overall, but ultimately too expensive for me.',
        icon: '/tool-icons/cursor-light.svg',
        url: 'https://cursor.com/',
      },
      {
        title: 'Claude',
        description:
          'My go-to before my current go-to. Unfortunately, I burned through tokens far too quickly—and it only seemed to get worse.',
        icon: '/tool-icons/claude.svg',
        url: 'https://claude.ai/',
      },
      {
        title: 'Adobe XD',
        description:
          'RIP. It was great while it lasted, and probably the time when I learned the most about design. Shout out to its smart animate feature :)',
        icon: '/tool-icons/xd.svg',
      },
      {
        title: 'Adobe Creative Suite',
        description: 'Glad I no longer need to rely on it.',
        icon: '/tool-icons/adobe.svg',
        url: 'https://www.adobe.com/creativecloud.html',
      },
      {
        title: 'Framer',
        description:
          'I’m glad it has now established itself as a website-building tool. Before the current version, though, it was just confusing… if you know, you know.',
        icon: '/tool-icons/framer-light.svg',
        url: 'https://www.framer.com/',
      },
      {
        title: 'Sketch',
        description:
          'My very first design tool, although I never connected with it in the same way I did with Adobe XD or Figma.',
        icon: '/tool-icons/sketch-uxwing.png',
        url: 'https://www.sketch.com/',
      },
      {
        title: 'Miro',
        description: 'A great tool, but its alternatives suited my workflow better.',
        icon: '/tool-icons/miro.svg',
        url: 'https://miro.com/',
      },
    ],
  },
]
