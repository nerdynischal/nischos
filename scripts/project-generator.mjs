export const iconTones = ['amber', 'blue', 'coral', 'graphite', 'mint', 'rose', 'violet']

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
