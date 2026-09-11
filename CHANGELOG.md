# Changelog

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
