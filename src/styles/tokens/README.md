# Design tokens

The token system is imported by `../app.css` in dependency order:

1. `primitives.css` — raw colour, spacing, radius, duration, easing, and font values.
2. `semantic.css` — theme roles such as text, surfaces, borders, focus, and typography. Dark values are the no-JavaScript fallback; `[data-theme='light']` provides the light overrides.
3. `components.css` — shared component dimensions and theme-aware visual recipes, including primary action states, shadows, artwork, and the tone palette.

Component styles should consume semantic or component tokens. Add a primitive only when the value is intended to be reused; keep genuinely one-off layout values beside their component. Raw colour literals belong in these token files, including decorative artwork colours, so palette usage remains auditable.

The application stores `system`, `light`, or `dark` under `nischalos-theme`. An inline bootstrap in `index.html` resolves that preference before the application stylesheet paints, and `ThemeProvider` keeps the document theme, browser chrome colour, system preference, and cross-tab state in sync.

Runtime positioning variables such as `--window-x` and `--icon-y` are set by React and intentionally live outside these files.

Run `npm run tokens:check` after changing CSS custom properties. The check rejects unused or duplicate root tokens, references that are neither defined in CSS nor supplied by TypeScript at runtime, and raw colours outside the token files.
