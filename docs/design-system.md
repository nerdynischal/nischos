# nischOS design system

A simple reference for the desktop-inspired portfolio. Based on the current repository styles and components, 23 September 2026.

## Visual direction

The interface feels like a small personal operating system: a quiet grid wallpaper, movable windows, app shortcuts, and a floating dock. Neutral surfaces keep projects and writing in focus. Color is concentrated in artwork, app identities, and status indicators.

Use compact typography, thin borders, soft corners, and layered shadows. Keep content surfaces calm; reserve glass effects and decorative gradients for the dock and artwork.

## Color

The site supports System, Light, and Dark preferences. Use semantic tokens so components adapt together.

| Role / token | Dark | Light |
| --- | --- | --- |
| Desktop · `--surface-base` | `#050505` | `#F6F6F6` |
| Panel · `--surface-panel` | `#0B0C0D` | `#FFFFFF` |
| Strong panel · `--surface-panel-strong` | `#111213` | `#FAFAFA` |
| Raised panel · `--surface-panel-raised` | `#141516` | `#F2F2F2` |
| Hover · `--surface-hover` | `#17181A` | `#EBEBEB` |
| Selected · `--surface-selected` | `#202124` | `#DEDEDE` |
| Primary text · `--text-primary` | `#F5F5F5` | `#171717` |
| Secondary text · `--text-secondary` | Primary at 74% | Primary at 78% |
| Muted text · `--text-muted` | Primary at 58% | Primary at 70% |
| Tertiary text · `--text-tertiary` | Primary at 50% | Primary at 64% |
| Default border · `--line-default` | White at 9.5% | Black at 10% |
| Focus ring · `--focus-ring` | `rgba(116,166,255,.72)` | `rgba(45,105,185,.72)` |

Opacity values blend with the surface beneath them. Window backgrounds use `--window-bg`: dark panel color in Dark, white at 96% in Light.

### Accent palette

| Tone | Base color |
| --- | --- |
| Coral | `#FF8C67` |
| Mint | `#72C59A` |
| Blue | `#76A6FF` |
| Amber | `#E2AE42` |
| Rose | `#E87990` |
| Violet | `#A586D8` |
| Graphite | `#E1E1E1` |
| Settings | `#BCC4C0` |

These are artwork tone inputs, not general text colors. Use the existing tone recipes for gradients and translucent fills. Connected and fallback indicators use theme-specific status tokens. The active close control uses `#FF5F57`.

## Typography

**Geist** is the main interface and reading font. **Geist Mono** supplies window titles and selected metadata. Both are bundled locally as variable fonts. The root size is 16px.

| Role | Base size | Weight | Line height |
| --- | --- | --- | --- |
| Title | 1.35rem / 21.6px | 620 | 1.12 |
| Heading | 1rem / 16px | 580 | 1.35 |
| Body | 0.92rem / 14.72px | 460 | 1.6 |
| UI label | 0.82rem / 13.12px | 440 | 1.2 |
| Metadata | 0.72rem / 11.52px | 520 | 1.2 |
| Window chrome | 0.75rem / 12px | 600 | 1 |

Use `--type-*` tokens for these roles. Metadata tracking is `0.02em`; tight tracking is `0`.

Window typography adapts to its container. The default window title/body sizes are 1.25rem/0.88rem; at widths of 520px or less they become 1.12rem/0.84rem. Larger container steps at 620px and 780px increase them, with a further Notes reader adjustment at 900px. Preserve these overrides rather than applying the base scale everywhere.

## Spacing and shape

Use the spacing scale for gaps and padding:

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |

These pixel equivalents assume the 16px root size. The radius scale is 4, 6, 8, 12, 16, and 24px, plus circle and pill values. Prefer component tokens when a component has its own radius.

## Core components

| Component | Design recipe |
| --- | --- |
| Menu bar | 40px high; compact text; subtle bottom border; brand, active app, and status information. |
| Window | 16px corners; 1px border; 44px title bar; theme-aware surface and shadow. Desktop windows support movement and resizing. |
| Window controls | Red active close control and neutral secondary controls. Inactive windows use neutral close controls and a softer shadow. |
| Desktop shortcut | 66px artwork tile with 16px corners, within a 98px desktop shortcut width; label beneath. |
| Dock | 64px base height; 22px corners; translucent layered surface; 50px items with 15px corners. Allow space for the device safe area. |
| Buttons | Shared height options of 31, 32, 34, and 38px; 7px corners. Primary actions invert the neutral palette: pale in Dark, near-black in Light. |
| Sidebar controls | 6px corners; theme-aware hover and selected surfaces; clear text hierarchy. |
| Screenshots | 12px corners; neutral media background; authored image descriptions and labelled viewing controls. |

Active window shadows are `0 36px 110px rgba(0,0,0,.62)` in Dark and `0 30px 80px rgba(0,0,0,.18)` in Light. Use `--shadow-window` rather than duplicating these values.

## Interaction and motion

- Use distinct rest, hover, pressed, focus, selected, disabled, and inactive states where relevant.
- Keyboard focus uses a 2px outline with a 2px offset on standard buttons and links; artwork has its own focus treatment.
- Fine-pointer desktop shortcuts lift 4px and scale to 1.08 on hover; pressing returns them toward their resting position.
- Shared timings: tooltip 125ms, press 140ms, controls 160ms, windows/content 180ms, navigation 360ms. Shortcut hover uses 240ms.
- Use the existing easing tokens. Respect reduced motion, which reduces CSS animation and transition durations to 1ms and removes entry effects.
- Loading indicators appear after a 180ms delay, avoiding flashes for fast responses. Provide readable loading, empty, error, and retry states.

## Responsive behavior

At 760px and below, desktop shortcuts become a three-column grid and windows use a constrained mobile layout without native resizing. Content layouts collapse, and Notes switches between its list and reader. The menu bar stays sticky and the dock stays fixed.

Keep content clear of the menu bar, dock, and safe-area insets. Use window container queries for typography, and pointer/hover media queries for effects. The close control receives a 44px hit area on small screens or coarse pointers.

## Applying the system

1. Reuse semantic and component tokens before adding new values.
2. Keep reusable raw colors in the token files; keep genuinely one-off layout values beside their component.
3. Check both themes and all relevant interaction states, including inactive windows.
4. Preserve keyboard navigation, visible focus, descriptive control names, and image alternatives. Do not rely on color alone for meaning.
5. Run `npm run tokens:check` after token changes. Consult the accessibility record for broader verification; this document is not an accessibility certification.

### Source of truth

- [Primitive values](../src/styles/tokens/primitives.css): palette, spacing, radii, fonts, and motion.
- [Semantic tokens](../src/styles/tokens/semantic.css): theme roles and base typography.
- [Component tokens](../src/styles/tokens/components.css): dimensions, artwork, actions, and shadows.
- [Token guidance](../src/styles/tokens/README.md): conventions and validation.
- [Window styles](../src/styles/windows.css), [theme overrides](../src/styles/theme/shell.css), and [responsive styles](../src/styles/responsive.css): component behavior and final styling.
- [Accessibility record](accessibility.md): implementation evidence and remaining checks.
