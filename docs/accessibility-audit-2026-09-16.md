# nischOS accessibility audit

Date: 16 September 2026
Code baseline: `4d51125`
Target: WCAG 2.2, levels A and AA
Outcome: **Accessibility fixes are required before claiming AA conformance.**

Eight actionable findings are documented below: three high priority and five medium priority. Findings combine browser reproduction, accessibility-tree inspection, computed layout, axe-core results, and source review. Priority reflects user impact, not WCAG conformance level.

## Scope and method

Audited the local React application at `http://127.0.0.1:5173/`, including its currently loaded Supabase content. Covered entry/unlock, desktop and dock, window opening/closing/switching, Notes, About and Contact, the toolkit section, Workout Board's project reader, Selected Work, and Auto Gmail's case study and image viewer. Reviewed shared rendering code for other projects, loading/error/fallback states, reduced-motion handling, and the 404 page.

- Manual keyboard checks used Enter, Tab, Escape, and Page Down, including opening from the dock, closing windows, mobile list/detail navigation, and image-viewer focus return.
- Responsive inspection covered widths of 320, 768, 1024, 1280, and 1440 CSS pixels. The detailed mobile checks used 320 × 568; entry was additionally checked at 320 × 256 and 320 × 180.
- Tested text spacing with line height 1.5, paragraph spacing 2em, letter spacing 0.12em, and word spacing 0.16em. Tested 200% root text size on mobile Contact. These are CSS/viewport simulations, not a complete native browser zoom or text-only zoom certification.
- Ran axe-core **4.13.0** against ten rendered states using `wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, and `best-practice` tags. A temporary development harness excluded its own controls from scans; interactive focus findings were also checked in the normal app. Harness files were removed after the audit.
- Ran the existing test suite: **29 files, 105 tests passed**. Passing application tests does not establish accessibility conformance.

The normative reference is [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/). Dialog behavior recommendations also follow the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

## Findings

### A01 — High: window navigation loses or obscures keyboard focus

**Remediation status (16 September 2026): Fixed locally.** Opening and explicit dock activation now focus the window title, with a visible keyboard focus indicator. Closing restores the invoking control or a surviving window when the opener is unavailable/covered. Mobile inactive windows and desktop shortcuts are inert; desktop shortcuts leave the tab sequence while windows are open, with dock navigation retained. Pointer/focus activation within desktop windows preserves the selected control. Eight regression tests were added; all 113 tests, lint, token/manifest checks, type checking, and the production build pass. Manual browser checks verified dock opening/closing and mobile window switching. Screen-reader speech testing remains outstanding. Evidence below records the original defect.

**Evidence:** At 1280 × 720, activating the dock's “Open Notes” using Enter left `document.activeElement` on “Focus Notes.” The next Tab moved to “Open Selected Work,” not into Notes. Activating “Close Notes” using Enter left focus on `BODY`. The same loss occurred when closing About in the normal mobile app.

At 320 × 568, opening About from its desktop shortcut left focus on that shortcut, underneath the new window. Its rectangle was approximately x=114, y=306, width=91, height=100; hit-testing its center returned the Nischal window covering it. Desktop shortcuts remain focusable behind windows. Existing-window dock actions likewise update stacking order without moving DOM focus.

**Impact:** Keyboard users lose their location or cannot see the focused control; opening a reader does not establish a useful reading/navigation position. Screen-reader users receive an inconsistent transition between launcher and content.

**Criteria:** 2.4.3 Focus Order; 2.4.11 Focus Not Obscured (Minimum).

**Locations:** [WindowFrame.tsx:27](</Users/nischal/Documents/Vibe code site/src/windows/WindowFrame.tsx:27>), [useDesktopWindows.ts:89](</Users/nischal/Documents/Vibe code site/src/hooks/useDesktopWindows.ts:89>), [DesktopExperience.tsx:131](</Users/nischal/Documents/Vibe code site/src/desktop/DesktopExperience.tsx:131>).

**Fix:** Track the invoking control and a useful focus target for each window. On open or explicit dock activation, focus the window heading/container or its first meaningful control. On close, restore the invoking control if available, otherwise focus a sensible surviving window or launcher. On mobile, prevent covered desktop controls and inactive windows from participating in keyboard navigation. Preserve deliberate nonmodal switching on desktop; do not indiscriminately trap focus in every window.

**Acceptance:** Open, switch, and close all window types using only the keyboard, with multiple windows present. Focus remains visible, enters the requested content, and returns predictably after closure.

### A02 — High: dark-theme secondary metadata fails text contrast

**Remediation (2026-09-17): Fixed locally, including the targeted light inactive-state follow-up.** Tertiary text opacity increased from 42% to 50%, with a 57% local token inside inactive windows to compensate for their existing brightness/saturation filter. Decorative contact icons, mobile chevrons, and loading indicators retain their previous opacity through a separate icon token. Typography, spacing, backgrounds, muted text, and the light-theme palette are unchanged.

Browser computed-style contrast calculations (alpha compositing and inactive filters included) measured: active application 4.95:1; Notes sidebar 4.99:1; selected Pinned 4.73:1; note date 4.98:1; Toolkit headings, project TYPE/MODEL, and Selected Work file labels 4.99:1; dark 404 metadata 4.95–4.99:1. Inactive dark Pinned is 4.71:1 and inactive note date is 4.94:1. A saved after screenshot is available in `docs/a02-evidence/notes-after.png`. These are computed-style checks, not a fresh axe scan or cross-browser certification. Regression tests cover nine opaque surfaces plus the translucent Selected Work hover surface, including the inactive dark-window filter. All 128 tests, lint, project/token checks, and the production build pass.

**Light-theme follow-up (2026-09-17): Fixed locally.** A selector scoped to light-theme inactive Notes windows raises only the Pinned label from 64% to 68% text opacity. Browser computed-style checks including the dimming filter now measure 4.87:1, up from 4.36:1. Active light Pinned remains 4.77:1 at 64%; inactive dark Pinned remains 4.71:1 at 57%; adjacent sidebar text retains its prior styling. A regression test covers the scoped color over sidebar, hover, and selected surfaces with the inactive filter. All 129 tests and the full project check pass. Evidence below records the original defect.


**Evidence:** axe measured the following normal-sized text below 4.5:1:

| Element | Foreground / background | Ratio |
| --- | --- | --- |
| Active application name | `#6a6a6a` / `#050505` | 3.76:1 |
| Notes sidebar heading | `#707071` / `#0f1011` | 3.85:1 |
| Selected note's “Pinned” label | `#797a7c` / `#202124` | 3.74:1 |
| Note date | `#717172` / `#111213` | 3.84:1 |
| Toolkit group heading | `#6d6e6e` / `#0b0c0d` | 3.82:1 |
| Project TYPE/MODEL labels | `#6d6e6e` / `#0b0c0d` | 3.82:1 |

