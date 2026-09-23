# Design tokens

The token system is imported by `../app.css` in dependency order:

1. `primitives.css` — raw colour, spacing, radius, duration, easing, and font values.
2. `semantic.css` — theme roles such as text, surfaces, borders, focus, and typography. Dark values are the no-JavaScript fallback; `[data-theme='light']` provides the light overrides.
3. `components.css` — shared component dimensions and theme-aware visual recipes, including primary action states, shadows, artwork, and the tone palette.

Component styles should consume semantic or component tokens. Add a primitive only when the value is intended to be reused; keep genuinely one-off layout values beside their component. Raw colour literals belong in these token files, including decorative artwork colours, so palette usage remains auditable.

The application stores `system`, `light`, or `dark` under `nischos-theme`. An inline bootstrap in `index.html` resolves that preference before the application stylesheet paints, and `ThemeProvider` keeps the document theme, browser chrome colour, system preference, and cross-tab state in sync.

Runtime positioning variables such as `--window-x` and `--icon-y` are set by React and intentionally live outside these files.

Run `npm run tokens:check` after changing CSS custom properties. The check rejects unused or duplicate root tokens, references that are neither defined in CSS nor supplied by TypeScript at runtime, and raw colours outside the token files.

## Accessibility checks when changing tokens

Preserve the distinction between tertiary text and decorative icon opacity. The
inactive-window treatment affects perceived contrast, so test selected, hovered
and inactive states in both themes rather than checking only the desktop surface.
Keep keyboard focus indicators visible, including the desktop skip link.

`npm run check` includes the contrast regression tests in
`scripts/contrast.test.ts`; these targeted checks do not cover every rendered
state. Consult the [current accessibility record](../../../docs/accessibility.md)
for remaining contrast, forced-colors and browser checks, and the
[historical A02 evidence](../../../docs/accessibility-audit-2026-09-16.md#a02--high-dark-theme-secondary-metadata-fails-text-contrast)
for the measured surfaces behind the existing corrections.
