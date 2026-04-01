/**
 * Tests for chatSlice.js Redux reducers and actions
 */

// Mock openaiApi to avoid import.meta issue
jest.mock('../../services/openaiApi', () => ({
  sendMessage: jest.fn(),
}))

import chatReducer, {
  addMessage,
  patchMessageContent,
  pushConversationTurn,
  removeMessage,
  setLoading,
  setError,
  clearError,
  clearChat,
} from './chatSlice'

const initialState = {
  messages: [],
  loading: false,
  error: null,
  conversationHistory: [],
  streamingMessageId: null,
}

describe('chatSlice reducers', () => {

  // Test 1: Initial state
  test('returns correct initial state', () => {
    expect(chatReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  // Test 2: Add user message
  test('addMessage adds message to state', () => {
    const message = {
      id: '123', role: 'user',
      content: 'Hello', timestamp: '2024-01-01T00:00:00.000Z'
    }
    const state = chatReducer(initialState, addMessage(message))
    expect(state.messages).toHaveLength(1)
    expect(state.messages[0].content).toBe('Hello')
  })

  // Test 3: Add to conversation history
  test('addMessage adds to conversationHistory', () => {
    const message = {
      id: '123', role: 'user',
      content: 'Hello', timestamp: '2024-01-01T00:00:00.000Z'
    }
    const state = chatReducer(initialState, addMessage(message))
    expect(state.conversationHistory).toHaveLength(1)
  })

  // Test 4: Skip conversation history
  test('skipConversationHistory prevents history entry', () => {
    const message = {
      id: '123', role: 'assistant', content: '',
      timestamp: '2024-01-01T00:00:00.000Z', skipConversationHistory: true
    }
    const state = chatReducer(initialState, addMessage(message))
    expect(state.conversationHistory).toHaveLength(0)
  })

  // Test 5: Patch message content
  test('patchMessageContent updates message', () => {
    const stateWithMessage = {
      ...initialState,
      messages: [{ id: '123', role: 'assistant', content: '', timestamp: '' }]
    }
    const state = chatReducer(
      stateWithMessage,
      patchMessageContent({ id: '123', content: 'Updated!' })
    )
    expect(state.messages[0].content).toBe('Updated!')
  })

  // Test 6: Remove message
  test('removeMessage removes correct message', () => {
    const stateWithMessage = {
      ...initialState,
      messages: [{ id: '123', role: 'user', content: 'Hi', timestamp: '' }]
    }
    const state = chatReducer(stateWithMessage, removeMessage('123'))
    expect(state.messages).toHaveLength(0)
  })

  // Test 7: Set loading true
  test('setLoading sets loading to true', () => {
    const state = chatReducer(initialState, setLoading(true))
    expect(state.loading).toBe(true)
  })

  // Test 8: Set loading false
  test('setLoading sets loading to false', () => {
    const state = chatReducer({ ...initialState, loading: true }, setLoading(false))
    expect(state.loading).toBe(false)
  })

  // Test 9: Set error
  test('setError stores error message', () => {
    const state = chatReducer(initialState, setError('API failed'))
    expect(state.error).toBe('API failed')
  })

  // Test 10: Clear error
  test('clearError resets error to null', () => {
    const state = chatReducer({ ...initialState, error: 'Some error' }, clearError())
    expect(state.error).toBeNull()
  })

  // Test 11: Clear chat
  test('clearChat resets to initial state', () => {
    const dirtyState = {
      messages: [{ id: '1', role: 'user', content: 'Hi', timestamp: '' }],
      loading: true, error: 'error',
      conversationHistory: [{ role: 'user', content: 'Hi' }],
      streamingMessageId: '1',
    }
    expect(chatReducer(dirtyState, clearChat())).toEqual(initialState)
  })

  // Test 12: Push conversation turn
  test('pushConversationTurn adds to history', () => {
    const state = chatReducer(
      initialState,
      pushConversationTurn({ role: 'assistant', content: 'Hello!' })
    )
    expect(state.conversationHistory[0].content).toBe('Hello!')
  })
})