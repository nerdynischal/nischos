import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

const primitives = readFileSync(new URL('../src/styles/tokens/primitives.css', import.meta.url), 'utf8')
const semantic = readFileSync(new URL('../src/styles/tokens/semantic.css', import.meta.url), 'utf8')
const shell = readFileSync(new URL('../src/styles/theme/shell.css', import.meta.url), 'utf8')
const declarations = (css: string) => Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2]]))
const dark = { ...declarations(primitives), ...declarations(semantic.split(":root[data-theme='light']")[0]) }
const light = { ...dark, ...declarations(semantic.split(":root[data-theme='light']")[1]) }
type Color = [number, number, number, number]
function color(name: string, tokens: Record<string, string>): Color {
  let value = tokens[name]
  for (let i = 0; i < 10 && value.includes('var('); i++) value = value.replace(/var\((--[\w-]+)\)/g, (_, key: string) => tokens[key])
  if (value.startsWith('#')) return [parseInt(value.slice(1, 3), 16), parseInt(value.slice(3, 5), 16), parseInt(value.slice(5, 7), 16), 1]
  const components = value.match(/[\d.]+/g)!.map(Number)
  return [components[0], components[1], components[2], components[3] ?? 1]
}
function over(fg: Color, bg: Color): Color {
  return [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1) as Color
}
function luminance(rgb: Color) {
  return rgb.slice(0, 3).map((n) => n / 255).map((n) => n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [0.2126, 0.7152, 0.0722][i], 0)
}
function ratio(a: Color, b: Color) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (values[0] + 0.05) / (values[1] + 0.05)
}
const filter = shell.match(/\.window\.is-inactive\s*\{[^}]*filter:\s*saturate\(([\d.]+)\) brightness\(([\d.]+)\)/)!
function inactive(rgb: Color): Color {
  const saturation = Number(filter[1]), brightness = Number(filter[2])
  const grey = rgb[0] * 0.213 + rgb[1] * 0.715 + rgb[2] * 0.072
  return rgb.slice(0, 3).map((c) => (grey + (c - grey) * saturation) * brightness).concat(1) as Color
}

it.each([['dark', dark], ['light', light]] as const)('keeps tertiary metadata above 4.5:1 on %s surfaces, including dark inactive windows', (theme, tokens) => {
  const surfaces = ['--surface-base', '--surface-panel', '--surface-panel-strong', '--surface-panel-raised', '--sidebar-bg', '--surface-hover', '--surface-hover-strong', '--surface-selected', '--surface-profile']
  const backgrounds = surfaces.map((name) => [name, color(name, tokens)] as const)
  // Selected Work hover is a translucent surface over the window background.
  backgrounds.push(['file hover', over(color('--surface-soft', tokens), color('--surface-panel', tokens))])
  for (const [name, bg] of backgrounds) {
    expect(ratio(over(color('--text-tertiary', tokens), bg), bg), name).toBeGreaterThanOrEqual(4.5)
    if (theme === 'dark') expect(ratio(inactive(over(color('--text-tertiary-inactive', tokens), bg)), inactive(bg)), `inactive ${name}`).toBeGreaterThanOrEqual(4.5)
  }
})

it('keeps the inactive light Notes pinned label above 4.7:1 on selected and hover surfaces', () => {
  for (const name of ['--sidebar-bg', '--surface-hover', '--surface-selected']) {
    const bg = color(name, light)
    const contrast = ratio(inactive(over(color('--text-pinned-inactive', light), bg)), inactive(bg))
    expect(contrast, name).toBeGreaterThanOrEqual(4.7)
  }
})
