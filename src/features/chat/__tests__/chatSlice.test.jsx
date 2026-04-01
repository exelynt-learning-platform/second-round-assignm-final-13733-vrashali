/** @jest-environment jsdom */

jest.mock('../../../services/openaiApi.js', () => ({
  sendMessage: jest.fn(),
  OPENAI_MODEL: 'gpt-4o-mini',
}))

import { configureStore } from '@reduxjs/toolkit'
import chatReducer, {
  addMessage,
  clearChat,
  clearError,
  sendMessage,
  setError,
  setLoading,
} from '../chatSlice'
import * as openaiApi from '../../../services/openaiApi.js'

function createTestStore(preloaded) {
  return configureStore({
    reducer: { chat: chatReducer },
    preloadedState: preloaded ? { chat: preloaded } : undefined,
  })
}

describe('chatSlice reducers', () => {
  const baseMsg = {
    id: '1',
    role: 'user',
    content: 'hi',
    timestamp: new Date().toISOString(),
  }

  it('addMessage appends message and updates conversationHistory', () => {
    const store = createTestStore()
    store.dispatch(addMessage(baseMsg))
    const state = store.getState().chat
    expect(state.messages).toHaveLength(1)
    expect(state.messages[0]).toEqual(baseMsg)
    expect(state.conversationHistory).toEqual([{ role: 'user', content: 'hi' }])
  })

  it('setLoading toggles loading', () => {
    const store = createTestStore()
    store.dispatch(setLoading(true))
    expect(store.getState().chat.loading).toBe(true)
    store.dispatch(setLoading(false))
    expect(store.getState().chat.loading).toBe(false)
  })

  it('setError and clearError', () => {
    const store = createTestStore()
    store.dispatch(setError('boom'))
    expect(store.getState().chat.error).toBe('boom')
    store.dispatch(clearError())
    expect(store.getState().chat.error).toBeNull()
  })

  it('setError coerces empty string to null', () => {
    const store = createTestStore()
    store.dispatch(setError(''))
    expect(store.getState().chat.error).toBeNull()
  })

  it('clearChat resets conversation', () => {
    const store = createTestStore({
      messages: [baseMsg],
      loading: true,
      error: 'x',
      conversationHistory: [{ role: 'user', content: 'hi' }],
      streamingMessageId: 'stream-1',
    })
    store.dispatch(clearChat())
    expect(store.getState().chat).toEqual({
      messages: [],
      loading: false,
      error: null,
      conversationHistory: [],
      streamingMessageId: null,
    })
  })
})

describe('sendMessage thunk', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('dispatches user + assistant messages on success (streaming)', async () => {
    openaiApi.sendMessage.mockImplementation(async (hist, opts) => {
      if (opts?.onDelta) opts.onDelta('Hello!')
      return 'Hello!'
    })

    const store = createTestStore()
    await store.dispatch(sendMessage('Hi there'))

    const { messages, loading, error, conversationHistory } = store.getState().chat
    expect(loading).toBe(false)
    expect(error).toBeNull()
    expect(messages).toHaveLength(2)
    expect(messages[0].role).toBe('user')
    expect(messages[0].content).toBe('Hi there')
    expect(messages[1].role).toBe('assistant')
    expect(messages[1].content).toBe('Hello!')
    expect(conversationHistory).toEqual([
      { role: 'user', content: 'Hi there' },
      { role: 'assistant', content: 'Hello!' },
    ])
    expect(openaiApi.sendMessage).toHaveBeenCalledWith(
      [{ role: 'user', content: 'Hi there' }],
      expect.objectContaining({
        onDelta: expect.any(Function),
      }),
    )
  })

  it('dispatches setError on failure', async () => {
    openaiApi.sendMessage.mockRejectedValue(
      new Error('Rate limit reached. Please wait a moment.'),
    )

    const store = createTestStore()
    await store.dispatch(sendMessage('oops'))

    const { messages, loading, error } = store.getState().chat
    expect(loading).toBe(false)
    expect(error).toBe('Rate limit reached. Please wait a moment.')
    expect(messages).toHaveLength(1)
    expect(messages[0].role).toBe('user')
  })

  it('only keeps last 30 turns for API payload', async () => {
    openaiApi.sendMessage.mockImplementation(async (hist, opts) => {
      if (opts?.onDelta) opts.onDelta('ok')
      return 'ok'
    })

    const history = Array.from({ length: 35 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `m${i}`,
    }))

    const messages = history.map((h, i) => ({
      id: `id-${i}`,
      ...h,
      timestamp: new Date().toISOString(),
    }))

    const store = createTestStore({
      messages,
      loading: false,
      error: null,
      conversationHistory: history.map((h) => ({ role: h.role, content: h.content })),
      streamingMessageId: null,
    })

    await store.dispatch(sendMessage('next'))

    const arg = openaiApi.sendMessage.mock.calls[0][0]
    expect(arg).toHaveLength(30)
    expect(arg[0].content).toBe('m6')
    expect(arg[29].content).toBe('next')
  })
})
