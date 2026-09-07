import { access, copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import {
  createProjectMigration,
  iconTones,
  inspectProjectDirectory,
  migrationTimestamp,
  nextOrder,
  slugify,
} from './project-generator.mjs'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestsRoot = path.join(projectRoot, 'content', 'projects')
const migrationsRoot = path.join(projectRoot, 'supabase', 'migrations')
const publicRoot = path.join(projectRoot, 'public')
const schemaPath = path.join(projectRoot, 'content', 'project.schema.json')

try {
  const options = parseOptions(process.argv.slice(2))
  if (options.help) {
    printHelp()
    process.exit(0)
  }

  const existingManifests = await readExistingManifests()
  const detected = options.directory
    ? await inspectProjectDirectory(options.directory)
    : undefined
  if (detected) printDetectedMetadata(detected)

  const generated = options.from
    ? { manifest: JSON.parse(await readFile(path.resolve(options.from), 'utf8')), mediaCopies: [] }
    : await promptForManifest(existingManifests, detected)
  const { manifest, mediaCopies } = generated

  const pendingMedia = new Set(mediaCopies.map(({ reference }) => reference))
  const problems = await validateCandidate(manifest, existingManifests, pendingMedia)
  if (problems.length > 0) {
    throw new Error(`Project was not created:\n${problems.map((problem) => `  - ${problem}`).join('\n')}`)
  }

  const manifestPath = path.join(manifestsRoot, `${manifest.id}.json`)
  const migrationFilename = `${migrationTimestamp()}_add_${manifest.id.replaceAll('-', '_')}_project.sql`
  const migrationPath = path.join(migrationsRoot, migrationFilename)
  const manifestContents = `${JSON.stringify(manifest, null, 2)}\n`
  const migrationContents = createProjectMigration(manifest)

  if (options.dryRun) {
    console.log(`Would create ${path.relative(projectRoot, manifestPath)}:\n`)
    console.log(manifestContents)
    console.log(`Would create ${path.relative(projectRoot, migrationPath)}:\n`)
    console.log(migrationContents)
    for (const media of mediaCopies) {
      console.log(
        `Would copy ${media.source} to ${path.relative(projectRoot, media.destination)}`,
      )
    }
  } else {
    await ensureMissing(manifestPath, 'manifest')
    await ensureMissing(migrationPath, 'migration')
    for (const media of mediaCopies) await ensureMissing(media.destination, 'media file')

    await writeFile(manifestPath, manifestContents, { flag: 'wx' })

    try {
      await writeFile(migrationPath, migrationContents, { flag: 'wx' })
    } catch (error) {
      console.error(`Manifest created at ${path.relative(projectRoot, manifestPath)}.`)
      throw error
    }

    for (const media of mediaCopies) {
      await mkdir(path.dirname(media.destination), { recursive: true })
      await copyFile(media.source, media.destination, constants.COPYFILE_EXCL)
      console.log(`Copied ${path.relative(projectRoot, media.destination)}`)
    }

    console.log(`Created ${path.relative(projectRoot, manifestPath)}`)
    console.log(`Created ${path.relative(projectRoot, migrationPath)}`)
    console.log('\nNext: add any local media, run npm run check, then apply the migration in Supabase.')
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}

async function promptForManifest(existingManifests, detected = {}) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  const suggestedSortOrder = nextOrder(existingManifests, 'sortOrder')
  const pinnedProjects = existingManifests.filter((manifest) => manifest.dockOrder != null)

  try {
    const title = await requiredAnswer(
      prompt,
      questionWithDefault('Title', detected.title),
      detected.title,
    )
    const suggestedId = detected.id ?? slugify(title)
    const id = await requiredAnswer(prompt, `ID (${suggestedId}): `, suggestedId)
    const subtitle = await requiredAnswer(
      prompt,
      questionWithDefault('Short description', detected.subtitle),
      detected.subtitle,
    )
    const type = await requiredAnswer(prompt, 'Type (web app): ', 'web app')
    const model = await requiredAnswer(prompt, 'Model used (GPT-5.6 Sol): ', 'GPT-5.6 Sol')
    const iconTone = await enumAnswer(
      prompt,
      `Icon tone [${iconTones.join(', ')}] (graphite): `,
      iconTones,
      'graphite',
    )
    const thumbnailInput = await optionalAnswer(
      prompt,
      questionWithDefault('Thumbnail URL or image file', detected.thumbnailPath, true),
      detected.thumbnailPath,
    )
    const story = await requiredAnswer(
      prompt,
      questionWithDefault('Project story', detected.story),
      detected.story,
    )
    const screenshotInputs = splitList(
      await optionalAnswer(
        prompt,
        questionWithDefault(
          'Screenshot URLs or image files, comma-separated',
          detected.screenshotPaths?.join(', '),
          true,
        ),
        detected.screenshotPaths?.join(', '),
      ),
    )
    const demoUrl = await optionalAnswer(
      prompt,
      questionWithDefault('Website URL', detected.demoUrl, true),
      detected.demoUrl,
    )
    const sourceUrl = await optionalAnswer(
      prompt,
      questionWithDefault('Source URL', detected.sourceUrl, true),
      detected.sourceUrl,
    )
    const postId = await optionalAnswer(prompt, 'Related note ID (optional): ')
    const sortOrder = await integerAnswer(
      prompt,
      `Desktop order (${suggestedSortOrder}): `,
      suggestedSortOrder,
    )

    let dockOrder
    if (pinnedProjects.length >= 5) {
      console.log('Dock is full (5 projects), so this project will be desktop-only.')
    } else if (await yesNoAnswer(prompt, 'Pin this project to the dock? (y/N): ')) {
      const suggestedDockOrder = nextOrder(existingManifests, 'dockOrder')
      dockOrder = await integerAnswer(
        prompt,
        `Dock order (${suggestedDockOrder}): `,
        suggestedDockOrder,
      )
    }

    const { references, mediaCopies } = await prepareMedia(
      id,
      [thumbnailInput, ...screenshotInputs],
      detected.root,
    )
    const [thumbnail, ...screenshots] = references

    return {
      manifest: removeUndefinedValues({
        $schema: '../project.schema.json',
        id,
        title,
        subtitle,
        iconTone,
        thumbnail,
        type,
        model,
        sortOrder,
        dockOrder,
        story,
        screenshots,
        demoUrl,
        sourceUrl,
        postId,
      }),
      mediaCopies,
    }
  } finally {
    prompt.close()
  }
}

async function validateCandidate(manifest, existingManifests, pendingMedia = new Set()) {
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'))
  const ajv = new Ajv2020({ allErrors: true })
  addFormats(ajv)
  const validate = ajv.compile(schema)
  const problems = []

  if (!validate(manifest)) {
    for (const error of validate.errors ?? []) {
      problems.push(`${error.instancePath || '/'}: ${error.message}`)
    }
    return problems
  }

  if (existingManifests.some(({ id }) => id === manifest.id)) {
    problems.push(`a manifest with id "${manifest.id}" already exists`)
  }
  if (existingManifests.some(({ sortOrder }) => sortOrder === manifest.sortOrder)) {
    problems.push(`desktop order ${manifest.sortOrder} is already in use`)
  }
  if (
    manifest.dockOrder != null &&
    existingManifests.some(({ dockOrder }) => dockOrder === manifest.dockOrder)
  ) {
    problems.push(`dock order ${manifest.dockOrder} is already in use`)
  }
  if (
    manifest.dockOrder != null &&
    existingManifests.filter(({ dockOrder }) => dockOrder != null).length >= 5
  ) {
    problems.push('the dock already contains the supported maximum of 5 projects')
  }

  for (const reference of [manifest.thumbnail, ...manifest.screenshots].filter(Boolean)) {
    if (!reference.startsWith('/')) continue
    const assetPath = path.resolve(publicRoot, `.${reference}`)

    if (!assetPath.startsWith(`${publicRoot}${path.sep}`)) {
      problems.push(`local media path escapes public/: ${reference}`)
      continue
    }

    if (pendingMedia.has(reference)) continue

    try {
      await access(assetPath)
    } catch {
      problems.push(`local media file does not exist: ${reference}`)
    }
  }

  return problems
}

async function readExistingManifests() {
  const filenames = (await readdir(manifestsRoot)).filter((filename) => filename.endsWith('.json'))
  return Promise.all(
    filenames.map(async (filename) =>
      JSON.parse(await readFile(path.join(manifestsRoot, filename), 'utf8')),
    ),
  )
}

async function ensureMissing(filePath, label) {
  try {
    await access(filePath)
    throw new Error(`Refusing to overwrite existing ${label}: ${path.relative(projectRoot, filePath)}`)
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
  }
}

async function requiredAnswer(prompt, question, fallback) {
  while (true) {
    const answer = (await prompt.question(question)).trim() || fallback
    if (answer) return answer
    console.log('A value is required.')
  }
}

async function optionalAnswer(prompt, question, fallback) {
  const answer = (await prompt.question(question)).trim()
  if (answer === '-') return undefined
  return answer || fallback || undefined
}

async function integerAnswer(prompt, question, fallback) {
  while (true) {
    const answer = (await prompt.question(question)).trim()
    const value = answer === '' ? fallback : Number(answer)
    if (Number.isInteger(value) && value >= 0) return value
    console.log('Enter a whole number of zero or greater.')
  }
}

async function enumAnswer(prompt, question, values, fallback) {
  while (true) {
    const answer = (await prompt.question(question)).trim() || fallback
    if (values.includes(answer)) return answer
    console.log(`Choose one of: ${values.join(', ')}.`)
  }
}

async function yesNoAnswer(prompt, question) {
  const answer = (await prompt.question(question)).trim().toLowerCase()
  return answer === 'y' || answer === 'yes'
}

function splitList(value) {
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : []
}

function removeUndefinedValues(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined))
}

