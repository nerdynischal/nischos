import type { Project, ProjectCaseStudy } from './types'
import { legacyProjectSummaries } from './legacyProjectSummaries'

const mediaRoot = '/project-media/legacy'

const caseStudies: Record<string, ProjectCaseStudy> = {
  'auto-gmail': {
    coverAlt: 'Auto Gmail promotion shows an email reply being drafted automatically, paired with its orange envelope robot icon.',
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
            alt: 'Grid of Auto Gmail identity experiments combining envelopes, robot faces and lettermarks in different colours and shapes.',
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
            alt: 'Auto Gmail icon combining an orange robot face with an envelope and a sheet of email text.',
            caption: 'Product icon',
            displaySize: 'compact',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-small.jpg`,
            alt: 'Store tile pairing the orange envelope robot with the Auto Gmail wordmark on a circuit-board background.',
            caption: 'Small promotional tile',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-marquee.jpg`,
            alt: 'Wide store banner pairing the envelope robot with the Auto Gmail name and the tagline ChatGPT for Email Inbox.',
            caption: 'Store carousel marquee',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-1.jpg`,
            alt: 'Connect your Inbox: a Gmail icon points to Auto Gmail above the Connect with Auto Gmail button.',
            caption: 'Promotional image 1',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-2.jpg`,
            alt: 'Train the AI: the assistant learns from previously sent emails, with a panel for adding drafting context.',
            caption: 'Promotional image 2',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-3.jpg`,
            alt: 'Auto Gmail learns to draft responses on your behalf, illustrated by an email reply being composed.',
            caption: 'Promotional image 3',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-4.jpg`,
            alt: 'Auto Drafts: replies are prepared for unopened emails in the background, with updates every 15 minutes.',
            caption: 'Promotional image 4',
          },
          {
            src: `${mediaRoot}/auto-gmail/promo-5.jpg`,
            alt: 'Review, edit if needed, and send: the user checks an automatically drafted reply before sending it.',
            caption: 'Promotional image 5',
          },
        ],
      },
    ],
  },
  'ravageous': {
    coverAlt: 'Ravageous landing-page introduction pairs game characters with prominent platform download links.',
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
          { src: `${mediaRoot}/ravageous/old-home.jpg`, alt: 'Original game page mixes a character banner, long introductory copy, gameplay images and download information.', caption: 'Old landing page' },
          { src: `${mediaRoot}/ravageous/old-android.jpg`, alt: 'Separate Android download page with installation text and phone screenshots, illustrating the fragmented original journey.', caption: 'Android instructions' },
          { src: `${mediaRoot}/ravageous/old-linux.jpg`, alt: 'Separate Linux download page with installation commands, desktop screenshots and a package-contents table.', caption: 'Linux instructions' },
          { src: `${mediaRoot}/ravageous/old-windows.jpg`, alt: 'Separate Windows download page dominated by installation text, a package-contents table and a warning notice.', caption: 'Windows instructions' },
          { src: `${mediaRoot}/ravageous/old-contact.jpg`, alt: 'Original contact page with a long introduction above name, email and message fields.', caption: 'Old contact page' },
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
            alt: 'Consolidated Ravageous landing page with prominent platform downloads, colourful game sections, installation information and newsletter signup.',
            caption: 'Final single-page experience',
          },
        ],
      },
    ],
  },
  'freeguides': {
    coverAlt: 'FreeGuides hero pairs the message Monetize your knowledge with a phone displaying self-guided tours.',
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
          { src: `${mediaRoot}/freeguides/value-propositions.png`, alt: 'Annotated research asks what hotel and hostel operators gain, highlighting trust, benefit, value, reliability, security and convenience.', caption: 'Value propositions' },
          { src: `${mediaRoot}/freeguides/copy-analysis.png`, alt: 'Hotel and hostel copy compared side by side, with notes distinguishing benefits for guests from benefits for accommodation providers.', caption: 'Copy analysis' },
          { src: `${mediaRoot}/freeguides/competitor-1.png`, alt: 'Competitor reference board comparing landing-page structures, pricing sections and product demonstrations to inform the FreeGuides page.', caption: 'Competitor analysis 1' },
          { src: `${mediaRoot}/freeguides/competitor-2.png`, alt: 'Annotated reference details highlight FAQs, customer logos, product screenshots and a map-based tour example as ways to explain value.', caption: 'Competitor analysis 2' },
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
            alt: 'Hostel landing page leads with monetising local knowledge, followed by tour examples, product benefits, pricing and demo calls to action.',
            caption: 'Hostel page — focused on revenue opportunities',
          },
          {
            src: `${mediaRoot}/freeguides/hotel.jpg`,
            alt: 'Hotel landing page leads with enriching the guest experience, followed by tour examples, product benefits, pricing and demo calls to action.',
            caption: 'Hotel page — focused on the guest experience',
          },
        ],
      },
    ],
  },
  'form-gpt': {
    coverAlt: 'Compact browser-extension settings group trigger mode, AI provider and API-key controls.',
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
          { src: `${mediaRoot}/form-gpt/client-sketch.png`, alt: 'Annotated extension sketch groups trigger-mode radio buttons above AI-provider tabs and an API-key field.', caption: 'Client sketch' },
          { src: `${mediaRoot}/form-gpt/inspiration-1.png`, alt: 'Compact hydration-reminder extension used as a reference for fitting a few clear actions inside a browser popup.', caption: 'Inspiration 1' },
          { src: `${mediaRoot}/form-gpt/inspiration-2.png`, alt: 'App-switcher reference uses rows of icons, names and secondary details to organise a compact menu.', caption: 'Inspiration 2' },
        ],
      },
      {
        title: 'Initial drafts',
        body: [
          'The early drafts translated the sketch into a base interface that could be evaluated and refined, testing several arrangements for the same core controls.',
        ],
        imageLayout: 'masonry',
        images: [
          { src: `${mediaRoot}/form-gpt/draft-1.jpg`, alt: 'First extension draft uses a purple header, trigger-mode choices, provider tabs and a full-width Save button.', caption: 'Draft 1' },
          { src: `${mediaRoot}/form-gpt/draft-2.jpg`, alt: 'Second extension draft tests a black header and Save button while retaining the trigger and provider groups.', caption: 'Draft 2' },
          { src: `${mediaRoot}/form-gpt/draft-3.jpg`, alt: 'Third extension draft uses a white header, purple accents and an Active now indicator below the form.', caption: 'Draft 3' },
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
            alt: 'Extension popup over a browser page demonstrates how trigger settings and AI-provider controls fit within the browsing workflow.',
            caption: 'Extension in context',
          },
          {
            src: `${mediaRoot}/form-gpt/final.jpg`,
            alt: 'Final extension groups trigger choices and provider options with icons, supports a custom trigger character, and places Save beside the API-key field.',
            caption: 'Final compact extension UI',
          },
        ],
      },
    ],
  },
  'donor-hub': {
    coverAlt: 'Donor Hub homepage introduces Donate and earn with a coin illustration and donation progress indicator.',
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
          { src: `${mediaRoot}/donor-hub/old-design.png`, alt: 'Original participation dialog uses white text and a bright pink Connect Wallet button over a blurred red homepage.', caption: 'Original design' },
        ],
      },
      {
        title: 'Initial drafts',
        body: [
          'The visual direction began in dark mode because it supported the requested glass treatment and felt appropriate for a modern, tech-oriented audience. A quick logo direction was explored alongside the redesign to capture the purpose of the product.',
        ],
        imageLayout: 'masonry',
        images: [
          { src: `${mediaRoot}/donor-hub/first-sketch.png`, alt: 'Early homepage layout places a Donate and earn introduction above pool progress, transaction rows and charity cards.', caption: 'First layout sketch' },
          { src: `${mediaRoot}/donor-hub/draft-how-to.jpg`, alt: 'Participation instructions appear in a centred overlay with a Connect your wallet action, keeping the homepage behind it.', caption: 'How-to draft' },
          { src: `${mediaRoot}/donor-hub/draft-transaction.jpg`, alt: 'Transaction draft places the recipient address, ETH amount and Send action in a modal over the homepage.', caption: 'Transaction draft' },
          { src: `${mediaRoot}/donor-hub/draft-faq.jpg`, alt: 'FAQ draft places expandable questions in an overlay rather than a separate page.', caption: 'FAQ draft' },
          {
            src: `${mediaRoot}/donor-hub/exploration.jpg`,
            alt: 'Homepage exploration adds a coin illustration and green accents to the donation introduction, progress bar and charity cards.',
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
          { src: `${mediaRoot}/donor-hub/overview-dark.jpg`, alt: 'Dark homepage overview uses green actions and progress indicators above transaction data and charity cards.', caption: 'Dark theme overview' },
          { src: `${mediaRoot}/donor-hub/overview-light.jpg`, alt: 'Light homepage overview preserves the donation, transaction and charity-card hierarchy on a pale background.', caption: 'Light theme overview' },
        ],
      },
      {
        title: 'Dark mode',
        images: [
          {
            src: `${mediaRoot}/donor-hub/dark.jpg`,
            alt: 'Donor Hub dark theme: homepage places donation progress and a transaction table above charity cards.',
            caption: 'Homepage',
          },
          { src: `${mediaRoot}/donor-hub/dark-faq.jpg`, alt: 'Donor Hub dark theme: FAQ page uses expandable questions, with one answer open.', caption: 'FAQs' },
          { src: `${mediaRoot}/donor-hub/dark-how-to.jpg`, alt: 'Donor Hub dark theme: participation dialog explains the donation process and offers Connect your wallet.', caption: 'How to' },
          { src: `${mediaRoot}/donor-hub/dark-send.jpg`, alt: 'Donor Hub dark theme: transaction dialog shows the recipient address, editable ETH amount, Send action and connected wallet details.', caption: 'Send' },
          { src: `${mediaRoot}/donor-hub/dark-contact.jpg`, alt: 'Donor Hub dark theme: contact page provides name, email and message fields with a Send button.', caption: 'Contact' },
          { src: `${mediaRoot}/donor-hub/dark-privacy.jpg`, alt: 'Donor Hub dark theme: privacy page demonstrates the layout for long policy text under clear section headings.', caption: 'Privacy policy' },
        ],
      },
      {
        title: 'Light mode',
        images: [
          {
            src: `${mediaRoot}/donor-hub/light.jpg`,
            alt: 'Donor Hub light theme: homepage places donation progress and a transaction table above charity cards.',
            caption: 'Homepage',
          },
          { src: `${mediaRoot}/donor-hub/light-faq.jpg`, alt: 'Donor Hub light theme: FAQ page uses expandable questions, with one answer open.', caption: 'FAQs' },
          { src: `${mediaRoot}/donor-hub/light-how-to.jpg`, alt: 'Donor Hub light theme: participation dialog explains the donation process and offers Connect your wallet.', caption: 'How to' },
          { src: `${mediaRoot}/donor-hub/light-send.jpg`, alt: 'Donor Hub light theme: transaction dialog shows the recipient address, editable ETH amount, Send action and connected wallet details.', caption: 'Send' },
          { src: `${mediaRoot}/donor-hub/light-contact.jpg`, alt: 'Donor Hub light theme: contact page provides name, email and message fields with a Send button.', caption: 'Contact' },
          { src: `${mediaRoot}/donor-hub/light-privacy.jpg`, alt: 'Donor Hub light theme: privacy page demonstrates the layout for long policy text under clear section headings.', caption: 'Privacy policy' },
        ],
      },
    ],
  },
  'alice-puzzle': {
    coverAlt: 'Green terminal-style puzzle interface arranges laws, word-based commands and achievements around a central game viewport.',
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
          { src: `${mediaRoot}/alice-puzzle/mainframe-1.jpg`, alt: 'Early visual experiment uses a glowing rounded terminal frame on a dark background before adding game controls.', caption: 'Mainframe exploration 1' },
          { src: `${mediaRoot}/alice-puzzle/mainframe-2.jpg`, alt: 'Bright green wireframe divides the game into a wide central viewport with stacked panels on both sides.', caption: 'Mainframe exploration 2' },
          { src: `${mediaRoot}/alice-puzzle/mainframe-3.jpg`, alt: 'Dark version of the wireframe uses thin green borders to separate the central viewport and side panels.', caption: 'Mainframe exploration 3' },
          { src: `${mediaRoot}/alice-puzzle/mainframe-4.jpg`, alt: 'Populated terminal layout places objective and laws on the left, the game viewport in the centre, and progress on the right.', caption: 'Mainframe exploration 4' },
          { src: `${mediaRoot}/alice-puzzle/mainframe-draft.jpg`, alt: 'Game draft adds a working sentence and word buttons beneath the viewport, with laws on the left and achievements on the right.', caption: 'Mainframe draft' },
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
            alt: 'Green terminal interface combines laws, a central game viewport, word-based command building, progress objectives and Easter egg achievements.',
            caption: 'Interface',
          },
          {
            src: `${mediaRoot}/alice-puzzle/draft-panel.jpg`,
            alt: 'Menu alternative replaces the left laws panel with menu content while keeping the game and commands visible.',
            caption: 'Same-panel menu',
          },
          {
            src: `${mediaRoot}/alice-puzzle/draft-dialog.jpg`,
            alt: 'Menu alternative opens a large centred dialog over the dimmed game, providing more room for longer menu content.',
            caption: 'Dialog menu',
          },
          {
            src: `${mediaRoot}/alice-puzzle/final.png`,
            alt: 'Style guide collects game components, achievement icons, green and dark colour swatches, and Bebas Neue and Orbitron type samples.',
            caption: 'Final game interface direction',
          },
        ],
      },
    ],
  },
  'vocal-email': {
    coverAlt: 'Vocal Pro upgrade places unlimited-recording benefits beside plan choices and payment fields.',
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
          { src: `${mediaRoot}/vocal-email/old-paywall-1.png`, alt: 'Reference board of existing Vocal screens includes recording interfaces, three-tier pricing comparisons and upgrade popups.', caption: 'Old paywall 1' },
          { src: `${mediaRoot}/vocal-email/old-paywall-2.png`, alt: 'Overview of the original mobile and desktop payment screens maps the many checkout, error and confirmation states.', caption: 'Old paywall 2' },
          {
            src: `${mediaRoot}/vocal-email/moodboard.png`,
            alt: 'Moodboard compares subscription screens with benefit lists, plan choices and prominent upgrade actions.',
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
          { src: `${mediaRoot}/vocal-email/mobile-default.jpg`, alt: 'Mobile Pro upgrade stacks unlimited-recording benefits, monthly and annual plan choices, and card fields in one modal.', caption: 'Default modal' },
          { src: `${mediaRoot}/vocal-email/mobile-more-features.jpg`, alt: 'Expanded mobile upgrade reveals the full benefits list above the plan choices and card fields.', caption: 'More features' },
          { src: `${mediaRoot}/vocal-email/mobile-filled.jpg`, alt: 'Mobile checkout with card details entered and the Subscribe button enabled.', caption: 'Card details' },
          { src: `${mediaRoot}/vocal-email/mobile-inline-error.jpg`, alt: 'Mobile checkout highlights invalid card details with a pink field border and keeps Subscribe disabled.', caption: 'Inline error' },
          { src: `${mediaRoot}/vocal-email/mobile-processing.jpg`, alt: 'Mobile checkout changes the payment button to Processing while the transaction is underway.', caption: 'Processing' },
          { src: `${mediaRoot}/vocal-email/mobile-success.jpg`, alt: 'Mobile payment confirmation announces the Pro upgrade, lists unlocked benefits and offers Start recording.', caption: 'Success' },
          { src: `${mediaRoot}/vocal-email/mobile-fail.jpg`, alt: 'Mobile payment failure explains that payment could not be processed and offers a link to complete payment through Stripe.', caption: 'Payment error' },
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
            alt: 'Desktop Pro upgrade places unlimited-recording benefits beside monthly and annual plan choices and card-entry fields.',
            caption: 'Default popover',
          },
          { src: `${mediaRoot}/vocal-email/desktop-filled.jpg`, alt: 'Desktop checkout with card details entered and the Subscribe button enabled.', caption: 'Card details' },
          { src: `${mediaRoot}/vocal-email/desktop-inline-error.jpg`, alt: 'Desktop checkout highlights invalid card details with a pink field border and keeps Subscribe disabled.', caption: 'Inline error' },
          { src: `${mediaRoot}/vocal-email/desktop-processing.jpg`, alt: 'Desktop checkout changes the payment button to Processing while the transaction is underway.', caption: 'Processing' },
          { src: `${mediaRoot}/vocal-email/desktop-fail.jpg`, alt: 'Desktop payment failure explains that payment could not be processed and links to Stripe to complete payment.', caption: 'Payment error' },
          {
            src: `${mediaRoot}/vocal-email/success.jpg`,
            alt: 'Desktop payment confirmation announces the Pro upgrade, lists unlocked benefits in two columns and offers Start recording.',
            caption: 'Success',
          },
        ],
      },
    ],
  },
  'seogaeilge': {
    coverAlt: 'SeoGaeilge resource page uses a category sidebar and repeatable cards with descriptions and preview images.',
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
            alt: 'Original homepage presents Irish-learning categories as large image tiles, with the resource suggestion action at the bottom.',
            caption: 'Original website',
          },
          {
            src: `${mediaRoot}/seogaeilge/resource-key.png`,
            alt: 'Original resource legend requires readers to decode L for learner, F for fluent and ! for non-native content that may contain errors.',
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
            alt: 'Redesigned resource directory puts categories in a persistent left sidebar and groups links with descriptive tags in repeatable sections.',
            caption: 'All-resources page',
          },
          {
            src: `${mediaRoot}/seogaeilge/audio.jpg`,
            alt: 'Category-page template keeps the left navigation and presents each resource with a description, tags, a visit action and a preview image.',
            caption: 'Category-page template',
          },
        ],
      },
    ],
  },
}

export const legacyProjects: Project[] = legacyProjectSummaries.map((project) => ({
  ...project,
  caseStudy: caseStudies[project.id],
}))
