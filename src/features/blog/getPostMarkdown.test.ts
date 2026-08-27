import { describe, expect, it } from 'vitest'
import type { BlogPost } from '../../content'
import { getPostMarkdown } from './getPostMarkdown'

function post(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id: 'post',
    title: 'A test post',
    date: '2026-07-23',
    folder: 'Notes',
    isPinned: false,
    contentMarkdown: 'Body copy.',
    ...overrides,
  }
}

describe('getPostMarkdown', () => {
  it('removes a leading H1 that duplicates the stored post title', () => {
    expect(
      getPostMarkdown(post({ contentMarkdown: '# A test post\n\nBody copy.' })),
    ).toBe('Body copy.')
  })

  it('keeps a leading H1 when it is part of the article body', () => {
    expect(
      getPostMarkdown(post({ contentMarkdown: '# A different heading\n\nBody copy.' })),
    ).toBe('# A different heading\n\nBody copy.')
  })
})
