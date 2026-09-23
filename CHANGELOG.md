# Changelog

## 23 September 2026

### Accessibility

- Reviewed 12 project screenshots, 78 archive case-study images and eight zoomable covers. Replaced filename-derived and generic alternatives with authored descriptions; remote originals, mirrors and reordered lists retain asset-specific descriptions. Zoom controls expose the descriptions and decorative images remain hidden.
- Aligned the unlock name with its visible wording and standardised About naming across launchers, window titles and controls. Corrected navigation landmarks and unnecessary generic ARIA labels; contact link names include the visible value.
- Added a desktop orientation heading and a focus-visible skip link to the active window, with a shortcut fallback when no window is open. Preserved content heading hierarchy and targeted status feedback rather than a whole-window live region.

### Documentation and validation

- Consolidated the accessibility checklist and the image/structure follow-up reports into [Accessibility: status and verification](docs/accessibility.md). Preserved the original audit as historical evidence and updated setup, media, content-authoring and token documentation.
- The latest code validation passed `npm run check`: 154 tests across 37 files, project and token checks, lint, TypeScript and production build. Browser keyboard and accessibility-tree checks verified unlock wording, skip-link focus, About navigation and desktop/mobile Tools headings.
- Real screen-reader speech, speech recognition, native zoom, broader browser/preference checks and deployment verification remain outstanding. Documentation consolidation adds no new browser or conformance evidence.

## 21 September 2026

### Added

- A06: Added accessible window movement and resizing through a compact More popover, replacing the rejected inline Arrange panel. Controls overlay content, use labelled Lucide icons and separated full-width rows, and support individual clicks and keyboard activation.
- Added 1/4/8/16/32px increments with an 8px default, workspace bounds and size limits, native-resize interoperability, focus handling, and subtle position/size status feedback.

### Documentation and validation

- Updated the accessibility audit and to-do list to mark A06 implemented, with manual keyboard, screen-reader, and cross-browser verification still outstanding.
- `npm run check` passed: 145 tests across 35 files, project manifests, CSS tokens, lint, TypeScript, and the production build. Focused window coverage includes bounds, precise adjustments, native resizing, opening focus, and dismissal.

## 18 September 2026

### Fixed

- Fixed mobile About and Notes navigation shifting or clipping the view by preventing automatic scrolling during focus changes. About details reset to the top when opened, and mobile grid columns can shrink to fit the window.
- Retained the 360 ms forward/back slide animations and reduced-motion support. Animation transforms are released after entry instead of remaining on scrollable panes.

### Changed

- Restored the compact “Copied” toast for contact copying. It stays visible for five seconds and restarts on repeated copies, while a separate persistent live region announces the result to assistive technology.
- Retained visible error feedback, the manual-copy fallback, duplicate-request protection, focus retention, and reduced-motion support.

### Documentation and validation

- After restoring mobile slides with the focus and sizing fixes retained, `npm run check` passed: 130 tests across 34 files, project manifests, CSS tokens, lint, TypeScript, and the production build. Regression coverage checks focus without automatic scrolling and the About detail scroll reset.
- Deployed the restored slides successfully to GitHub Pages; the user confirmed the mobile behavior now appears correct after the earlier Android animation glitches and iOS clipping.
- Updated the A07 audit record and added an accessibility to-do list covering A06 and the remaining verification work.
- `npm run check` passed: 130 tests across 34 files, project manifests, CSS tokens, lint, TypeScript, and the production build. Added coverage for toast timing, repeated-copy timer reset, retained announcements, and focus.
- Verified the restored toast in wide and narrow browser fixtures using a simulated clipboard. Actual screen-reader speech testing remains outstanding.

## 17 September 2026

### Fixed