Selected Work's folder metadata and visible file-type labels also failed. This is a shared palette issue rather than isolated content. The light Notes scan had no automatically detected violations, but included contrast results requiring manual review; it is not evidence that all light-theme states pass.

**Impact:** Users with low vision have difficulty reading metadata and contextual labels.

**Criterion:** 1.4.3 Contrast (Minimum).

**Location:** [semantic.css:9](</Users/nischal/Documents/Vibe code site/src/styles/tokens/semantic.css:9>) defines dark `--text-tertiary` with 42% opacity. Consumers include [readers.css:83](</Users/nischal/Documents/Vibe code site/src/styles/theme/readers.css:83>).

**Fix:** Adjust the tertiary text token to achieve at least 4.5:1 on every surface where it is used. Recheck selected, inactive, hover, and mixed-opacity surfaces, including the 404 page, rather than choosing a value against only the desktop background.

**Acceptance:** Retest all failing elements in both themes, at rest and in applicable interaction states. Exemptions for disabled controls do not apply to these labels.

### A03 — High: image viewer declares a modal state without enforcing it

**Remediation status (16 September 2026): Fixed locally.** The viewer now opens with native `dialog.showModal()` in a portal outside the desktop window, covering the whole viewport. The browser makes background content inert and removes it from the exposed accessibility tree. Escape, the close button, and surrounding-surface dismissal restore focus to the image trigger. Root scroll locking is separate from the desktop's mobile body lock. Browser verification covered desktop and 320px mobile layouts, Tab/Shift+Tab, Escape, focus restoration, hit-testing over dock controls, and resizing while open. Four regression tests cover dialog lifecycle, dismissal, reopening, scroll restoration, and queued StrictMode close events. All 117 tests and the full production check pass. Actual screen-reader speech testing remains outstanding. Evidence below records the original defect.

