import { describe, expect, it } from 'vitest'
import {
  createProjectMigration,
  migrationTimestamp,
  nextOrder,
  slugify,
} from './project-generator.mjs'

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
})