- A01: Move keyboard focus into newly opened or explicitly activated windows, restore focus when they close, and prevent focus entering covered mobile windows and desktop shortcuts.
- A02: Raise dark tertiary-text contrast while preserving decorative icon brightness and existing layouts. Compensate for inactive-window dimming, and apply a narrowly scoped contrast correction to inactive light-theme Notes “Pinned” labels.
- A03: Use a native modal dialog for case-study images, with background interaction blocked, Escape dismissal, scroll locking, and focus restoration.
- A04: Show complete contact values with wrapping and pane-width-based stacked layouts instead of ellipses, including enlarged text and text-spacing overrides.
- A05: Allow short lock screens to scroll, keep the unlock control reachable, and wrap enlarged clock text without horizontal overflow.
- A07: Expose persistent copy success/failure status and a selectable manual-copy fallback; prevent duplicate requests while copying.
- A08: Keep dock tooltips visible across the hover gap and over their text; allow Escape dismissal without moving focus.

### Documentation and validation

- Added the accessibility audit and contrast screenshots under `docs/`. A06 remains open: the proposed Arrange controls were reverted, retaining the existing window interactions.
- `npm run check` passed: 129 tests across 34 files, project manifests, CSS tokens, lint, TypeScript, and the production build.
- Browser checks covered keyboard focus, modal behavior, narrow layouts, enlarged text, contact feedback, tooltip interactions, and contrast. Checked dark metadata now measures at least 4.71:1; the scoped inactive light “Pinned” label measures 4.87:1.
- These changes do not establish WCAG conformance. Actual screen-reader speech, real browser zoom, cross-browser coverage, and a complete criterion-by-criterion evaluation remain outstanding.

## 15 September 2026

### Added

- Added a standalone nischOS-style `404.html` page for GitHub Pages, with a compact window, “Missing page” heading, and “Back to desktop” link. The trailing Lucide Undo 2 icon uses tighter spacing and a 2px upward optical adjustment.
- Included the 404 page in the Vite build with deployment-base-aware asset and home links. It uses existing theme preferences and works without loading React or portfolio data. Preview locally at `/404.html`; unknown URLs still use Vite’s development fallback.

### Changed

- Mobile Notes now uses the same 360 ms forward/back slides as mobile About. Shared navigation timing and easing tokens also keep the screenshot carousel consistent.
- Case-study image viewers enter with a 180 ms fade and subtle scale-in; contact copy confirmation transitions between copy and check icons over 160 ms. These effects respect reduced-motion preferences. Desktop About section changes remain instant.
- Mobile About sections enter from the right with a 360 ms eased slide; returning to the section list slides it in from the left. Initial opening stays still, reduced-motion preferences disable the animation, and existing focus restoration remains intact.
- App preview screenshots now slide in the navigation direction over 360 ms with a gentle ease-out. The active dot animates, and reduced-motion preferences disable the slide.
- Screenshot navigation stops at either end, with the corresponding arrow dimmed and disabled.

- Replaced window-opening and note-body spinners with tailored skeleton placeholders. Selected Work uses its toolbar and eight-file grid; case studies and app projects use separate layouts; About follows its portrait and section content; Notes follows its sidebar and reader spacing.
- Reused view layout styles and available metadata to preserve known text wrapping and responsive behavior. Unloaded body content uses estimated lines. Kept the 180 ms delay, accessible loading announcements, inert placeholder controls, theme colors, and reduced-motion support.
- Replaced mobile Notes tabs with a vertical note list and detail navigation matching About. Selected notes show their title in the window bar, centered folder/date metadata, and a circular sticky back arrow with a 44px touch target.
- Added roomier note rows and matching reader spacing. Back navigation restores focus to the selected list row; direct note selections still open the reader, and desktop retains its sidebar layout.
- Kept the empty Notes state visible when no posts are available.

### Optimised

- Preload only the next screenshot after its app preview mounts, using matching responsive image candidates. Keep the current screenshot visible until the selected image has decoded; no animation library was added.

- Defer rendering skeleton placeholder subtrees until the 180 ms loading delay expires, avoiding that work for fast loads.
- Use one CSS pulse animation per skeleton instead of animating individual blocks. Retained reduced-motion support and removed the unused spinner component, styles, and tests.
- Production CSS decreased from 86.24 kB to 85.56 kB (15.35 kB to 15.25 kB gzip); main JavaScript size remained unchanged. These are bundle measurements, not device-performance benchmarks.