**Evidence:** Open Selected Work → Auto Gmail → its cover image. The viewer exposes `role="dialog"` and `aria-modal="true"`; Tab correctly stays on its close button. However, clicking the dock's Notes button opens and activates Notes while the image viewer remains in the DOM with `aria-modal="true"`. Focus moves outside the purported modal. Its backdrop covers only the project window body, leaving the titlebar, dock, and other windows interactive.

**Impact:** Assistive technology can treat outside content as unavailable while the visual interface still lets users interact with it. Mixed keyboard/pointer use can strand a modal declaration underneath another window.

**Criteria:** 4.1.2 Name, Role, Value; related focus-order behavior under 2.4.3.

**Locations:** [LegacyImageViewer.tsx:83](</Users/nischal/Documents/Vibe code site/src/features/projects/LegacyImageViewer.tsx:83>), [legacy-image-viewer.css:44](</Users/nischal/Documents/Vibe code site/src/styles/legacy-image-viewer.css:44>).

**Fix:** Choose consistent behavior. For a page-modal viewer, render it above the desktop, make the background inert, and contain focus until dismissal. For a window-local nonmodal viewer, remove the page-modal assertion and provide a coherent route to other windows. Retain Escape dismissal and focus restoration, which worked in the tested viewer.

**Acceptance:** While a page-modal viewer is open, no pointer, Tab sequence, or assistive-technology navigation can operate background controls. Closing returns focus to the image trigger.

### A04 — Medium: contact details are clipped on small screens and enlarged text

**Remediation (2026-09-17): Fixed locally.** Contact rows stack their labels and values in narrow panes and use side-by-side columns only when the contact container has sufficient space. The fixed minimum label column and value ellipsis are removed for contact rows; complete values wrap while the copy/link icons retain their size. Browser verification confirmed full values at 320px, and at 320px with both 200% root text sizing and text-spacing overrides (1.5 line height, 0.12em letter spacing, 0.16em word spacing, and 2em paragraph spacing). Contact rows and the detail pane had no horizontal overflow; Tab scrolled the enlarged controls into view with visible focus. The standard desktop layout retained side-by-side rows without clipping. All 126 tests, lint, project/token checks, and the production build pass. Text enlargement was simulated through root font sizing; actual browser zoom and screen-reader speech were not tested.

**Evidence:** At 320px in the normal app, the email value occupied a 41px-wide span while its text required 109px. The span uses `overflow: hidden`, `white-space: nowrap`, and ellipsis. The full value is not revealed on screen; the button title describes the copy action rather than showing the full address. Link values are similarly shortened. With 200% root text sizing, contact rows measured 336px wide inside a 275px-wide detail pane whose horizontal overflow is hidden. The text-spacing override also left contact values truncated.

**Impact:** Magnification and small-screen users cannot visually read complete contact information. Copying the address elsewhere is an avoidable workaround, not an equivalent readable presentation.

**Criteria:** 1.4.10 Reflow; 1.4.4 Resize Text. Text-spacing resilience should be included in remediation; baseline clipping was already present before that override.

**Locations:** [settings.css:113](</Users/nischal/Documents/Vibe code site/src/styles/settings.css:113>), [settings.css:207](</Users/nischal/Documents/Vibe code site/src/styles/settings.css:207>), [settings.css:289](</Users/nischal/Documents/Vibe code site/src/styles/settings.css:289>).

**Fix:** Stack contact labels and values when space is limited, remove the fixed minimum label-column constraint at narrow widths, allow addresses to wrap, and keep the copy/link affordance visible without shrinking away the value.

