import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

// Explicit refresh step: normal builds stay offline and reproducible.
const root = path.resolve(import.meta.dirname, '..')
const directory = path.join(root, 'content/projects')
const output = path.join(root, 'public/project-media/remote')
await mkdir(output, { recursive: true })
const aliases = {}
for (const filename of (await readdir(directory)).filter((name) => name.endsWith('.json')).sort()) {
  const project = JSON.parse(await readFile(path.join(directory, filename), 'utf8'))
  for (const source of [project.thumbnail, ...project.screenshots]) {
    if (!source || !/^https:\/\/.+\.(png|jpe?g|webp)$/i.test(source) || aliases[source]) continue
    const response = await fetch(source, { signal: AbortSignal.timeout(30000) })
    if (!response.ok) throw new Error(`Unable to download ${source}: ${response.status}`)
    const input = Buffer.from(await response.arrayBuffer())
    const metadata = await sharp(input).metadata()
    if (!metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) {
      throw new Error(`Expected a static raster image: ${source}`)
    }
    const name = `${createHash('sha256').update(source).digest('hex').slice(0, 16)}${path.extname(new URL(source).pathname)}`
    await writeFile(path.join(output, name), input)
    aliases[source] = `/project-media/remote/${name}`
    console.log(`${project.id}: ${metadata.width}×${metadata.height}, ${input.length} bytes`)
  }
}
await writeFile(path.join(root, 'content/remote-media.json'), `${JSON.stringify(aliases, null, 2)}\n`)
