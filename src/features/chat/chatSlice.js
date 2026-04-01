import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import * as openaiApi from '../../services/openaiApi'

const initialState = {
  messages: [],
  loading: false,
  error: null,
  conversationHistory: [],
  streamingMessageId: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const {
        id,
        role,
        content,
        timestamp,
        skipConversationHistory,
      } = action.payload
      state.messages.push({ id, role, content, timestamp })
      if (
        skipConversationHistory !== true &&
        (role === 'user' || role === 'assistant')
      ) {
        state.conversationHistory.push({ role, content })
      }
    },
    patchMessageContent: (state, action) => {
      const { id, content } = action.payload
      const msg = state.messages.find((m) => m.id === id)
      if (msg) msg.content = content
    },
    pushConversationTurn: (state, action) => {
      const { role, content } = action.payload
      if (role === 'user' || role === 'assistant') {
        state.conversationHistory.push({ role, content })
      }
    },
    removeMessage: (state, action) => {
      const id = action.payload
      state.messages = state.messages.filter((m) => m.id !== id)
    },
    setStreamingMessageId: (state, action) => {
      state.streamingMessageId = action.payload ?? null
    },
    setLoading: (state, action) => {
      state.loading = Boolean(action.payload)
    },
    setError: (state, action) => {
      state.error =
        action.payload == null || action.payload === ''
          ? null
          : String(action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
    clearChat: () => initialState,
  },
})

export const {
  addMessage,
  patchMessageContent,
  pushConversationTurn,
  removeMessage,
  setStreamingMessageId,
  setLoading,
  setError,
  clearError,
  clearChat,
} = chatSlice.actions

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (userInput, { dispatch, getState }) => {
    const trimmed = String(userInput ?? '').trim()
    if (!trimmed) {
      return null
    }

    dispatch(clearError())
    dispatch(
      addMessage({
        id: uuidv4(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      }),
    )
    dispatch(setLoading(true))

    const assistantId = uuidv4()

    try {
      dispatch(
        addMessage({
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
          skipConversationHistory: true,
        }),
      )
      dispatch(setStreamingMessageId(assistantId))

      const history = getState().chat.conversationHistory
      const apiPayload = history.slice(-30)

      const reply = await openaiApi.sendMessage(apiPayload, {
        onDelta: (text) => {
          dispatch(patchMessageContent({ id: assistantId, content: text }))
        },
      })

      dispatch(
        pushConversationTurn({
          role: 'assistant',
          content: reply,
        }),
      )
      return reply
    } catch (error) {
      dispatch(removeMessage(assistantId))
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      dispatch(setError(message))
      throw error
    } finally {
      dispatch(setStreamingMessageId(null))
      dispatch(setLoading(false))
    }
  },
)

export default chatSlice.reducer
