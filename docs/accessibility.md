# Accessibility: status and verification

Updated: 23 September 2026

This is the current accessibility record for nischOS. The eight original findings
(A01–A08) have local implementations, and the image-alternative and structure/name
reviews are complete within the scope below. Broader assistive-technology and
browser verification remains outstanding; this is not a conformance statement.

The [16 September audit](accessibility-audit-2026-09-16.md) preserves the original
reproductions, criteria, measurements and dated remediation evidence. The
[changelog](../CHANGELOG.md) records implementation history. Use this document for
current status and remaining work rather than the historical audit’s defect text.

## Implemented changes

| Area | Current implementation | Remaining verification |
| --- | --- | --- |
| A01: window focus | Opening and explicit dock switching focus a window title; closing restores an opener or surviving window. Covered mobile content is inert. | Cross-browser focus and screen-reader speech. |
| A02: contrast | Corrected tertiary text and inactive-window contrast, including the light-theme Pinned label. | Remaining interaction states, gradients, forced colors and fresh scans. |
| A03: image dialogs | Native modal dialog in the top layer, background isolation, Escape and focus restoration. | Additional browsers, touch hardware and speech. |
| A04: Contact reflow | Contact values and copying remain usable in narrow layouts. | Native zoom, text-only zoom and text spacing. |
| A05: entry reflow | Short entry layouts retain reachable content and focus. | Native zoom and additional devices. |
| A06: window arrangement | More popover supports click/keyboard movement and resizing, 1/4/8/16/32px steps, bounds and focus handling. | Final design across browsers and assistive technology, including compact position/size announcements. |
| A07: copy feedback | Persistent accessible status, visible success/error feedback and manual-copy fallback; focus stays on the control. | Actual speech on success, repeated attempts and failure. |
| A08: dock tooltips | Hover persistence, hover bridge and Escape dismissal without moving focus. | Additional browsers, touch and preference coverage. |
| Image alternatives | Authored screenshot, archive and cover descriptions; asset-based remote matching; decorative hiding retained. | New or changed remote assets require editorial review. |
| Structure and names | Consistent About naming, native unlock name, navigation landmarks, corrected generic labels, desktop heading and active-window skip link. | Speech recognition and screen-reader navigation. |

The current window layer is no longer a whole-content `aria-live` region. Loading,
copying, errors and window adjustments use targeted status feedback. Listening to
the resulting announcement volume is still required.

## Remaining verification

### Critical journeys

- [ ] Test VoiceOver with Safari and NVDA with Firefox or Chrome through unlock,
  opening/switching/closing windows, Notes and About navigation, image dialogs,
  carousels and copying. Record actual speech, focus and announcement volume.
- [ ] Verify A06 using keyboard and individual pointer clicks: precise 1px
  adjustments, native resizing, bounds, short-window scrolling, viewport changes,
  dismissal and pronunciation of x/y/w/h status feedback.
- [ ] Exercise native browser zoom at 200% and 400%, text-only zoom at 200%, and
  text-spacing overrides. Confirm reachable content, visible focus and no
  avoidable horizontal clipping. Earlier viewport/root-font simulations are
  supporting evidence only.
- [ ] Verify speech-input targeting of the visible unlock wording and About,
  navigation and contact control names.

### Browser, content and preference coverage

- [ ] Repeat keyboard/pointer checks in Safari, Firefox and Chromium, plus mobile
  touch hardware. Include modal isolation/restoration, dock tooltips, focus after
  breakpoint changes and keyboard scrolling in Tools. Add an explicitly named,
  focusable scroll region only if actual browser findings require it.
- [ ] Re-run automated contrast checks and inspect inconclusive gradients,
  overlapping windows, hover/focus/selected/inactive states and scrolled content.
  Cover both themes, forced colors/high contrast, reduced motion, the 404 page and
  loading/error/empty/fallback states. Preserve the A02 regressions.
- [ ] Assess the automatically updating clock and whether it needs pause, hide or
  update-frequency controls; verify any resulting change by keyboard and speech.
- [ ] Review live remote images not present in the checked-in image inventory and
  review descriptions whenever their underlying assets change.

### Release evidence

- [ ] Complete a scoped WCAG 2.2 A/AA criterion review with pass/fail/not-applicable
  decisions and evidence before making a conformance claim.
- [ ] Record browser, OS and assistive-technology versions, dates, manual results
  and limitations. Run `npm run check` and verify the deployed revision matches
  the reviewed build.
- [ ] Keep public accessibility communication accurate about scope, known
  limitations and how users can report problems.

## Latest validation

