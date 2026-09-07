import { access, readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifestsRoot = path.join(projectRoot, 'content', 'projects')
const publicRoot = path.join(projectRoot, 'public')
const schemaPath = path.join(projectRoot, 'content', 'project.schema.json')

const schema = JSON.parse(await readFile(schemaPath, 'utf8'))
const ajv = new Ajv2020({ allErrors: true })
addFormats(ajv)
const validateManifest = ajv.compile(schema)
const filenames = (await readdir(manifestsRoot))
  .filter((filename) => filename.endsWith('.json'))
  .sort()

if (filenames.length === 0) {
  throw new Error('No project manifests found in content/projects.')
}

const manifests = []
const problems = []

for (const filename of filenames) {
  const manifestPath = path.join(manifestsRoot, filename)
  let manifest

  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  } catch (error) {
    problems.push(`${filename}: ${error.message}`)
    continue
  }

  if (!validateManifest(manifest)) {
    for (const error of validateManifest.errors ?? []) {
      problems.push(`${filename}${error.instancePath || '/'}: ${error.message}`)
    }
    continue
  }

  if (filename !== `${manifest.id}.json`) {
    problems.push(`${filename}: filename must match project id (${manifest.id}.json)`)
  }

  manifests.push({ filename, manifest })
}

reportDuplicateValues(manifests, 'id')
reportDuplicateValues(manifests, 'sortOrder')
reportDuplicateValues(
  manifests.filter(({ manifest }) => manifest.dockOrder !== null && manifest.dockOrder !== undefined),
  'dockOrder',
)

const pinnedProjects = manifests.filter(
  ({ manifest }) => manifest.dockOrder !== null && manifest.dockOrder !== undefined,
)
if (pinnedProjects.length > 5) {
  problems.push(`Dock contains ${pinnedProjects.length} projects; the supported maximum is 5`)
}

for (const { filename, manifest } of manifests) {
  const mediaReferences = [manifest.thumbnail, ...manifest.screenshots].filter(Boolean)

  for (const reference of mediaReferences) {
    if (!reference.startsWith('/')) continue

    const assetPath = path.resolve(publicRoot, `.${reference}`)
    if (!assetPath.startsWith(`${publicRoot}${path.sep}`)) {
      problems.push(`${filename}: local media path escapes public/: ${reference}`)
      continue
    }

    try {
      await access(assetPath)
    } catch {
      problems.push(`${filename}: local media file does not exist: ${reference}`)
    }
  }
}

if (problems.length > 0) {
  console.error('Project manifest validation failed:')
  for (const problem of problems) console.error(`  ${problem}`)
  process.exitCode = 1
} else {
  console.log(
    `Project manifests are valid (${manifests.length} projects, ${pinnedProjects.length} dock items).`,
  )
}

function reportDuplicateValues(items, property) {
  const filenamesByValue = new Map()

  for (const { filename, manifest } of items) {
    const value = manifest[property]
    const matchingFiles = filenamesByValue.get(value) ?? []
    matchingFiles.push(filename)
    filenamesByValue.set(value, matchingFiles)
  }

  for (const [value, matchingFiles] of filenamesByValue) {
    if (matchingFiles.length > 1) {
      problems.push(`Duplicate ${property} ${value}: ${matchingFiles.join(', ')}`)
    }
  }
}
