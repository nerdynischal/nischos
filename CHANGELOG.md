# Changelog

## 11 August 2026

### Added

- Added a macOS-inspired nischalOS lock screen with a centered About illustration avatar, live date and time, a keyboard-accessible entry control, a 1.2-second progress indicator, and same-tab session persistence.
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
