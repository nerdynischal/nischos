import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createProjectMigration,
  inspectProjectDirectory,
  migrationTimestamp,
  nextOrder,
  slugify,
} from './project-generator.mjs'

const temporaryDirectories = []

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { force: true, recursive: true })),
  )
})

const project = {
  id: 'nischals-project',
  title: "Nischal's Project",
  subtitle: 'A useful tool.',
  iconTone: 'mint',
  type: 'utility',
  model: 'GPT-5.6 Sol',
  sortOrder: 60,
  story: "It's thoughtfully made.",
  screenshots: ["https://example.com/project's-screen.png"],
}

describe('project generator', () => {
  it('creates stable project slugs', () => {
    expect(slugify("  Nischal's Café App  ")).toBe('nischals-cafe-app')
  })

  it('suggests the next available ordering gap', () => {
    expect(nextOrder([], 'sortOrder')).toBe(10)
    expect(nextOrder([{ sortOrder: 10 }, { sortOrder: 24 }], 'sortOrder')).toBe(30)
  })

  it('creates UTC migration timestamps', () => {
    expect(migrationTimestamp(new Date('2026-09-07T16:05:04Z'))).toBe('20260907160504')
  })

  it('creates idempotent SQL with escaped text and explicit nulls', () => {
    const migration = createProjectMigration(project)

    expect(migration).toContain("'Nischal''s Project'")
    expect(migration).toContain("'It''s thoughtfully made.'")
    expect(migration).toContain("array['https://example.com/project''s-screen.png']::text[]")
    expect(migration).toContain('on conflict (id) do update set')
    expect(migration).toContain('  dock_order,')
    expect(migration).toContain('  null,')
    expect(migration).toContain('  post_id = excluded.post_id;')
  })

  it('detects metadata and media from a project directory', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'nischos-project-'))
    temporaryDirectories.push(directory)
    await mkdir(path.join(directory, '.git'))
    await mkdir(path.join(directory, 'public', 'screenshots'), { recursive: true })
    await writeFile(
      path.join(directory, 'package.json'),
      JSON.stringify({ name: 'sample-tool', description: 'Package description.' }),
    )
    await writeFile(path.join(directory, 'README.md'), '# Sample Tool\n\nThe longer project story.\n')
    await writeFile(path.join(directory, 'index.html'), '<title>Sample Tool</title>')
    await writeFile(
      path.join(directory, '.git', 'config'),
      '[remote "origin"]\n  url = git@github.com:nerdynischal/sample-tool.git\n',
    )
    await writeFile(path.join(directory, 'public', 'favicon.svg'), '<svg />')
    await writeFile(path.join(directory, 'public', 'screenshots', 'overview.png'), 'image')

    const detected = await inspectProjectDirectory(directory)

    expect(detected).toMatchObject({
      id: 'sample-tool',
      title: 'Sample Tool',
      subtitle: 'Package description.',
      story: 'The longer project story.',
      sourceUrl: 'https://github.com/nerdynischal/sample-tool',
      demoUrl: 'https://nerdynischal.github.io/sample-tool/',
      thumbnailPath: path.join(directory, 'public', 'favicon.svg'),
      screenshotPaths: [path.join(directory, 'public', 'screenshots', 'overview.png')],
    })
  })
})
