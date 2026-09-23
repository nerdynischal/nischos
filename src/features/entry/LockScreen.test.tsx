// @vitest-environment jsdom
import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'
import { LockScreen } from './LockScreen'

it('derives the unlock name from all visible wording for speech input', () => {
  const container = document.createElement('div')
  container.innerHTML = renderToStaticMarkup(
    <LockScreen isLoading={false} isExiting={false} onEnter={() => {}} onExitComplete={() => {}} />,
  )
  const button = container.querySelector('button')!
  expect(button.hasAttribute('aria-label')).toBe(false)
  expect(button.hasAttribute('aria-labelledby')).toBe(false)
  expect(button.querySelector('.lock-screen-name')?.textContent).toBe('nischOS')
  expect(button.querySelector('.lock-screen-hint')?.textContent).toBe('Click to Unlock')
  expect(button.querySelector('img')?.alt).toBe('')
})
