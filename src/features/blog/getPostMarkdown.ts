import type { BlogPost } from '../../content/types'

export function getPostMarkdown(post: BlogPost) {
  const markdown = post.contentMarkdown.trim()
  const [firstLine = '', ...remainingLines] = markdown.split(/\r?\n/)
  const heading = firstLine.match(/^#\s+(.+?)\s*#*\s*$/)?.[1]

  if (heading && normalizeHeading(heading) === normalizeHeading(post.title)) {
    return remainingLines.join('\n').trimStart()
  }

  return markdown
}

function normalizeHeading(value: string) {
  return value.replace(/[*_`]/g, '').trim().toLocaleLowerCase()
}
