# Design tokens

The token system is imported by `../app.css` in dependency order:

1. `primitives.css` — raw colour, spacing, radius, duration, easing, and font values.
2. `semantic.css` — theme roles such as text, surfaces, borders, focus, and typography.
3. `components.css` — shared component dimensions and visual recipes, including the primary action gradient and tone palette.

Component styles should consume semantic or component tokens. Add a primitive only when the value is intended to be reused; keep genuinely one-off layout values beside their component.

Runtime positioning variables such as `--window-x` and `--icon-y` are set by React and intentionally live outside these files.