**Acceptance:** Full contact values and actions remain readable at 320px, at 200% text size, and with the WCAG text-spacing overrides, without horizontal clipping.

### A05 — Medium: entry screen cannot reflow at short viewport heights

**Remediation (2026-09-17): Fixed locally.** The fixed entry screen now scrolls vertically when its content exceeds the viewport. Its grid preserves a minimum gap between the clock and profile, allows the column to shrink, and wraps enlarged clock text instead of causing horizontal overflow. Browser verification at 320 × 180 and 320 × 256 confirmed the complete unlock control and its focus ring are visible after autofocus, with the clock reachable using Home/vertical scrolling. A temporary fixture with a doubled root font size at 320 × 256 confirmed text reflow and keyboard access without horizontal overflow. Standard layouts at 768 × 768, 1024 × 768, and 1440 × 900 fit without scrolling. Keyboard unlock was checked at 320 × 180. These are viewport/text-size simulations, not an actual browser zoom test. All 126 tests, lint, project/token checks, and the production build pass.

**Evidence:** In a fresh tab at 320 × 180, the unlock button extends from y≈124 to y≈262. Only part of the avatar is visible; the product name and unlock instruction are below the viewport. Document scroll height remains 180px, so the missing content cannot be scrolled into view. At 320 × 256 the bottom of the instruction is still clipped. The 320 × 180 test represents the CSS viewport dimensions of a 1280 × 720 viewport at 400% zoom, rather than an actual browser zoom run.

**Impact:** Users at high magnification or short viewport heights lose the visible entry instruction and much of the entry control.

**Criterion:** 1.4.10 Reflow.

**Location:** [lock-screen.css:2](</Users/nischal/Documents/Vibe code site/src/styles/lock-screen.css:2>) combines a fixed viewport, hidden overflow, substantial padding, and nonshrinking content.

**Fix:** Allow vertical scrolling and content-driven height, or introduce a compact short-height layout that retains the complete entry control. Do not solve this by restricting browser zoom.

**Acceptance:** At 320 × 180 and 320 × 256, the full entry content is visible or reachable by vertical scrolling, with a visible keyboard focus indicator.

### A06 — Medium: window movement has no keyboard or non-drag pointer alternative

**Evidence:** Window movement is implemented only through pointer-down/move/up handlers on a nonfocusable header. Resizing is exposed through CSS `resize: both`. No move/resize commands or click-based alternative are present. The decorative minimize/zoom dots are spans, not alternatives.

**Impact:** Users who cannot perform a sustained drag cannot arrange desktop windows; keyboard users cannot operate the same window-management functionality.

**Criteria:** 2.1.1 Keyboard; 2.5.7 Dragging Movements for authored window dragging. The exact accessibility of the browser-provided CSS resize affordance also needs cross-browser checking.

**Locations:** [WindowFrame.tsx:44](</Users/nischal/Documents/Vibe code site/src/windows/WindowFrame.tsx:44>), [useDesktopWindows.ts:117](</Users/nischal/Documents/Vibe code site/src/hooks/useDesktopWindows.ts:117>), [windows.css:51](</Users/nischal/Documents/Vibe code site/src/styles/windows.css:51>).

**Fix:** Add accessible window commands for movement and useful layout positions/sizes, operable by both keyboard and individual pointer clicks. If arbitrary positioning remains functionality, provide an equivalent way to achieve it; a single maximize button alone does not reproduce all movement.

**Acceptance:** A user can move and resize/arrange windows without holding down a pointer, and complete the same operation using the keyboard.

### A07 — Medium: copy confirmation is hidden from assistive technology

**Remediation status (17 September 2026): Fixed locally.** Copy feedback now uses a persistent, visible `role="status"` region outside the hidden icon wrapper. Success remains readable, repeated attempts replace the message content, and rejected or unavailable clipboard access exposes an error and a labelled read-only field for manual copying. Focus stays on the initiating button; tabbing to the fallback selects its value. A successful retry removes the fallback. Duplicate in-flight requests are ignored without disabling the focused button. Four regression tests cover these paths. All 121 tests and the full production check pass. A 320px browser fixture with a simulated clipboard verified failure, manual selection, retry, success, and focus retention without changing the user's clipboard. Actual screen-reader speech testing remains outstanding. Evidence below records the original defect.

