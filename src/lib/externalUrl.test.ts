import { expect, it } from 'vitest'
import { externalUrl } from './externalUrl'

it.each(['javascript:alert(1)', 'data:text/html,hello', '//example.com', '/relative', '', null, 42])('rejects unsafe or incomplete destinations: %s', (value) => {
  expect(externalUrl(value)).toBeUndefined()
})

it('accepts web destinations and trims surrounding whitespace', () => {
  expect(externalUrl(' https://example.com/path?q=1#content ')).toBe('https://example.com/path?q=1#content')
  expect(externalUrl('http://localhost:5173')).toBe('http://localhost:5173')
})
