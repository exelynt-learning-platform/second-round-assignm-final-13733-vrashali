/** @jest-environment jsdom */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MessageInput from '../MessageInput'

describe('MessageInput', () => {
  it('renders placeholder', () => {
    const onSend = jest.fn()
    render(<MessageInput onSend={onSend} disabled={false} />)
    expect(screen.getByPlaceholderText('Type a message...')).toBeInTheDocument()
  })

  it('types, submits on Enter, and clears input', async () => {
    const user = userEvent.setup()
    const onSend = jest.fn()
    render(<MessageInput onSend={onSend} disabled={false} />)

    const input = screen.getByRole('textbox', { name: /message input/i })
    await user.type(input, 'hello{enter}')

    expect(onSend).toHaveBeenCalledWith('hello')
    expect(input).toHaveValue('')
  })

  it('Shift+Enter inserts newline instead of sending', async () => {
    const user = userEvent.setup()
    const onSend = jest.fn()
    render(<MessageInput onSend={onSend} disabled={false} />)
    const input = screen.getByRole('textbox', { name: /message input/i })
    await user.type(input, 'a{shift>}{enter}{/shift}b')
    expect(onSend).not.toHaveBeenCalled()
    expect(input.value.includes('\n')).toBe(true)
  })

  it('disables input and send when loading', () => {
    const onSend = jest.fn()
    render(<MessageInput onSend={onSend} disabled />)

    const btn = screen.getByRole('button', { name: /send message/i })
    expect(btn).toBeDisabled()

    const input = screen.getByRole('textbox', { name: /message input/i })
    expect(input).toBeDisabled()
    expect(onSend).not.toHaveBeenCalled()
  })
})