function parseOptions(args) {
  const options = { directory: undefined, dryRun: false, from: undefined, help: false }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--dry-run') options.dryRun = true
    else if (argument === '--help' || argument === '-h') options.help = true
    else if (argument === '--from') {
      options.from = args[index + 1]
      index += 1
      if (!options.from) throw new Error('--from requires a JSON file path')
    } else if (argument.startsWith('-')) {
      throw new Error(`Unknown option: ${argument}`)
    } else if (options.directory) {
      throw new Error('Only one project directory can be provided')
    } else {
      options.directory = argument
    }
  }

  if (options.directory && options.from) {
    throw new Error('Use either a project directory or --from, not both')
  }

  return options
}

function printHelp() {
  console.log(`Create a project manifest and matching Supabase migration.

Usage:
  npm run project:add
  npm run project:add -- /path/to/project
  npm run project:add -- --from ./project.json
  npm run project:add -- --from ./project.json --dry-run

Options:
  <directory>    Inspect a local project and use detected metadata as defaults
  --from <path>  Read metadata from a project manifest instead of prompting
  --dry-run      Print the generated files without writing them
  -h, --help     Show this help`)
}

async function prepareMedia(id, inputs, detectedRoot) {
  const references = []
  const mediaCopies = []
  const destinationNames = new Set()

  for (const input of inputs) {
    if (!input || input.startsWith('https://') || input.startsWith('/project-media/')) {
      references.push(input)
      continue
    }

    const source = path.resolve(detectedRoot ?? process.cwd(), input)
    await access(source)
    const extension = path.extname(source).toLowerCase()
    if (!['.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'].includes(extension)) {
      throw new Error(`Unsupported project image: ${source}`)
    }

    const destinationName = path.basename(source)
    if (destinationNames.has(destinationName)) {
      throw new Error(`Two project images use the filename ${destinationName}`)
    }
    destinationNames.add(destinationName)

    const reference = `/project-media/${id}/${destinationName}`
    references.push(reference)
    mediaCopies.push({
      source,
      destination: path.join(publicRoot, 'project-media', id, destinationName),
      reference,
    })
  }

  return { references, mediaCopies }
}

function questionWithDefault(label, fallback, optional = false) {
  if (fallback) return `${label} (${fallback}${optional ? '; - to omit' : ''}): `
  return `${label}${optional ? ' (optional)' : ''}: `
}

function printDetectedMetadata(detected) {
  const fields = [
    ['title', detected.title],
    ['description', detected.subtitle],
    ['website', detected.demoUrl],
    ['source', detected.sourceUrl],
    ['thumbnail', detected.thumbnailPath],
    ['screenshots', detected.screenshotPaths?.length ? detected.screenshotPaths.length : undefined],
  ].filter(([, value]) => value)

  console.log(`\nInspected ${detected.root}`)
  for (const [label, value] of fields) console.log(`  ${label}: ${value}`)
  console.log('')
}