### Release validation

- After the shared motion updates and removal of the desktop About fade, `npm run check` passed: all 105 tests across 29 files, project manifests, CSS tokens, lint, TypeScript, and the production build.
- After the mobile About animation, `npm run check` passed: all 105 tests across 29 files, project manifests, CSS tokens, lint, TypeScript, and the production build.
- After the carousel changes, `npm run check` passed: all 105 tests across 29 files, project manifests, CSS tokens, lint, TypeScript, and the production build.

- After the final 404 edits, `npm run check` passed: all 105 tests across 29 files, project manifests, CSS tokens, lint, TypeScript, and the production build.
- During 404 development, verified desktop and 320px mobile layouts, keyboard focus, and home navigation. Checked generated assets and home links under both `/` and `/nischos/`, including resolution from nested missing URLs.
- After the optimisation pass, `npm run check` passed: all 105 tests across 29 files, project manifests, CSS tokens, lint, TypeScript, and the production build. Added fast-load coverage verifying that the placeholder subtree never renders; updated window tests to exercise delayed mounting.
- After the skeleton changes, `npm run check` passed: all 107 tests across 30 files, project manifests, CSS tokens, lint, TypeScript, and the production build.
- Compared skeletons with loaded Selected Work, About, case-study, and Notes views in the browser, including dark/light themes and mobile layouts; checked note widths at 768px, 1024px, and 1440px.
- `npm run check` passed: all 101 tests across 28 files, project manifests, CSS tokens, lint, TypeScript, and the production build.
- Browser checks verified the mobile note list, reader, back navigation, title updates, and desktop sidebar/reader visibility.

## 14 September 2026

### Changed

- Added Selected Work between Notes and About in the dock. Mobile shows only these three destinations, with consistent icon sizing across smaller screens.
- Replaced mobile About tabs with a section list and detail navigation. Section titles appear in the window bar; centered subtitles sit beside a circular back arrow that stays available during scrolling. The profile portrait appears only on the main mobile list.
- Increased content-row vertical padding across screen sizes. Balanced the mobile section heading's spacing above and below, correcting a shared heading rule that overrode its bottom margin.

### Optimised

- Preload desktop artwork while the lock screen is visible, matching the desktop's responsive image candidates. Prioritise the profile avatar and load desktop icons at low priority; project screenshots remain deferred until needed.
- Serve nine remote screenshots across Keyform, Nisch's Toolkit, and Maneki Neko Catalog through local responsive WebP variants. Existing remote URLs map to checked-in originals without requiring Supabase image transformations.
- Added `npm run media:sync` to explicitly refresh remote raster images from project manifests. Normal builds remain offline; new or replaced remote images require a sync and redeployment.
- Across those nine screenshots, total image data fell from 672,209 bytes to 150,864 bytes at 640px (78% smaller), or 390,364 bytes for the largest variants (42% smaller).
- Compared live image downloads over three rounds per version (81 requests, no browser cache). Median per-image download time was 137 ms for originals, 122 ms for 640px variants, and 63 ms for the largest variants. Network and CDN latency affect these results; these are image-download measurements, not whole-page or controlled slow-mobile benchmarks.

### Fixed

- Enlarged the window close control's touch target while preserving the traffic-light appearance.
- Locked desktop scrolling while mobile windows are open, restoring the previous position when the last window closes or the viewport returns to desktop size.
- Load About → Tools icons eagerly when the section mounts, avoiding lazy-load visibility checks inside the scrollable window. This adds no Tools image requests to the initial page load. The user confirmed on Safari for Mac that the deployed icons now appear without refreshing; the underlying browser cause was not independently reproduced.

### Release validation

