import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const stylesRoot = path.join(projectRoot, 'src', 'styles')
const sourceRoot = path.join(projectRoot, 'src')

const tokenFiles = new Set([
  path.join(stylesRoot, 'tokens', 'primitives.css'),
  path.join(stylesRoot, 'tokens', 'semantic.css'),
  path.join(stylesRoot, 'tokens', 'components.css'),
])

async function collectFiles(directory, extensions) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) return collectFiles(entryPath, extensions)
      return extensions.has(path.extname(entry.name)) ? [entryPath] : []
    }),
  )

  return files.flat()
}

function addOccurrence(map, name, file) {
  const occurrences = map.get(name) ?? []
  occurrences.push(file)
  map.set(name, occurrences)
}

const cssFiles = await collectFiles(sourceRoot, new Set(['.css']))
const sourceFiles = await collectFiles(sourceRoot, new Set(['.ts', '.tsx']))
const definitions = new Map()
const references = new Map()
const runtimeDefinitions = new Set()
const rootDefinitions = new Map()

for (const file of cssFiles) {
  const source = await readFile(file, 'utf8')

  for (const match of source.matchAll(/(^|[;{]\s*)--([\w-]+)\s*:/gm)) {
    addOccurrence(definitions, match[2], file)
  }

  for (const match of source.matchAll(/var\(\s*--([\w-]+)/g)) {
    addOccurrence(references, match[1], file)
  }

  if (!tokenFiles.has(file)) continue

  for (const rootBlock of source.matchAll(/:root\s*\{([^}]*)\}/gs)) {
    for (const definition of rootBlock[1].matchAll(/--([\w-]+)\s*:/g)) {
      addOccurrence(rootDefinitions, definition[1], file)
    }
  }
}

for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8')

  for (const match of source.matchAll(/['"]--([\w-]+)['"]/g)) {
    runtimeDefinitions.add(match[1])
  }
}

const unresolvedReferences = [...references.keys()]
  .filter((name) => !definitions.has(name) && !runtimeDefinitions.has(name))
  .sort()
const unusedRootTokens = [...rootDefinitions.keys()]
  .filter((name) => !references.has(name))
  .sort()
const duplicateRootTokens = [...rootDefinitions.entries()]
  .filter(([, files]) => files.length > 1)
  .map(([name]) => name)
  .sort()

const problems = [
  ['Unresolved custom properties', unresolvedReferences],
  ['Unused root tokens', unusedRootTokens],
  ['Duplicate root tokens', duplicateRootTokens],
].filter(([, names]) => names.length > 0)

if (problems.length > 0) {
  for (const [label, names] of problems) {
    console.error(`${label}:`)
    for (const name of names) console.error(`  --${name}`)
  }

  process.exitCode = 1
} else {
  console.log(
    `CSS tokens are consistent (${rootDefinitions.size} root tokens, ${runtimeDefinitions.size} runtime properties).`,
  )
}
