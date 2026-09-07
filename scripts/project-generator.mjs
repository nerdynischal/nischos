import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

export const iconTones = ['amber', 'blue', 'coral', 'graphite', 'mint', 'rose', 'violet']
const imageExtensions = new Set(['.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'])

export async function inspectProjectDirectory(directory) {
  const root = path.resolve(directory)
  const rootStats = await stat(root)
  if (!rootStats.isDirectory()) throw new Error(`Project path is not a directory: ${root}`)

  const packageJson = await readJsonIfPresent(path.join(root, 'package.json'))
  const readme = await readFirstPresent(root, ['README.md', 'readme.md', 'Readme.md'])
  const html = await readTextIfPresent(path.join(root, 'index.html'))
  const gitConfig = await readTextIfPresent(path.join(root, '.git', 'config'))

  const readmeTitle = readme?.match(/^#\s+(.+)$/m)?.[1]?.trim()
  const htmlTitle = html?.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim()
  const htmlDescription = html
    ?.match(/<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]
    ?.trim()
  const sourceUrl = normalizeRepositoryUrl(
    packageRepository(packageJson?.repository) ?? gitRemote(gitConfig),
  )
  const packageName = packageJson?.name?.replace(/^@[^/]+\//, '')
  const title = packageJson?.displayName ?? htmlTitle ?? readmeTitle ?? titleFromSlug(packageName)
  const id = slugify(packageName ?? path.basename(root))

  return removeUndefinedValues({
    root,
    id,
    title,
    subtitle: packageJson?.description ?? htmlDescription,
    story: firstReadmeParagraph(readme, readmeTitle),
    sourceUrl,
    demoUrl: packageJson?.homepage ?? githubPagesUrl(sourceUrl),
    thumbnailPath: await firstExistingFile(root, [
      'public/icon.svg',
      'public/icon.png',
      'public/favicon.svg',
      'public/favicon.png',
      'src/assets/icon.svg',
      'src/assets/icon.png',
      'src/assets/logo.svg',
      'src/assets/logo.png',
    ]),
    screenshotPaths: await discoverScreenshots(root),
  })
}

export function slugify(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replaceAll("'", '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function nextOrder(manifests, property) {
  const values = manifests
    .map((manifest) => manifest[property])
    .filter((value) => Number.isInteger(value))

  if (values.length === 0) return 10
  return Math.ceil((Math.max(...values) + 1) / 10) * 10
}

export function migrationTimestamp(date = new Date()) {
  return date
    .toISOString()
    .replace(/[-:T]/g, '')
    .slice(0, 14)
}

export function createProjectMigration(manifest) {
  const columns = [
    ['id', sqlText(manifest.id)],
    ['title', sqlText(manifest.title)],
    ['subtitle', sqlText(manifest.subtitle)],
    ['icon_tone', sqlText(manifest.iconTone)],
    ['thumbnail', sqlNullableText(manifest.thumbnail)],
    ['type', sqlText(manifest.type)],
    ['model', sqlText(manifest.model)],
    ['sort_order', String(manifest.sortOrder)],
    ['dock_order', manifest.dockOrder == null ? 'null' : String(manifest.dockOrder)],
    ['story', sqlText(manifest.story)],
    ['screenshots', sqlTextArray(manifest.screenshots)],
    ['demo_url', sqlNullableText(manifest.demoUrl)],
    ['source_url', sqlNullableText(manifest.sourceUrl)],
    ['post_id', sqlNullableText(manifest.postId)],
  ]

  const columnNames = columns.map(([name]) => `  ${name}`).join(',\n')
  const values = columns.map(([, value]) => `  ${value}`).join(',\n')
  const updates = columns
    .slice(1)
    .map(([name]) => `  ${name} = excluded.${name}`)
    .join(',\n')

  return `insert into public.projects (\n${columnNames}\n) values (\n${values}\n)\non conflict (id) do update set\n${updates};\n`
}

function packageRepository(repository) {
  if (typeof repository === 'string') return repository
  return repository?.url
}

function gitRemote(config) {
  if (!config) return undefined
  const origin = config.match(/\[remote "origin"\][\s\S]*?\n\s*url\s*=\s*(.+)/)?.[1]
  return origin?.trim()
}

function normalizeRepositoryUrl(value) {
  if (!value) return undefined

  return value
    .replace(/^git\+/, '')
    .replace(/^git@github\.com:/, 'https://github.com/')
    .replace(/^ssh:\/\/git@github\.com\//, 'https://github.com/')
    .replace(/\.git$/, '')
}

function githubPagesUrl(sourceUrl) {
  const match = sourceUrl?.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/)
  return match ? `https://${match[1]}.github.io/${match[2]}/` : undefined
}

function titleFromSlug(value) {
  if (!value) return undefined
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

function firstReadmeParagraph(readme, heading) {
  if (!readme) return undefined

  const body = heading ? readme.replace(/^#\s+.+$/m, '') : readme
  const blocks = body.split(/\n\s*\n/)
  return blocks
    .map((block) => block.replace(/\s*\n\s*/g, ' ').trim())
    .find((block) => block && !/^(?:#|!\[|\[!|```|[-*] )/.test(block))
}

async function discoverScreenshots(root) {
  const directories = ['screenshots', 'public/screenshots', 'docs/screenshots']
  const screenshots = []

  for (const directory of directories) {
    const absoluteDirectory = path.join(root, directory)
    let entries
    try {
      entries = await readdir(absoluteDirectory, { withFileTypes: true })
    } catch (error) {
      if (error?.code === 'ENOENT') continue
      throw error
    }

    for (const entry of entries) {
      if (entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())) {
        screenshots.push(path.join(absoluteDirectory, entry.name))
      }
    }
  }

  return screenshots.sort()
}

async function firstExistingFile(root, candidates) {
  for (const candidate of candidates) {
    const filePath = path.join(root, candidate)
    try {
      if ((await stat(filePath)).isFile()) return filePath
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
  }
  return undefined
}

async function readJsonIfPresent(filePath) {
  const contents = await readTextIfPresent(filePath)
  return contents ? JSON.parse(contents) : undefined
}

async function readFirstPresent(root, filenames) {
  for (const filename of filenames) {
    const contents = await readTextIfPresent(path.join(root, filename))
    if (contents) return contents
  }
  return undefined
}

async function readTextIfPresent(filePath) {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return undefined
    throw error
  }
}

function removeUndefinedValues(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined))
}

function sqlText(value) {
  return `'${value.replaceAll("'", "''")}'`
}

function sqlNullableText(value) {
  return value ? sqlText(value) : 'null'
}

function sqlTextArray(values) {
  if (values.length === 0) return 'array[]::text[]'
  return `array[${values.map(sqlText).join(', ')}]::text[]`
}
