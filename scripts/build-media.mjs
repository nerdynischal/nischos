import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const publicRoot = path.join(root, 'public')
const outputRoot = path.join(publicRoot, 'optimized')
const manifestPath = path.join(root, 'src/generated/media.json')
const settings = { quality: 88, effort: 4 }
const cacheVersion = JSON.stringify({ settings, sharp: sharp.versions, version: 1 })

async function findImages(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    if (entry.name === 'optimized') return []
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) return findImages(filename)
    return /\.(png|jpe?g|webp)$/i.test(entry.name) ? [filename] : []
  }))
  return files.flat().sort()
}

await mkdir(outputRoot, { recursive: true })
await mkdir(path.dirname(manifestPath), { recursive: true })
let previous = {}
try { previous = JSON.parse(await readFile(manifestPath, 'utf8')) } catch { /* First build. */ }
const available = new Set(await readdir(outputRoot))
const manifest = {}
let generated = 0

for (const filename of await findImages(publicRoot)) {
  const source = `/${path.relative(publicRoot, filename).split(path.sep).join('/')}`
  const input = await readFile(filename)
  const hash = createHash('sha256').update(cacheVersion).update(input).digest('hex').slice(0, 16)
  const cached = previous[source]
  if (cached?.hash === hash && cached.variants.every((item) => available.has(path.basename(item.src)))) {
    manifest[source] = cached
    continue
  }

  const metadata = await sharp(input).metadata()
  if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) continue
  const isIcon = !source.startsWith('/project-media/') || /\/icon\.png$/.test(source)
  const widths = [...new Set((isIcon ? [96, 192, 384] : [320, 640, 1280])
    .map((width) => Math.min(width, metadata.width)))]
  const variants = []
  for (const width of widths) {
    const name = `${hash}-${width}.webp`
    if (!available.has(name)) {
      await sharp(input).resize({ width, withoutEnlargement: true }).webp(settings)
        .toFile(path.join(outputRoot, name))
      available.add(name)
      generated += 1
    }
    variants.push({ src: `/optimized/${name}`, width })
  }
  manifest[source] = { hash, width: metadata.width, height: metadata.height, variants }
}

const contents = `${JSON.stringify(manifest, null, 2)}\n`
if (contents !== `${JSON.stringify(previous, null, 2)}\n`) await writeFile(manifestPath, contents)
console.log(`Responsive media ready (${Object.keys(manifest).length} sources, ${generated} new variants).`)