- After the mobile navigation, scroll-lock, and spacing changes, `npm run check` passed with all 100 tests across 27 files, plus manifest checks, CSS tokens, lint, TypeScript, and the production build.
- `npm run check` passed for both changes: project manifests, CSS tokens, lint, all 98 tests across 25 files, TypeScript, and the production build.
- Browser checks confirmed entry image preload hints, rendered desktop artwork, and an optimised Keyform screenshot with no recorded browser warnings or errors.
- GitHub Pages deployments succeeded for `6d7256f` (earlier loading and remote screenshots) and `fe24662` (About Tools icons).

## 10 September 2026

### Added

- Added compact window and note loading indicators after a 180 ms delay, with immediate removal when content arrives, accessible status text, and a static reduced-motion appearance.

### Optimised

- Split remote Notes loading into metadata and selected-body queries, with bounded caching, deduplicated requests, request timeouts, retry, local fallback, and protection against late responses after changing selection.
- Removed the unused 985,285-byte original folder icon after auditing runtime content and asset references; retained all referenced artwork and full-size zoom sources.
- Added a separate browser profiling harness and [documented three baseline/current comparisons](docs/performance-2026-09-10.md) using seven windows and 64 mounted images. Median measured React render time fell from 598.4 ms to 245.3 ms (59.0%), and median commits fell from 97 to 14 (85.6%). These development-mode measurements show reduced React work; frame intervals remained near 16.7 ms, with no observed frame-rate improvement.
- Added cached, reproducible WebP variants for local icons, project previews, and case-study images, with responsive selection and intrinsic dimensions. Full-size originals remain available in the image viewer.
- Reduced the entry progress delay from 1200 ms to 300 ms, began preparing the desktop during that interval, and removed entry delays for reduced-motion users.
- Applied remote content collections independently as they arrive.
- Deferred project, About, folder, and case-study readers until opened, separating archive metadata from the full case-study bodies.
- Updated drag positions once per animation frame without rerendering window content, committing state on release and using measured dimensions to keep resized windows in view.
- Added regression coverage for responsive asset paths, archive metadata, and drag batching, release, cancellation, and resized bounds.

### Release validation — 11 September 2026

- `npm run check` passed: project manifests, CSS tokens, lint, all 94 tests across 24 files, TypeScript, and the Vite production build.
- Production-browser smoke checks passed for unlocking, Selected Work, Auto Gmail, dragging, full-size image viewing, and remote Notes loading; no browser warnings or errors were recorded during those checks.
- Confirmed that all eight archived projects and case-study bodies match the previous release exactly. All 274 generated variants are referenced by the 97-source media manifest. The original drag benchmark and reproduction harness are unchanged by this release review.

## 9 September 2026

### Added

- Added a local Selected Work folder containing eight complete freelance case studies, dedicated folder artwork, and checked-in media for reliable offline and production rendering.
- Added a window-contained image viewer for case-study covers and gallery images, with keyboard access, focus restoration, scroll locking, backdrop dismissal, captions, and responsive touch controls.
- Restored the missing Auto Gmail initial product-icon explorations and added regression coverage for archive completeness, editorial image grouping, gallery configuration, and image zoom controls.

### Changed

- Increased individual project windows to a 960 × 820 default size with a wider responsive maximum while retaining viewport clamping.
- Replaced synchronized multi-column image grids with two-column masonry galleries, using consistent 24px horizontal and vertical spacing and a single-column mobile layout.
- Refined the Selected Work folder navigation and file previews, removed redundant freelance-archive labels, and kept archive projects out of the primary dock.
- Reorganized Form GPT and Alice Puzzle images into their intended final-design sections, simplified captions, and displayed the low-resolution Auto Gmail product icon at its native size.
- Refactored legacy case-study rendering into focused image-viewer and project-window components with dedicated styles and clearer masonry content metadata.

### Fixed

- Fixed inconsistent image-to-caption spacing caused by stretched gallery rows with mixed image aspect ratios.

## 8 September 2026

### Added

