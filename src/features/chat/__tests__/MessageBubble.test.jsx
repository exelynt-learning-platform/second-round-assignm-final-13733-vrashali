/** @jest-environment jsdom */

jest.mock('react-markdown', () => {
  const React = require('react') // eslint-disable-line no-undef -- Jest mock factory runs in Node
  const PropTypes = require('prop-types') // eslint-disable-line no-undef
  function MockMarkdown({ children }) {
    return React.createElement(
      'div',
      { 'data-testid': 'markdown-mock' },
      children,
    )
  }
  MockMarkdown.propTypes = { children: PropTypes.node }
  return MockMarkdown
})

jest.mock('remark-gfm', () => () => ({}))

import { render, screen } from '@testing-library/react'
import MessageBubble from '../MessageBubble'

describe('MessageBubble', () => {
  const base = {
    id: 'm1',
    content: 'hello',
    timestamp: new Date('2026-03-30T12:34:56.000Z').toISOString(),
  }

  it('renders user message aligned to the end', () => {
    const { container } = render(
      <MessageBubble {...base} role="user" />,
    )
    const row = container.querySelector('[data-message-id="m1"]')
    expect(row.className).toContain('justify-end')
  })

  it('renders assistant message aligned to the start', () => {
    const { container } = render(
      <MessageBubble {...base} role="assistant" />,
    )
    const row = container.querySelector('[data-message-id="m1"]')
    expect(row.className).toContain('justify-start')
  })

  it('renders assistant content inside markdown container', () => {
    render(
      <MessageBubble
        {...base}
        role="assistant"
        content={'line1\n\nline2'}
      />,
    )
    const md = screen.getByTestId('markdown-mock')
    expect(md).toHaveTextContent('line1')
    expect(md).toHaveTextContent('line2')
  })
})
