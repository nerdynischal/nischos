import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'
import {
  createProjectMigration,
  iconTones,
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
  const manifest = options.from
    ? JSON.parse(await readFile(path.resolve(options.from), 'utf8'))
    : await promptForManifest(existingManifests)

  const problems = await validateCandidate(manifest, existingManifests)
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
  } else {
    await ensureMissing(manifestPath, 'manifest')
    await ensureMissing(migrationPath, 'migration')
    await writeFile(manifestPath, manifestContents, { flag: 'wx' })

    try {
      await writeFile(migrationPath, migrationContents, { flag: 'wx' })
    } catch (error) {
      console.error(`Manifest created at ${path.relative(projectRoot, manifestPath)}.`)
      throw error
    }

    console.log(`Created ${path.relative(projectRoot, manifestPath)}`)
    console.log(`Created ${path.relative(projectRoot, migrationPath)}`)
    console.log('\nNext: add any local media, run npm run check, then apply the migration in Supabase.')
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}

async function promptForManifest(existingManifests) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  const suggestedSortOrder = nextOrder(existingManifests, 'sortOrder')
  const pinnedProjects = existingManifests.filter((manifest) => manifest.dockOrder != null)

  try {
    const title = await requiredAnswer(prompt, 'Title: ')
    const suggestedId = slugify(title)
    const id = await requiredAnswer(prompt, `ID (${suggestedId}): `, suggestedId)
    const subtitle = await requiredAnswer(prompt, 'Short description: ')
    const type = await requiredAnswer(prompt, 'Type (for example, Fitness): ')
    const model = await requiredAnswer(prompt, 'Model used: ')
    const iconTone = await enumAnswer(
      prompt,
      `Icon tone [${iconTones.join(', ')}] (graphite): `,
      iconTones,
      'graphite',
    )
    const thumbnail = await optionalAnswer(prompt, 'Thumbnail URL or /project-media path (optional): ')
    const story = await requiredAnswer(prompt, 'Project story: ')
    const screenshots = splitList(
      await optionalAnswer(prompt, 'Screenshot URLs or paths, comma-separated (optional): '),
    )
    const demoUrl = await optionalAnswer(prompt, 'Website URL (optional): ')
    const sourceUrl = await optionalAnswer(prompt, 'Source URL (optional): ')
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

    return removeUndefinedValues({
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
    })
  } finally {
    prompt.close()
  }
}

async function validateCandidate(manifest, existingManifests) {
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

async function optionalAnswer(prompt, question) {
  const answer = (await prompt.question(question)).trim()
  return answer || undefined
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
  const options = { dryRun: false, from: undefined, help: false }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--dry-run') options.dryRun = true
    else if (argument === '--help' || argument === '-h') options.help = true
    else if (argument === '--from') {
      options.from = args[index + 1]
      index += 1
      if (!options.from) throw new Error('--from requires a JSON file path')
    } else {
      throw new Error(`Unknown option: ${argument}`)
    }
  }

  return options
}

function printHelp() {
  console.log(`Create a project manifest and matching Supabase migration.

Usage:
  npm run project:add
  npm run project:add -- --from ./project.json
  npm run project:add -- --from ./project.json --dry-run

Options:
  --from <path>  Read metadata from a project manifest instead of prompting
  --dry-run      Print the generated files without writing them
  -h, --help     Show this help`)
}