- Expanded the About window with Values, Hobbies, Tools, and Contact sections, each with matching navigation icons and consistent section headings and subtitles.
- Added a categorized toolkit covering main tools, tools being explored, a watchlist, and obsolete tools, with product artwork and dark-theme contrast treatments.
- Added full-row Contact actions for copying an email address and opening LinkedIn or GitHub in a new tab, including an inline copy-confirmation toast.
- Added local fallback content, Supabase seed data, and versioned migrations for every new About section.
- Added tests for settings-section merging, toolkit mapping, Contact links, and unsafe external URL handling.

### Changed

- Aligned the new About sections with the existing window layout, typography, spacing, responsive behaviour, and light and dark themes.
- Refactored the About window into focused sidebar, toolkit, and contact components while consolidating duplicate styles and shared mapping logic.
- Restricted data-driven external links to safe HTTP and HTTPS destinations before rendering them as interactive actions.

## 7 September 2026

### Added

- Added Workout Board to the desktop and dock with local icon and screenshot assets, project links, fallback metadata, and a Supabase migration.
- Added a menu-bar connection indicator that distinguishes successfully loaded Supabase content from local fallback data, using Lucide's `DatabaseCheck` and `DatabaseX` icons with accessible status text.
- Added explicit `sort_order` and nullable `dock_order` project fields so Supabase controls desktop and dock placement without relying on array positions.
- Added one automatically discovered JSON manifest per fallback project, a JSON Schema, and a deployment-blocking validator for metadata, ordering, URLs, local media, and dock capacity.
- Added `npm run project:add`, which can inspect a local project folder, suggest metadata and ordering, copy selected artwork, and generate both a fallback manifest and an idempotent Supabase migration.
- Added tests for project ordering, manifest-backed content, Supabase mapping and loading status, system icon rendering, and project generation.

### Changed

- Standardized interface icons on Lucide across the menu bar, project actions, Notes, window controls, theme controls, and fallback states.
- Made Supabase project values authoritative when a matching remote record is available, while retaining checked-in manifests as reliable offline and deployment fallbacks.
- Refactored project rendering and dock construction around shared, data-driven ordering helpers and a single project content model.
- Expanded the standard project check to validate manifests before linting, tests, type-checking, and the production build.

### Fixed

- Corrected production Supabase configuration to accept the existing `ANON_KEY` deployment variable.
- Fixed stale fallback metadata overriding Supabase project type and description values on the live site.

## 27 August 2026

### Added

- Added a GitHub Pages workflow that installs dependencies, runs the complete production check, derives the correct repository base path, and deploys the built site.
- Published nischOS from the new `nerdynischal/nischos` repository with GitHub Pages and production Supabase configuration.
- Added a top-level error boundary with an accessible recovery screen if the desktop cannot render.
- Added deployment documentation, runtime version requirements, social metadata, and tests for base-path-aware asset URLs.
- Added an archive of legacy Supabase content fields and an idempotent migration for removing their obsolete columns.
- Added an archive and migration for removing unused Notes filename, cover-tone, and paragraph-array fields after consolidating note bodies on Markdown.

### Changed

- Renamed the portfolio from nischalOS to nischOS across the interface, metadata, content, persistence keys, and deployment-facing project identity.
- Moved the Supabase client into an on-demand chunk so it no longer increases the initial lock-screen bundle when remote content is not needed.
- Limited project reads to the fields used by the application instead of transferring legacy database columns.
- Simplified the Notes content model, database types, queries, tests, seed data, and documentation around `content_markdown` as the single body format.
- Made local artwork and screenshots work from GitHub Pages project subpaths, corrected the Maneki Neko fallback media URLs, and added graceful screenshot fallbacks.
- Replaced the oversized Still PNG preview with a resized WebP asset to reduce its transfer size without a visible loss of detail.
- Improved Notes heading hierarchy, semantic dates, image decoding, and unavailable project-action semantics.

### Removed

- Removed the unused `description`, `icon_label`, and `stack` columns from `projects` after archiving their previous values.
- Removed the unused `cover_image`, `excerpt`, `size`, `filename`, `cover_tone`, and paragraph-array `content` columns from `blog_posts`, leaving Markdown as the single note-body format.

