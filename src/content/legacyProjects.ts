import type { Project } from './types'

const mediaRoot = '/project-media/legacy'

export const legacyProjects: Project[] = [
  {
    id: 'auto-gmail',
    title: 'Auto Gmail',
    subtitle: 'A product identity and Chrome Store launch kit for an AI email assistant.',
    iconTone: 'violet',
    thumbnail: `${mediaRoot}/auto-gmail/cover.jpg`,
    type: 'Branding',
    model: 'Freelance archive',
    sortOrder: 10,
    story:
      'Designed the product icon and promotional assets for Auto Gmail, a Chrome extension that uses inbox context and ChatGPT to draft replies.',
    screenshots: [
      `${mediaRoot}/auto-gmail/promo-1.jpg`,
      `${mediaRoot}/auto-gmail/promo-5.jpg`,
    ],
    caseStudy: {
      tags: ['Branding'],
      sections: [
        {
          title: 'The brief',
          body: [
            'Design a product icon and a flexible set of assets for Auto Gmail’s Chrome Store listing. The extension connects to Gmail and uses inbox context with ChatGPT to draft responses to inbound messages in a single click.',
          ],
        },
        {
          title: 'Final designs',
          body: [
            'After several rounds with the client, the visual system was refined into a recognisable product icon, a small promotional tile, a marquee graphic, and a set of feature-led store images.',
          ],
          images: [
            {
              src: `${mediaRoot}/auto-gmail/promo-1.jpg`,
              alt: 'Auto Gmail promotional image explaining automatic email drafts',
              caption: 'Chrome Store promotional artwork',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-5.jpg`,
              alt: 'Auto Gmail promotional product artwork',
              caption: 'Final promotional asset',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'ravageous',
    title: 'Ravageous',
    subtitle: 'Turning a dense software-download site into a focused game launch page.',
    iconTone: 'rose',
    thumbnail: `${mediaRoot}/ravageous/cover.jpg`,
    type: 'UI · UX · Web',
    model: 'Freelance archive',
    sortOrder: 20,
    story:
      'Redesigned the landing page for an unreleased game, simplifying a fragmented download experience while giving it a clearer game-led identity.',
    screenshots: [
      `${mediaRoot}/ravageous/exploration.jpg`,
      `${mediaRoot}/ravageous/final.jpg`,
    ],
    caseStudy: {
      tags: ['UI', 'UX', 'Web'],
      sections: [
        {
          title: 'The challenge',
          body: [
            'The existing site spread long, repetitive content across several pages and felt more like a utility download page than a game launch. Calls to action were easy to miss and the hierarchy made the journey difficult to follow.',
          ],
          bullets: [
            'Keep the implementation compatible with Material Design and Flutter.',
            'Consolidate the experience into a single landing page.',
            'Retain downloads, platform instructions, package contents, changelog, and newsletter signup.',
          ],
        },
        {
          title: 'Exploration',
          body: [
            'The first pass established a clearer hierarchy for the large amount of required information and explored how the supplied game artwork could shape a more distinctive visual direction.',
          ],
          images: [
            {
              src: `${mediaRoot}/ravageous/exploration.jpg`,
              alt: 'Early Ravageous landing-page design exploration',
              caption: 'Initial landing-page direction',
            },
          ],
        },
        {
          title: 'Final design',
          body: [
            'The final single-page design trims and rewrites repetitive copy, brings platform downloads forward, and repeats meaningful calls to action throughout. Game assets create a stronger sense of place without obscuring the practical installation content.',
          ],
          images: [
            {
              src: `${mediaRoot}/ravageous/final.jpg`,
              alt: 'Final long-form Ravageous landing page',
              caption: 'Final single-page experience',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'freeguides',
    title: 'Freeguides',
    subtitle: 'Two landing-page stories for one self-guided travel platform.',
    iconTone: 'mint',
    thumbnail: `${mediaRoot}/freeguides/cover.jpg`,
    type: 'UI · UX · Web',
    model: 'Freelance archive',
    sortOrder: 30,
    story:
      'Designed a pair of focused landing pages that explain the FreeGuides platform differently to hotel and hostel operators.',
    screenshots: [
      `${mediaRoot}/freeguides/hostel.jpg`,
      `${mediaRoot}/freeguides/hotel.jpg`,
    ],
    caseStudy: {
      tags: ['UI', 'UX', 'Web'],
      sections: [
        {
          title: 'The brief',
          body: [
            'FreeGuides needed a page for its self-guided tour platform that clearly separated the proposition for hostels from the one for hotels. Both routes needed to explain the product, pricing, proof points, and provide a direct path to booking a demo.',
          ],
          bullets: [
            'Work within the existing Figma design system.',
            'Make the hotel and hostel propositions immediately distinguishable.',
            'Keep the experience visually engaging while preserving a clear sales narrative.',
          ],
        },
        {
          title: 'Exploration and direction',
          body: [
            'Copy analysis and competitor research suggested two different value stories: monetisation for hostels, and an enhanced guest experience for hotels. The shared system keeps the pages related while content priority and imagery give each route its own emphasis.',
          ],
        },
        {
          title: 'Final designs',
          images: [
            {
              src: `${mediaRoot}/freeguides/hostel.jpg`,
              alt: 'FreeGuides landing page for hostel operators',
              caption: 'Hostel page — focused on revenue opportunities',
            },
            {
              src: `${mediaRoot}/freeguides/hotel.jpg`,
              alt: 'FreeGuides landing page for hotel operators',
              caption: 'Hotel page — focused on the guest experience',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'form-gpt',
    title: 'Form GPT',
    subtitle: 'A compact AI analysis widget translated from sketch to product direction.',
    iconTone: 'amber',
    thumbnail: `${mediaRoot}/form-gpt/cover.jpg`,
    type: 'UI · UX',
    model: 'Freelance archive',
    sortOrder: 40,
    story:
      'Created a practical interface concept for a Chrome extension that analyses the current page with AI.',
    screenshots: [
      `${mediaRoot}/form-gpt/exploration.jpg`,
      `${mediaRoot}/form-gpt/final.jpg`,
    ],
    caseStudy: {
      tags: ['UI', 'UX'],
      sections: [
        {
          title: 'The brief',
          body: [
            'Turn a developer’s early sketch into a tangible mockup for an AI-powered Chrome extension. The widget needed to analyse the current page while making the intended features and interaction model easy to understand before development began.',
          ],
        },
        {
          title: 'Initial direction',
          body: [
            'The first pass established a base interface from the sketch, using the supplied references to test hierarchy, input states, and the relationship between the extension controls and the host page.',
          ],
          images: [
            {
              src: `${mediaRoot}/form-gpt/exploration.jpg`,
              alt: 'Early Form GPT extension interface exploration',
              caption: 'Initial widget exploration',
            },
          ],
        },
        {
          title: 'Final design',
          body: [
            'With very little screen space available, the final design prioritises feature clarity and progressive disclosure so the widget remains useful without feeling crowded.',
          ],
          images: [
            {
              src: `${mediaRoot}/form-gpt/final.jpg`,
              alt: 'Final Form GPT browser extension interface',
              caption: 'Final compact extension UI',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'donor-hub',
    title: 'Donor Hub',
    subtitle: 'A modern donation experience with a prize mechanism and two themes.',
    iconTone: 'blue',
    thumbnail: `${mediaRoot}/donor-hub/cover.jpg`,
    type: 'UI · IA · Web',
    model: 'Freelance archive',
    sortOrder: 50,
    story:
      'Designed a responsive dApp donor hub for a tech-aware audience, including the transaction journey in dark and light modes.',
    screenshots: [
      `${mediaRoot}/donor-hub/exploration.jpg`,
      `${mediaRoot}/donor-hub/dark.jpg`,
      `${mediaRoot}/donor-hub/light.jpg`,
    ],
    caseStudy: {
      tags: ['UI', 'IA', 'Web'],
      sections: [
        {
          title: 'The brief',
          body: [
            'Redesign a blockchain-based donation tool with a prize mechanic. The client wanted a clean, contemporary interface for a tech-savvy audience, with glass-like depth replacing an outdated existing design.',
          ],
        },
        {
          title: 'Exploration',
          body: [
            'The visual direction began in dark mode, where translucency and layered surfaces could feel natural. A lightweight identity system was developed alongside the interface to connect the product’s donation and reward mechanics.',
          ],
          images: [
            {
              src: `${mediaRoot}/donor-hub/exploration.jpg`,
              alt: 'Donor Hub interface and identity exploration',
              caption: 'Early dark-mode direction',
            },
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The final system resolves dense tabular data for responsive layouts and makes transaction status visible through a focused popup flow. A light theme was added without losing the depth and hierarchy established in the original direction.',
          ],
          images: [
            {
              src: `${mediaRoot}/donor-hub/dark.jpg`,
              alt: 'Final Donor Hub dark-mode website',
              caption: 'Dark mode',
            },
            {
              src: `${mediaRoot}/donor-hub/light.jpg`,
              alt: 'Final Donor Hub light-mode website',
              caption: 'Light mode',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'alice-puzzle',
    title: 'Alice Puzzle Game Interface',
    subtitle: 'A retro-terminal visual direction for a sentence-building logic game.',
    iconTone: 'graphite',
    thumbnail: `${mediaRoot}/alice-puzzle/cover.jpg`,
    type: 'UI · UX · IA',
    model: 'Freelance archive',
    sortOrder: 60,
    story:
      'Helped an indie developer define the information architecture and interface language for a logic game played by programming a malfunctioning AI.',
    screenshots: [`${mediaRoot}/alice-puzzle/final.png`],
    caseStudy: {
      tags: ['UI', 'UX', 'IA'],
      sections: [
        {
          title: 'The game',
          body: [
            'The player is a malfunctioning AI trying to eliminate its master, Alice. They build executable sentences from a small word pool while working around laws that restrict the obvious solution on each level.',
          ],
          bullets: [
            'An in-game view of the world and the result of each command.',
            'A persistent list of laws the AI must respect.',
            'Achievements, available words, and the sentence currently being assembled.',
          ],
        },
        {
          title: 'Visual direction',
          body: [
            'Dummy content and realistic states were used to refine the information density. The direction combines AI, terminal, and retro-computing cues while keeping objectives, laws, and sentence construction readable on one static screen.',
          ],
        },
        {
          title: 'Final design',
          body: [
            'The final direction balances the game world with functional side panels for objectives and settings, plus an alternate menu treatment and a reusable style guide.',
          ],
          images: [
            {
              src: `${mediaRoot}/alice-puzzle/final.png`,
              alt: 'Final Alice puzzle game interface and style direction',
              caption: 'Final game interface direction',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'vocal-email',
    title: 'Vocal Email',
    subtitle: 'A shorter, clearer upgrade path for a voice-message email product.',
    iconTone: 'coral',
    thumbnail: `${mediaRoot}/vocal-email/cover.jpg`,
    type: 'UI · UX · Web',
    model: 'Freelance archive',
    sortOrder: 70,
    story:
      'Redesigned the Vocal Email paywall and payment journey around one Pro plan across mobile and desktop.',
    screenshots: [
      `${mediaRoot}/vocal-email/moodboard.png`,
      `${mediaRoot}/vocal-email/desktop.jpg`,
      `${mediaRoot}/vocal-email/success.jpg`,
    ],
    caseStudy: {
      tags: ['UI', 'UX', 'Web'],
      sections: [
        {
          title: 'The brief',
          body: [
            'Vocal Email makes it easy to send voice notes through email. Its paywall needed to move from Free, Pro, and Business tiers to one paid Pro plan, while reducing friction across the complete checkout journey.',
          ],
          bullets: [
            'Design for both mobile modals and desktop popovers.',
            'Include card entry, processing, success, and recoverable error states.',
            'Stay within the existing product theme and keep clicks to a minimum.',
            'Lead with unlimited messages and unlimited recording length.',
          ],
        },
        {
          title: 'Old design and inspiration',
          images: [
            {
              src: `${mediaRoot}/vocal-email/moodboard.png`,
              alt: 'Vocal Email old designs and visual references',
              caption: 'Existing experience and reference material',
            },
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The final flow presents the core value before payment details, then gives every transaction state a clear next step. The same hierarchy scales from a compact mobile modal to the wider desktop surface.',
          ],
          images: [
            {
              src: `${mediaRoot}/vocal-email/desktop.jpg`,
              alt: 'Final Vocal Email desktop paywall',
              caption: 'Desktop paywall',
            },
            {
              src: `${mediaRoot}/vocal-email/success.jpg`,
              alt: 'Vocal Email successful payment state',
              caption: 'Payment success state',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'seogaeilge',
    title: 'SeoGaeilge',
    subtitle: 'A clearer information system for discovering Irish-language media.',
    iconTone: 'mint',
    thumbnail: `${mediaRoot}/seogaeilge/cover.jpg`,
    type: 'UI · UX · IA · Web',
    model: 'Freelance archive',
    sortOrder: 80,
    story:
      'Reworked the navigation, content patterns, and interface of a community resource site for learning Irish.',
    screenshots: [
      `${mediaRoot}/seogaeilge/before.png`,
      `${mediaRoot}/seogaeilge/resources.jpg`,
      `${mediaRoot}/seogaeilge/audio.jpg`,
    ],
    caseStudy: {
      tags: ['UI', 'UX', 'IA', 'Web'],
      sections: [
        {
          title: 'The challenge',
          body: [
            'SeoGaeilge collects links to Irish-language media for learners. What began as a visual refresh also required information-architecture work so people could understand the available resource types and move through them with less effort.',
          ],
          bullets: [
            'Bring useful categories into the main navigation instead of hiding them in a limited dropdown.',
            'Make the “suggest a resource” action easier to find.',
            'Replace an unclear resource key with repeatable, learnable content patterns.',
          ],
          images: [
            {
              src: `${mediaRoot}/seogaeilge/before.png`,
              alt: 'Original SeoGaeilge homepage',
              caption: 'Original website',
            },
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The redesign uses consistent templates and descriptive tags so visitors can quickly understand each resource before opening it. Clearer navigation and category pages turn a repository of links into an explorable learning library.',
          ],
          images: [
            {
              src: `${mediaRoot}/seogaeilge/resources.jpg`,
              alt: 'Redesigned SeoGaeilge resource listing',
              caption: 'All-resources page',
            },
            {
              src: `${mediaRoot}/seogaeilge/audio.jpg`,
              alt: 'SeoGaeilge audio resource category page',
              caption: 'Category-page template',
            },
          ],
        },
      ],
    },
  },
]
