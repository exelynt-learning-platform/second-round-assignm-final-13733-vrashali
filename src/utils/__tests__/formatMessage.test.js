import { normalizeMessageContent, splitMessageLines } from '../formatMessage.js'

describe('formatMessage', () => {
  it('normalizeMessageContent trims end-only and normalizes newlines', () => {
    expect(normalizeMessageContent('a\r\nb  \n')).toBe('a\nb')
  })

  it('splitMessageLines splits on newlines', () => {
    expect(splitMessageLines('x\ny')).toEqual(['x', 'y'])
  })
})