**Evidence from source:** The “Email copied” toast and success icon are descendants of `aria-hidden="true"`. Success changes a `title` attribute but creates no accessible status message. Clipboard rejection is caught silently. This is source-confirmed; the audit did not alter the user's clipboard or run a speech-output test.

**Impact:** Screen-reader users cannot reliably determine whether copying succeeded; a failed copy has no visible or announced explanation.

**Criterion:** 4.1.3 Status Messages for the displayed success message. Silent failure is an additional usability problem.

**Location:** [ContactDetails.tsx:28](</Users/nischal/Documents/Vibe code site/src/features/settings/ContactDetails.tsx:28>) and its hidden status content at line 47.

**Fix:** Add a persistent, initially empty `role="status"` region outside the hidden icon wrapper. Announce success concisely and expose an actionable failure message with a way to select/copy the address manually. Keep focus on the initiating button.

**Acceptance:** Success and failure feedback is available visually and through a screen reader, without moving focus or requiring hover.

### A08 — Medium: dock tooltips cannot be hovered or explicitly dismissed

**Remediation (2026-09-17): Fixed locally.** Visible tooltips now accept pointer input and have a transparent hover bridge to the dock. Their label and position stay steady while hovered. Escape dismisses the tooltip without moving focus, and dismissal persists on the same item until the interaction ends or another item is activated. Keyboard focus keeps the tooltip visible when the mouse moves away. Existing accessible button names remain unchanged, with tooltip text hidden from the accessibility tree to avoid duplicate labels. Five regression tests cover hover persistence, dismissal/re-entry, keyboard focus, combined focus/hover, touch input, and animation cleanup. Browser verification confirmed crossing the gap onto the tooltip, hit testing within the bridge, pointer dismissal, and keyboard dismissal with focus retained. All 126 tests, project/token checks, lint, and the production build pass. Screen-reader speech was not tested.

**Evidence from source:** The tooltip has `pointer-events: none`; leaving the dock clears it. It appears above the dock, so moving toward its text leaves the triggering region and dismisses it. There is no Escape handler to dismiss a keyboard-triggered tooltip while keeping focus on its dock button.

**Impact:** Users who enlarge text or move the pointer onto additional content cannot keep the tooltip available to read it. A focused tooltip cannot be dismissed independently.

**Criterion:** 1.4.13 Content on Hover or Focus, particularly hoverability. Whether a specific tooltip overlaps other content affects the dismissibility exception; the hoverability problem does not depend on that exception.

**Locations:** [dock.css:145](</Users/nischal/Documents/Vibe code site/src/styles/dock.css:145>), [useDockMagnification.ts:120](</Users/nischal/Documents/Vibe code site/src/desktop/useDockMagnification.ts:120>).

**Fix:** Maintain visibility while the pointer is over either the trigger or the tooltip, allow Escape dismissal, and keep the tooltip visible until hover/focus is removed or the user dismisses it. Existing button names already supply accessible labels; avoid duplicate announcements when revising the tooltip.

**Acceptance:** Users can move onto and read the tooltip, and dismiss it without moving focus or the pointer off the trigger.

## Automated results and manual triage

Counts below are rule categories, not counts of independent defects or an accessibility score.

| Scanned state | Viewport | Violations reported |
| --- | --- | --- |
| Light Notes | 1280 × 720 | None; manual-review results remained |
| Dark Notes | 1280 × 720 | Text contrast |
| Dark About | 1280 × 720 | Text contrast |
| Dark Contact | 1280 × 720 | Text contrast |
| Dark Tools | 1280 × 720 | Text contrast; scroll-region focus warning |
| Dark Workout Board | 1280 × 720 | Text contrast |
| Dark Selected Work | 1280 × 720 | Text contrast |
| Dark Auto Gmail with folder open | 1280 × 720 | Text contrast |
| Dark mobile Contact | 320 × 568 | Text contrast |
| Dark mobile note with another window open | 320 × 568 | Text contrast |

