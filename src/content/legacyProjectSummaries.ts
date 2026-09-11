import type { Project } from './types'

const mediaRoot = '/project-media/legacy'

// Lightweight metadata for the desktop, dock, and Selected Work folder.
export const legacyProjectSummaries: Project[] = [
  {
    id: 'auto-gmail',
    title: 'Auto Gmail',
    subtitle: 'A product identity and Chrome Store launch kit for an AI email assistant.',
    iconTone: 'violet',
    thumbnail: `${mediaRoot}/auto-gmail/cover.jpg`,
    type: 'Branding',
    model: 'Case study',
    sortOrder: 10,
    story:
      'Designed the product icon and promotional assets for Auto Gmail, a Chrome extension that uses inbox context and ChatGPT to draft replies.',
    screenshots: [
      `${mediaRoot}/auto-gmail/promo-1.jpg`,
      `${mediaRoot}/auto-gmail/promo-5.jpg`,
    ],
  },
  {
    id: 'ravageous',
    title: 'Ravageous',
    subtitle: 'Turning a dense software-download site into a focused game launch page.',
    iconTone: 'rose',
    thumbnail: `${mediaRoot}/ravageous/cover.jpg`,
    type: 'UI · UX · Web',
    model: 'Case study',
    sortOrder: 20,
    story:
      'Redesigned the landing page for an unreleased game, simplifying a fragmented download experience while giving it a clearer game-led identity.',
    screenshots: [
      `${mediaRoot}/ravageous/exploration.jpg`,
      `${mediaRoot}/ravageous/final.jpg`,
    ],
  },
  {
    id: 'freeguides',
    title: 'Freeguides',
    subtitle: 'Two landing-page stories for one self-guided travel platform.',
    iconTone: 'mint',
    thumbnail: `${mediaRoot}/freeguides/cover.jpg`,
    type: 'UI · UX · Web',
    model: 'Case study',
    sortOrder: 30,
    story:
      'Designed a pair of focused landing pages that explain the FreeGuides platform differently to hotel and hostel operators.',
    screenshots: [
      `${mediaRoot}/freeguides/hostel.jpg`,
      `${mediaRoot}/freeguides/hotel.jpg`,
    ],
  },
  {
    id: 'form-gpt',
    title: 'Form GPT',
    subtitle: 'A compact AI analysis widget translated from sketch to product direction.',
    iconTone: 'amber',
    thumbnail: `${mediaRoot}/form-gpt/cover.jpg`,
    type: 'UI · UX',
    model: 'Case study',
    sortOrder: 40,
    story:
      'Created a practical interface concept for a Chrome extension that analyses the current page with AI.',
    screenshots: [
      `${mediaRoot}/form-gpt/exploration.jpg`,
      `${mediaRoot}/form-gpt/final.jpg`,
    ],
  },
  {
    id: 'donor-hub',
    title: 'Donor Hub',
    subtitle: 'A modern donation experience with a prize mechanism and two themes.',
    iconTone: 'blue',
    thumbnail: `${mediaRoot}/donor-hub/cover.jpg`,
    type: 'UI · IA · Web',
    model: 'Case study',
    sortOrder: 50,
    story:
      'Designed a responsive dApp donor hub for a tech-aware audience, including the transaction journey in dark and light modes.',
    screenshots: [
      `${mediaRoot}/donor-hub/exploration.jpg`,
      `${mediaRoot}/donor-hub/dark.jpg`,
      `${mediaRoot}/donor-hub/light.jpg`,
    ],
  },
  {
    id: 'alice-puzzle',
    title: 'Alice Puzzle Game Interface',
    subtitle: 'A retro-terminal visual direction for a sentence-building logic game.',
    iconTone: 'graphite',
    thumbnail: `${mediaRoot}/alice-puzzle/cover.jpg`,
    type: 'UI · UX · IA',
    model: 'Case study',
    sortOrder: 60,
    story:
      'Helped an indie developer define the information architecture and interface language for a logic game played by programming a malfunctioning AI.',
    screenshots: [`${mediaRoot}/alice-puzzle/final.png`],
  },
  {
    id: 'vocal-email',
    title: 'Vocal Email',
    subtitle: 'A shorter, clearer upgrade path for a voice-message email product.',
    iconTone: 'coral',
    thumbnail: `${mediaRoot}/vocal-email/cover.jpg`,
    type: 'UI · UX · Web',
    model: 'Case study',
    sortOrder: 70,
    story:
      'Redesigned the Vocal Email paywall and payment journey around one Pro plan across mobile and desktop.',
    screenshots: [
      `${mediaRoot}/vocal-email/moodboard.png`,
      `${mediaRoot}/vocal-email/desktop.jpg`,
      `${mediaRoot}/vocal-email/success.jpg`,
    ],
  },
  {
    id: 'seogaeilge',
    title: 'SeoGaeilge',
    subtitle: 'A clearer information system for discovering Irish-language media.',
    iconTone: 'mint',
    thumbnail: `${mediaRoot}/seogaeilge/cover.jpg`,
    type: 'UI · UX · IA · Web',
    model: 'Case study',
    sortOrder: 80,
    story:
      'Reworked the navigation, content patterns, and interface of a community resource site for learning Irish.',
    screenshots: [
      `${mediaRoot}/seogaeilge/before.png`,
      `${mediaRoot}/seogaeilge/resources.jpg`,
      `${mediaRoot}/seogaeilge/audio.jpg`,
    ],
  },
]
