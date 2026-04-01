import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearChat, clearError, sendMessage } from './chatSlice'
import MessageInput from './MessageInput'
import MessageList from './MessageList'

export default function ChatBox() {
  const dispatch = useDispatch()
  const { messages, loading, error, streamingMessageId } = useSelector(
    (state) => state.chat,
  )

  const handleSend = useCallback(
    (text) => {
      dispatch(sendMessage(text))
    },
    [dispatch],
  )

  const handleClear = useCallback(() => {
    dispatch(clearChat())
  }, [dispatch])

  const handleDismissError = useCallback(() => {
    dispatch(clearError())
  }, [dispatch])

  return (
    <div className="flex h-[100dvh] w-full justify-center bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex h-full w-full max-w-3xl flex-col bg-white shadow-xl ring-1 ring-slate-200/60 dark:bg-slate-900 dark:ring-slate-800 md:my-4 md:h-[calc(100dvh-2rem)] md:max-h-[900px] md:rounded-2xl md:shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200/90 px-3 py-3 dark:border-slate-800 md:px-4">
          <h1 className="text-base font-semibold tracking-tight md:text-lg">
            ChatBox App
          </h1>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 md:text-sm"
          >
            Clear Chat
          </button>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 border-b border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/80 dark:text-red-100 md:px-4"
          >
            <p className="min-w-0 flex-1 leading-snug">{error}</p>
            <button
              type="button"
              onClick={handleDismissError}
              className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-red-700 underline-offset-2 hover:underline dark:text-red-200"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          </div>
        )}

        <MessageList
          messages={messages}
          loading={loading}
          streamingMessageId={streamingMessageId ?? undefined}
        />
        <div className="shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <MessageInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </div>
  )
}

ChatBox.propTypes = {}