The Tools `scrollable-region-focusable` result was **not accepted as a confirmed failure in the tested browser**. After tabbing through Contact, focus reached `.settings-detail`; Page Down scrolled it by 504px in the 768px-wide check. It has no explicit `tabindex`, so compatibility with browsers that do not automatically focus scroll containers still needs testing. An explicit named, focusable scroll region would make this behavior more robust.

axe also returned manual-review items for labels on generic `div` elements (`.menu-status`, `.traffic-lights`, carousel wrappers, and the folder path). Use an appropriate named group where grouping conveys useful information. Contrast checks involving wallpaper gradients, overlapping windows, and content outside the visible area were inconclusive; they were not counted as passes.

## Positive findings

- Entry, desktop launchers, dock controls, carousel navigation, and close actions use native buttons with accessible names. The entry control works with Enter.
- Page language and document titles are provided, including a specific 404 title. Viewport metadata does not disable zoom.
- Mobile Notes and About navigation moves focus to the back button on entry and restores it to the selected row on return.
- The image viewer initially focuses its close control, handles Tab and Escape, and returns focus to its image trigger. Its remaining problem is scope/isolation, not absence of those behaviors.
- Global button/link focus styling exists; the lock-screen avatar has its own visible keyboard-focus treatment.
- Decorative artwork is generally hidden from assistive technology. Case-study images have authored alternatives, though their descriptive quality varies.
- Source includes reduced-motion handling for entry, ripple rendering, dock magnification, carousel transitions, and mobile navigation. Existing tests cover immediate reduced-motion entry.
- Note loading/fallback/error paths include status text and retry controls. Loading skeleton content is intended to be hidden and inert.
- No target-size failure was reported in the scanned states. The 12px close dot is still a usability improvement opportunity, but size alone does not prove a WCAG 2.5.8 failure: spacing exceptions and the mobile 44px pseudo-element hit area must be considered.

## Further checks and improvements

These are separate from the eight findings, because impact or conformance needs additional validation:

1. **Actual screen-reader speech:** Test VoiceOver/Safari and NVDA/Firefox or Chrome. The whole window layer has `aria-live="polite"`, which may announce excessive case-study/note content when mounted. Prefer a small dedicated status message if speech testing confirms this. Accessibility-tree inspection is not a substitute for listening to the announcement.
2. **Image alternatives:** Modern screenshot names are generated from filenames. Some legacy alternatives repeat generic phrases such as “promotional feature artwork.” Review every meaningful image against its visual purpose; author meaningful descriptions or adjacent explanations where needed. This audit did not visually assess every archived image or every remote content variant.
3. **Structure and labels:** Add a useful top-level page heading and consider a skip-to-active-window control. A missing `h1` alone was not treated as a WCAG failure. Review the unlock button's visible “Click to Unlock” copy against its “Unlock nischOS” accessible name for speech-input consistency. Consider consistent About/Nischal naming across launcher and close controls.
4. **Updating clock:** The desktop clock changes every second with no pause/hide control. Assess it against 2.2.2 Pause, Stop, Hide; a portfolio clock is not obviously essential. Consider a static timestamp, a hide option, or user-controlled updates.
5. **Browser and preference coverage:** Complete real 200%/400% zoom, text-only zoom, forced-colors/high-contrast mode, OS reduced-motion, touch hardware, and additional browser testing. The 404 page and error/fallback states were source-reviewed, not separately exercised in all visual states. External project sites linked from this portfolio are outside this audit.

## Recommended remediation order

1. Fix focus lifecycle and image-viewer modality together; these affect the navigation model.
2. Correct dark-theme contrast tokens and remeasure affected surfaces.
3. Repair Contact and entry reflow, then repeat zoom and text-spacing checks.
4. Add non-drag window controls, accessible copy feedback, and persistent/dismissible tooltips.
5. Add focused browser regression checks for these behaviors and complete assistive-technology testing before making a conformance claim.

The original audit changed documentation only. A01, A02, A03, A04, A05, A07, and A08 were subsequently fixed locally as recorded above; other findings remain open. This report does not certify conformance. See CHANGELOG.md for the implementation and validation record.
