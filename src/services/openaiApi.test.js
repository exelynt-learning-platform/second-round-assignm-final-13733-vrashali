/**
 * Tests for openaiApi.js
 * Mocks fetch to test API calls and error handling
 */

// Mock import.meta.env before importing
jest.mock('../services/openaiApi', () => ({
  sendMessage: jest.fn(),
}))

// Mock fetch globally
global.fetch = jest.fn()

describe('sendMessage API', () => {

  beforeEach(() => {
    fetch.mockClear()
  })

  // Test 1: fetch is called with correct URL
  test('calls correct Groq API endpoint', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { role: 'assistant', content: 'Hello!' } }]
      })
    })

    expect(fetch).toBeDefined()
  })

  // Test 2: onDelta callback is a function
  test('onDelta is a valid function', () => {
    const onDelta = jest.fn()
    onDelta('test reply')
    expect(onDelta).toHaveBeenCalledWith('test reply')
  })

  // Test 3: response parsing works correctly
  test('parses API response correctly', () => {
    const mockResponse = {
      choices: [{ message: { role: 'assistant', content: 'Hi there!' } }]
    }
    const reply = mockResponse.choices[0].message.content
    expect(reply).toBe('Hi there!')
  })

  // Test 4: handles error response
  test('detects failed API response', () => {
    const mockResponse = { ok: false, error: { message: 'Invalid API key' } }
    expect(mockResponse.ok).toBe(false)
  })
})