On 23 September, `npm run check` passed with **154 tests across 37 files**, project
manifest validation, CSS token checks, lint, TypeScript and the production build.
Browser checks for the structure review used the Codex in-app browser, its narrow
default viewport and 1280 × 800. They verified keyboard focus and accessibility-tree
semantics, not VoiceOver/NVDA speech or speech-recognition behavior. No fresh
full-site axe scan or deployment verification was performed in these two reviews.

## Image alternatives review

Reviewed the 12 screenshots referenced by the five current project manifests, all 78 archive case-study images, and the eight zoomable archive covers against the checked-in image assets. The screenshot review includes the nine mirrored Supabase images used for Keyform, Maneki Neko Catalog and Nisch’s Toolkit.

### Changes

- Replaced filename-derived carousel labels with authored, asset-specific descriptions in `content/screenshot-alternatives.json`. Descriptions explain the interface, task or state shown. Carousel selectors include the image number and description.
- Matched descriptions by full source URL/path rather than carousel position. Remote URLs, their local mirror paths and query/fragment variants retain the description; reordered remote results cannot swap descriptions. The previous Still PNG path shares the reviewed WebP description.
- Rewrote archived image alternatives to describe the design evidence: layout changes, research annotations, product messages, checkout feedback and menu options. Corrected the Auto Gmail inbox-connection image and Alice style-guide descriptions.
- Gave zoomable covers meaningful descriptions in both preview and lightbox. Zoom controls include the caption and full description so their explicit accessible names do not mask the image alternative.
- Retained empty alternatives and existing hiding for decorative app icons, archive listing thumbnails, zoom glyphs and outgoing carousel animation layers.

### Verification and limits

Regression coverage checks description coverage for every published screenshot,
remote/mirror/query variants, reordered remote results, unknown remote assets and
archive zoom-control descriptions.

The remote review covers the checked-in mirrors and repository content variants, not a fresh inventory of the live Supabase database. A new remote URL that has not been reviewed falls back to the project’s stated purpose without guessing visual details from its filename or position. Such assets still need an authored description when published. Real screen-reader speech testing remains in the checklist above.

## Structure and accessible names review

Reviewed the lock screen, desktop shell, window frames, Notes, About, project carousels and archived work. Existing uncommitted heading and structure improvements were preserved.

### Findings and changes

- The unlock button showed “nischOS” and “Click to Unlock” but its explicit name was “Unlock nischOS.” Removed the overriding label; its native name now includes all visible wording. The browser accessibility tree confirms “nischOS Click to Unlock.”
- Standardised the app name as About in the launcher, window title, window controls, active-app label and dock. Nischal remains the person’s name in profile content. The brand button is named “nischOS — Open About,” retaining its visible wording and explaining its action.
- Changed Notes and About section selectors to labelled navigation landmarks. Kept the named main, Dock navigation, desktop-icon region and content regions. Window frames remain named articles; ordinary windows are not falsely presented as modal dialogs. Hidden/preparing desktop content remains inert and excluded from accessibility navigation.
- Removed unnecessary labels from generic status wrappers, traffic-light wrappers, the static folder path, nested profile footer, screenshot-dot wrapper and project metadata list. The carousel controls use an explicitly named group. Profile links now use that name rather than “Project links.” Contact links include their visible label and value in the accessible name.
- Retained the existing content heading hierarchy: independent window content titles, section headings and toolkit item headings. Responsive About titles expose one content title for the visible layout. A visually hidden “nischOS portfolio desktop” heading supplies orientation even when no window is open and labels the desktop main landmark. Adding this heading is a navigation improvement; absence of an `h1` alone was not recorded as a confirmed failure. Independent window content keeps its existing heading levels.
- Added a first-in-order, focus-visible skip link. It targets the current active window title, which is programmatically focusable, or desktop shortcuts when all windows are closed. It bypasses shell controls without altering window state. Its label and destination update when windows open, switch or close, including in the mobile layout.

### Verification

Regression coverage checks unlock wording, desktop orientation, About naming,
skip focus with no window, switching/closing windows and mobile inert content.

In the Codex in-app browser, verified the unlock accessible name; first-Tab skip-link visibility; Enter activation and subsequent Tab to the first shortcut; active-window skip focus; and subsequent Tab into window controls. Inspected the accessibility tree and DOM semantic snapshot at the narrow default viewport and at 1280 × 800. Verified About navigation and the visible Tools heading hierarchy at both layouts. The preview loaded remote portfolio content during this review.

This is browser accessibility-tree and keyboard evidence, not real VoiceOver/NVDA speech or speech-recognition testing. Those broader checks remain in the checklist above; no conformance claim is made.
