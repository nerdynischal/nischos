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
    model: 'Case study',
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
            'Design the product icon and promotional assets for Auto Gmail’s Chrome Store listing. The extension connects to a Gmail inbox and uses the user’s data with ChatGPT to draft a response to every inbound message in a single click.',
          ],
        },
        {
          title: 'Initial drafts',
          body: [
            'Early directions explored how a small product mark could communicate both email and assisted writing while remaining legible at extension-icon scale.',
          ],
          images: [
            {
              src: `${mediaRoot}/auto-gmail/initial-drafts.webp`,
              alt: 'Early Auto Gmail product icon concepts exploring email and AI motifs',
              caption: 'Initial product icon explorations',
            },
          ],
        },
        {
          title: 'Final designs',
          body: [
            'After several iterations with the client, the final system included the product icon, a small promotional tile, a marquee image for the store carousel, and five supporting promotional images.',
          ],
          imageLayout: 'masonry',
          images: [
            {
              src: `${mediaRoot}/auto-gmail/logo.jpg`,
              alt: 'Final Auto Gmail product icon',
              caption: 'Product icon',
              displaySize: 'compact',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-small.jpg`,
              alt: 'Auto Gmail small promotional tile',
              caption: 'Small promotional tile',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-marquee.jpg`,
              alt: 'Auto Gmail marquee promotional artwork',
              caption: 'Store carousel marquee',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-1.jpg`,
              alt: 'Auto Gmail promotional image explaining automatic email drafts',
              caption: 'Promotional image 1',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-2.jpg`,
              alt: 'Auto Gmail promotional feature artwork',
              caption: 'Promotional image 2',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-3.jpg`,
              alt: 'Auto Gmail promotional feature artwork',
              caption: 'Promotional image 3',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-4.jpg`,
              alt: 'Auto Gmail promotional feature artwork',
              caption: 'Promotional image 4',
            },
            {
              src: `${mediaRoot}/auto-gmail/promo-5.jpg`,
              alt: 'Auto Gmail promotional product artwork',
              caption: 'Promotional image 5',
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
    model: 'Case study',
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
          title: 'The brief',
          body: [
            'Redesign the existing landing page for the unreleased game Ravageous. The client wanted to reduce the amount of information, simplify the journey, and make the launch easier to follow.',
          ],
        },
        {
          title: 'Existing design',
          body: [
            'The original experience spread the product story, platform downloads, installation instructions, and contact information across separate utility-led pages.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/ravageous/old-home.jpg`, alt: 'Original Ravageous landing page', caption: 'Old landing page' },
            { src: `${mediaRoot}/ravageous/old-android.jpg`, alt: 'Original Android download instructions', caption: 'Android instructions' },
            { src: `${mediaRoot}/ravageous/old-linux.jpg`, alt: 'Original Linux download instructions', caption: 'Linux instructions' },
            { src: `${mediaRoot}/ravageous/old-windows.jpg`, alt: 'Original Windows download instructions', caption: 'Windows instructions' },
            { src: `${mediaRoot}/ravageous/old-contact.jpg`, alt: 'Original Ravageous contact page', caption: 'Old contact page' },
          ],
        },
        {
          title: 'Audit findings',
          bullets: [
            'Repetitive content and long copy appeared across several pages.',
            'The interface felt like a generic software download site rather than a game experience.',
            'Calls to action were weak and easy to miss.',
            'Hierarchy and flow did not guide visitors toward a clear next step.',
          ],
        },
        {
          title: 'Constraints and requirements',
          body: [
            'The redesign had to remain Material Design compliant for a Flutter implementation and consolidate the entire experience into one landing page.',
          ],
          bullets: [
            'A concise introduction to the game.',
            'Download links and installation instructions for every platform.',
            'A package-contents table explaining included files.',
            'A changelog and newsletter subscription call to action.',
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The launch needed to build excitement, but the previous experience had no clear calls to action and required visitors to move through several disconnected pages. The final design reduces, removes, and rewrites repetitive copy; makes platform downloads and their calls to action more prominent; and uses the client’s game assets to create a stronger sense of place.',
            'The result is a single-page website that retains the information from the old design while inviting action throughout the page.',
          ],
          images: [
            {
              src: `${mediaRoot}/ravageous/exploration.jpg`,
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
    model: 'Case study',
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
          title: 'Company background',
          body: [
            'FreeGuides was co-founded in 2018 with a vision to create a travel app that changes how people explore the world. Guides create one-of-a-kind experiences so travellers can discover a place in a more authentic and individual way.',
          ],
        },
        {
          title: 'Client brief',
          body: [
            'Create a single webpage showcasing the self-guided tour platform for hostels and hotels. The two sections needed to feel clearly different so visitors could immediately understand which proposition applied to them.',
          ],
          bullets: [
            'A clear headline communicating the platform’s value.',
            'An overview of how the platform works and the benefits it provides.',
            'Pricing for hostels and hotels.',
            'Testimonials or case studies demonstrating success.',
            'Calls to action for scheduling a demo or meeting.',
          ],
        },
        {
          title: 'Constraint',
          body: ['The new page had to conform to the company’s existing Figma design system.'],
        },
        {
          title: 'Exploration',
          body: [
            'The exploration phase tested value propositions, analysed the client’s copy, and compared two relevant competitors before committing to the page narratives.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/freeguides/value-propositions.png`, alt: 'FreeGuides value proposition exploration', caption: 'Value propositions' },
            { src: `${mediaRoot}/freeguides/copy-analysis.png`, alt: 'FreeGuides client copy analysis', caption: 'Copy analysis' },
            { src: `${mediaRoot}/freeguides/competitor-1.png`, alt: 'FreeGuides competitor analysis', caption: 'Competitor analysis 1' },
            { src: `${mediaRoot}/freeguides/competitor-2.png`, alt: 'FreeGuides competitor analysis', caption: 'Competitor analysis 2' },
          ],
        },
        {
          title: 'Key takeaways',
          body: [
            'The research supported two different approaches: a monetisation story for hostel owners and a service-led story focused on improving the guest experience for hotels.',
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The hostel page foregrounds monetary value and revenue opportunities. The hotel page instead emphasises how self-guided tours can enhance the experience offered to guests.',
          ],
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
    model: 'Case study',
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
            'Create a mockup that could help a developer conceptualise a side project before development: a Chrome extension or widget that analyses the current page using AI.',
          ],
        },
        {
          title: 'Source material',
          body: [
            'The client supplied a rough sketch of the extension alongside two visual references. These established the expected feature set and provided contrasting approaches to compact AI interfaces.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/form-gpt/client-sketch.png`, alt: 'Client sketch for the Form GPT extension', caption: 'Client sketch' },
            { src: `${mediaRoot}/form-gpt/inspiration-1.png`, alt: 'First interface reference supplied for Form GPT', caption: 'Inspiration 1' },
            { src: `${mediaRoot}/form-gpt/inspiration-2.png`, alt: 'Second interface reference supplied for Form GPT', caption: 'Inspiration 2' },
          ],
        },
        {
          title: 'Initial drafts',
          body: [
            'The early drafts translated the sketch into a base interface that could be evaluated and refined, testing several arrangements for the same core controls.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/form-gpt/draft-1.jpg`, alt: 'First compact Form GPT interface draft', caption: 'Draft 1' },
            { src: `${mediaRoot}/form-gpt/draft-2.jpg`, alt: 'Second compact Form GPT interface draft', caption: 'Draft 2' },
            { src: `${mediaRoot}/form-gpt/draft-3.jpg`, alt: 'Third compact Form GPT interface draft', caption: 'Draft 3' },
          ],
        },
        {
          title: 'Final designs',
          body: [
            'Given the small widget constraint, the final direction brings every required feature forward without making the interface feel busy. The final mockup also demonstrates how the extension sits within a real browsing context.',
          ],
          images: [
            {
              src: `${mediaRoot}/form-gpt/exploration.jpg`,
              alt: 'Form GPT extension shown within a browser page',
              caption: 'Extension in context',
            },
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
    model: 'Case study',
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
            'Design a series of mockups for a new blockchain-based donor hub: a donation tool with a prize mechanism. The client wanted a modern, clean interface for a tech-savvy audience and specifically called for glassy, blurred effects.',
          ],
        },
        {
          title: 'Existing design',
          body: ['The existing interface appeared dated and did not communicate the new product direction.'],
          images: [
            { src: `${mediaRoot}/donor-hub/old-design.png`, alt: 'Original Donor Hub website design', caption: 'Original design' },
          ],
        },
        {
          title: 'Initial drafts',
          body: [
            'The visual direction began in dark mode because it supported the requested glass treatment and felt appropriate for a modern, tech-oriented audience. A quick logo direction was explored alongside the redesign to capture the purpose of the product.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/donor-hub/first-sketch.png`, alt: 'First Donor Hub layout sketch', caption: 'First layout sketch' },
            { src: `${mediaRoot}/donor-hub/draft-how-to.jpg`, alt: 'Donor Hub how-to page draft', caption: 'How-to draft' },
            { src: `${mediaRoot}/donor-hub/draft-transaction.jpg`, alt: 'Donor Hub transaction interface draft', caption: 'Transaction draft' },
            { src: `${mediaRoot}/donor-hub/draft-faq.jpg`, alt: 'Donor Hub frequently asked questions draft', caption: 'FAQ draft' },
            {
              src: `${mediaRoot}/donor-hub/exploration.jpg`,
              alt: 'Donor Hub interface and identity exploration',
              caption: 'Working design direction',
            },
          ],
        },
        {
          title: 'Final design system',
          body: [
            'Responsive table behaviour required careful data prioritisation, while the transaction popup needed to make it clear that a transfer was actively taking place. The client also requested complete dark and light versions of the website.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/donor-hub/overview-dark.jpg`, alt: 'Donor Hub dark theme homepage overview', caption: 'Dark theme overview' },
            { src: `${mediaRoot}/donor-hub/overview-light.jpg`, alt: 'Donor Hub light theme homepage overview', caption: 'Light theme overview' },
          ],
        },
        {
          title: 'Dark mode',
          images: [
            {
              src: `${mediaRoot}/donor-hub/dark.jpg`,
              alt: 'Final Donor Hub dark-mode homepage',
              caption: 'Homepage',
            },
            { src: `${mediaRoot}/donor-hub/dark-faq.jpg`, alt: 'Donor Hub dark-mode FAQ page', caption: 'FAQs' },
            { src: `${mediaRoot}/donor-hub/dark-how-to.jpg`, alt: 'Donor Hub dark-mode how-to page', caption: 'How to' },
            { src: `${mediaRoot}/donor-hub/dark-send.jpg`, alt: 'Donor Hub dark-mode send transaction page', caption: 'Send' },
            { src: `${mediaRoot}/donor-hub/dark-contact.jpg`, alt: 'Donor Hub dark-mode contact page', caption: 'Contact' },
            { src: `${mediaRoot}/donor-hub/dark-privacy.jpg`, alt: 'Donor Hub dark-mode privacy policy page', caption: 'Privacy policy' },
          ],
        },
        {
          title: 'Light mode',
          images: [
            {
              src: `${mediaRoot}/donor-hub/light.jpg`,
              alt: 'Final Donor Hub light-mode homepage',
              caption: 'Homepage',
            },
            { src: `${mediaRoot}/donor-hub/light-faq.jpg`, alt: 'Donor Hub light-mode FAQ page', caption: 'FAQs' },
            { src: `${mediaRoot}/donor-hub/light-how-to.jpg`, alt: 'Donor Hub light-mode how-to page', caption: 'How to' },
            { src: `${mediaRoot}/donor-hub/light-send.jpg`, alt: 'Donor Hub light-mode send transaction page', caption: 'Send' },
            { src: `${mediaRoot}/donor-hub/light-contact.jpg`, alt: 'Donor Hub light-mode contact page', caption: 'Contact' },
            { src: `${mediaRoot}/donor-hub/light-privacy.jpg`, alt: 'Donor Hub light-mode privacy policy page', caption: 'Privacy policy' },
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
    model: 'Case study',
    sortOrder: 60,
    story:
      'Helped an indie developer define the information architecture and interface language for a logic game played by programming a malfunctioning AI.',
    screenshots: [`${mediaRoot}/alice-puzzle/final.png`],
    caseStudy: {
      tags: ['UI', 'UX', 'IA'],
      sections: [
        {
          title: 'Client brief',
          body: [
            'Help an indie game developer conceptualise and establish a visual direction for a logic puzzle. The player is a malfunctioning AI that wants to kill its master, Alice, and plays by making executable sentences from a small pool of words such as AI, Alice, kill, make, and money.',
            'Every level introduces laws the AI must respect. A direct command might work initially, but a law such as “You must not kill humans” forces the player to construct an indirect solution from the same limited vocabulary.',
          ],
        },
        {
          title: 'Interface requirements',
          body: ['The entire game takes place on one static screen containing four functional areas.'],
          bullets: [
            'An in-game view visualising the game world.',
            'A list of laws the AI must respect.',
            'An achievements area.',
            'The available words and the sentence currently being built.',
          ],
        },
        {
          title: 'Initial drafts and explorations',
          body: [
            'Realistic dummy data helped refine the dense single-screen interface. The visual explorations combined AI, technology, retro-computing, and terminal cues while testing different relationships between the game viewport, laws, achievements, commands, and menu controls.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/alice-puzzle/mainframe-1.jpg`, alt: 'Alice puzzle mainframe interface exploration one', caption: 'Mainframe exploration 1' },
            { src: `${mediaRoot}/alice-puzzle/mainframe-2.jpg`, alt: 'Alice puzzle mainframe interface exploration two', caption: 'Mainframe exploration 2' },
            { src: `${mediaRoot}/alice-puzzle/mainframe-3.jpg`, alt: 'Alice puzzle mainframe interface exploration three', caption: 'Mainframe exploration 3' },
            { src: `${mediaRoot}/alice-puzzle/mainframe-4.jpg`, alt: 'Alice puzzle mainframe interface exploration four', caption: 'Mainframe exploration 4' },
            { src: `${mediaRoot}/alice-puzzle/mainframe-draft.jpg`, alt: 'Alice puzzle full mainframe draft', caption: 'Mainframe draft' },
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The final direction includes the main game screen, side panels for objectives and settings, an alternative approach to viewing menu options, and a reusable style guide for the interface.',
          ],
          images: [
            {
              src: `${mediaRoot}/alice-puzzle/draft-v2.jpg`,
              alt: 'Alice puzzle AI interface draft',
              caption: 'Interface',
            },
            {
              src: `${mediaRoot}/alice-puzzle/draft-panel.jpg`,
              alt: 'Alice puzzle same-panel menu option',
              caption: 'Same-panel menu',
            },
            {
              src: `${mediaRoot}/alice-puzzle/draft-dialog.jpg`,
              alt: 'Alice puzzle dialog menu option',
              caption: 'Dialog menu',
            },
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
    model: 'Case study',
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
          title: 'Client brief',
          body: [
            'Redesign the paywall for the Vocal Email web app and Chrome extension. The product makes it easy to send voice notes through email, and the new flow needed to replace Free, Pro, and Business tiers with a single paid Pro plan.',
          ],
        },
        {
          title: 'Constraints',
          bullets: [
            'Design the paywall for both mobile and desktop layouts.',
            'Include the complete flow from entering payment information through success and error feedback.',
            'Follow the existing theme of the application.',
            'Use as few clicks as possible to support conversion.',
            'Sell the core benefits: unlimited messages and unlimited recording length.',
            'Remove the free trial and offer monthly and annual billing only.',
          ],
        },
        {
          title: 'Old design and inspiration',
          body: [
            'The client supplied the existing mobile and desktop paywalls along with a moodboard to ground the redesign in the current product language.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/vocal-email/old-paywall-1.png`, alt: 'Original Vocal Email paywall design', caption: 'Old paywall 1' },
            { src: `${mediaRoot}/vocal-email/old-paywall-2.png`, alt: 'Original Vocal Email paywall design', caption: 'Old paywall 2' },
            {
              src: `${mediaRoot}/vocal-email/moodboard.png`,
              alt: 'Vocal Email old designs and visual references',
              caption: 'Inspiration moodboard',
            },
          ],
        },
        {
          title: 'Mobile flow',
          body: [
            'The mobile sequence covers the default paywall, expanded benefits, payment entry, inline validation, processing, success, and a recoverable payment failure.',
          ],
          imageLayout: 'masonry',
          images: [
            { src: `${mediaRoot}/vocal-email/mobile-default.jpg`, alt: 'Vocal Email default mobile paywall', caption: 'Default modal' },
            { src: `${mediaRoot}/vocal-email/mobile-more-features.jpg`, alt: 'Vocal Email expanded mobile benefits', caption: 'More features' },
            { src: `${mediaRoot}/vocal-email/mobile-filled.jpg`, alt: 'Vocal Email mobile card details form', caption: 'Card details' },
            { src: `${mediaRoot}/vocal-email/mobile-inline-error.jpg`, alt: 'Vocal Email mobile inline payment error', caption: 'Inline error' },
            { src: `${mediaRoot}/vocal-email/mobile-processing.jpg`, alt: 'Vocal Email mobile payment processing state', caption: 'Processing' },
            { src: `${mediaRoot}/vocal-email/mobile-success.jpg`, alt: 'Vocal Email mobile successful payment state', caption: 'Success' },
            { src: `${mediaRoot}/vocal-email/mobile-fail.jpg`, alt: 'Vocal Email mobile failed payment state', caption: 'Payment error' },
          ],
        },
        {
          title: 'Desktop flow',
          body: [
            'The desktop popover uses the same hierarchy and carries the checkout through every entry, validation, processing, failure, and success state.',
          ],
          imageLayout: 'masonry',
          images: [
            {
              src: `${mediaRoot}/vocal-email/desktop.jpg`,
              alt: 'Final Vocal Email desktop paywall',
              caption: 'Default popover',
            },
            { src: `${mediaRoot}/vocal-email/desktop-filled.jpg`, alt: 'Vocal Email desktop card details form', caption: 'Card details' },
            { src: `${mediaRoot}/vocal-email/desktop-inline-error.jpg`, alt: 'Vocal Email desktop inline payment error', caption: 'Inline error' },
            { src: `${mediaRoot}/vocal-email/desktop-processing.jpg`, alt: 'Vocal Email desktop payment processing state', caption: 'Processing' },
            { src: `${mediaRoot}/vocal-email/desktop-fail.jpg`, alt: 'Vocal Email desktop failed payment state', caption: 'Payment error' },
            {
              src: `${mediaRoot}/vocal-email/success.jpg`,
              alt: 'Vocal Email successful payment state',
              caption: 'Success',
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
    model: 'Case study',
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
          imageLayout: 'masonry',
          images: [
            {
              src: `${mediaRoot}/seogaeilge/before.png`,
              alt: 'Original SeoGaeilge homepage',
              caption: 'Original website',
            },
            {
              src: `${mediaRoot}/seogaeilge/resource-key.png`,
              alt: 'Original SeoGaeilge resource key and navigation detail',
              caption: 'Original resource key',
            },
          ],
        },
        {
          title: 'Design rationale',
          body: [
            'The information architecture became the centre of the redesign: navigation was simplified, and repeatable content templates were introduced so visitors could quickly recognise the pattern and purpose of each resource.',
          ],
        },
        {
          title: 'Final designs',
          body: [
            'The homepage uses descriptive tags to give visitors a quick sense of the available content. A reusable category-page template then presents the different learning resources consistently.',
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
