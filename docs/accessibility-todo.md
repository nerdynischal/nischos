# Accessibility to-do list

Updated: 21 September 2026

Based on [the accessibility audit](accessibility-audit-2026-09-16.md) and the subsequent fixes. A01–A08 have been implemented, including the A02 light-theme follow-up and the revised A06 window controls. Completed fixes still need broader assistive-technology and browser verification. This is not a conformance statement.

## Priority 1 — Verify critical journeys

- [x] **Implement the revised A06 design.** The user-approved More popover overlays window content and provides labelled move/resize controls, 1/4/8/16/32px increments (8px default), bounds enforcement, and focus handling.
- [ ] **Verify A06 manually across browsers and assistive technology.** Check keyboard activation, single-click movement/resizing, 1px precision, native-resize interoperability, short-window scrolling, viewport/breakpoint changes, focus on dismissal, and spoken position/size feedback, including the compact x/y/w/h labels.
- [ ] **Run real screen-reader testing.** Test VoiceOver with Safari and NVDA with Firefox or Chrome through unlock, app opening/switching/closing, Notes and About navigation, image dialogs, carousels, and contact copying. Confirm successful/repeated/failed copy announcements and manual fallback. Record actual speech and focus behavior.
- [ ] **Check announcement volume.** Listen to the whole-window `aria-live="polite"` behavior when loading notes and case studies. If it reads excessive content, replace it with concise status announcements while retaining useful loading/error feedback.
- [ ] **Test actual zoom and text resizing.** Exercise browser zoom at 200% and 400%, text-only zoom at 200%, and text-spacing overrides. Verify complete content, controls, focus visibility, scrolling, and absence of avoidable horizontal clipping. Previous viewport/root-font simulations do not replace these checks.

## Priority 2 — Investigate and close coverage gaps

- [ ] **Repeat keyboard and pointer checks across browsers.** Cover Safari, Firefox, and Chromium, plus mobile touch hardware. Include modal focus isolation/restoration, dock tooltip hover/Escape behavior, window focus after breakpoint changes, and keyboard scrolling in the Tools detail pane. Add an explicitly focusable, named scroll region only if needed by the findings.
- [ ] **Review remaining contrast states and preferences.** Re-run automated contrast scans and manually inspect inconclusive gradients, overlapping windows, hover/focus/selected/inactive states, and offscreen content after scrolling. Cover both themes, forced colors/high contrast, reduced motion, the 404 page, and loading/error/empty/fallback states. Preserve the targeted A02 corrections and their regression tests.
- [ ] **Audit meaningful image alternatives.** Review project screenshots and archived case-study images, including remote content variants. Replace filename-derived or generic alternatives with descriptions or adjacent explanations that communicate the image's purpose; keep decorative artwork hidden.
- [ ] **Review structure and accessible names.** Check landmarks, headings, and generic containers with ARIA labels. Verify the unlock control's visible wording matches its accessible name for speech input; review About/Nischal naming consistency. Evaluate a useful top-level heading and a skip-to-active-window link as navigation improvements, without treating a missing `h1` alone as a confirmed failure.
- [ ] **Assess the updating clock.** Evaluate whether the automatic second-by-second updates require pause, hide, or update-frequency controls. Implement an appropriate alternative if needed and verify it by keyboard and assistive technology.

## Priority 3 — Establish evidence before any conformance claim

- [ ] **Complete a criterion-by-criterion WCAG 2.2 A/AA review.** Define the exact pages, content, states, and complete user journeys in scope. Record pass/fail/not-applicable decisions with evidence, and resolve failures before claiming conformance.
- [ ] **Refresh the audit and regression coverage.** Record browser/OS/assistive-technology versions, test dates, screenshots, manual results, and remaining limitations. Add focused regression coverage for confirmed issues, run `npm run check`, and verify the deployed build matches the reviewed revision.
- [ ] **Prepare accurate accessibility communication.** Keep improvement-in-progress wording until the scoped evaluation supports a claim. Publish any eventual accessibility statement with its scope, known limitations, and a way to report problems.