## 25 August 2026

### Added

- Added Still to the projects collection with dedicated icon and preview artwork, responsive presentation, pinned-project support, and Supabase schema, migration, seed, and fallback content updates.
- Added a pinned welcome note with local fallback content and Supabase support for pinning notes.
- Added external-link icons to the “Visit Website” and “Source Code” project actions.
- Added a GitHub profile link and copyright footer to the About window.

### Changed

- Renamed Blog to Notes across the desktop, window chrome, content model, documentation, styling, tests, and database-facing code, with new Notes app artwork.
- Restored project `type` metadata across local content and Supabase while keeping project selection and display behaviour consistent.
- Updated the About window to use the portrait artwork and refined its avatar framing, spacing, and footer styling.
- Improved unavailable project actions by showing clearly disabled Website and Source Code controls with appropriate accessibility state and no hover treatment.
- Increased the space beneath dock icons so open-app indicators sit more clearly on desktop and mobile layouts.

## 11 August 2026

### Added

- Added a macOS-inspired nischOS lock screen with a centered About illustration avatar, live date and time, a keyboard-accessible “Click to Unlock” control, a 1.2-second progress indicator, and same-tab session persistence.
- Added a lock-screen-only water-surface effect for fine pointers that bends the grid, idles once its ripples settle, pauses when the page is hidden, and falls back to static CSS for touch, reduced motion, or unavailable WebGL.
- Added a coordinated unlock transition that separates the clock and profile before revealing the desktop, with a reduced-motion fallback.
- Added a persisted light and dark appearance with a compact menu-bar toggle, system-preference support, cross-tab synchronization, and a pre-render bootstrap that prevents theme flashing.
- Added AI model metadata for projects, with local fallbacks for Keyform (`GPT-5.6 Sol`), Toolkit (`GPT-5.5`), and Maneki (`GPT-5.5`).
- Added a CSS token audit to the standard project checks so undefined and misplaced custom properties are caught automatically.
- Added Supabase migrations for the new `model` and `category` project fields, including a non-destructive category backfill from the legacy `type` field.

### Changed

- Introduced a neutral white and gray light palette across the desktop, windows, sidebars, dock, and browser chrome while preserving the existing dark appearance.
- Restyled light-theme desktop icons with restrained, dock-like surfaces and improved the contrast of window controls, carousel buttons, and pagination indicators.
- Renamed project and window metadata from `kind` or `type` to `category` throughout the interface, application types, local content, and Supabase read model.
- Replaced the project technology stack with the AI model used to create each project.
- Renamed project actions from “Live Demo” to “Visit Website” and from “Source” to “Source Code”.
- Increased the default project-window dimensions for a wider, taller layout while preserving responsive viewport constraints.
- Restyled the primary project action with a near-white surface and the existing default border treatment.

### Refactored

- Extracted the desktop experience from the application entry wrapper and isolated lock-screen session handling, tests, styles, and motion tokens in a dedicated entry feature.
- Centralized theme state and component colour recipes, removed duplicated carousel theme declarations, and kept raw colours inside the audited token layer.
- Added tests for theme preference parsing, system resolution, browser chrome colours, and light/dark toggling.
- Consolidated system-app metadata and project window IDs in a shared desktop app registry.
- Simplified dock lookups, content fallbacks, window geometry, clock formatting, and shared tone tokens to reduce duplicated logic and values.
- Expanded tests for project metadata fallbacks, desktop icon creation, dock behaviour, and Supabase mapping.

## 31 July 2026

### Added

- Added responsive dock magnification with smooth icon scaling, neighbour displacement, an adaptive dock background, and shared pointer/keyboard tooltips.
- Added open-window indicators to dock items, backed by a reusable semantic colour token.
- Added unit tests for dock magnification, item spacing, and edge-aware dock expansion.

### Accessibility

- Limited magnification to fine-pointer desktop layouts and respected reduced-motion preferences.
- Preserved keyboard-focus tooltips alongside pointer interactions.
