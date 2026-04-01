import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import MessageBubble from './MessageBubble'
import LoadingIndicator from './LoadingIndicator'

export default function MessageList({
  messages,
  loading,
  streamingMessageId,
}) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, streamingMessageId])

  const empty = messages.length === 0 && !loading
  const showTypingIndicator = Boolean(loading && !streamingMessageId)

  return (
    <div
      ref={scrollRef}
      className="chat-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-3 py-3 md:gap-4 md:px-4 md:py-4"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
    >
      {empty && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 md:text-base">
            How can I help you today?
          </p>
          <p className="max-w-sm text-xs text-slate-500 dark:text-slate-400 md:text-sm">
            Ask anything — answers stream in real time, with markdown support
            for code and lists.
          </p>
        </div>
      )}
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          id={m.id}
          role={m.role}
          content={m.content}
          timestamp={m.timestamp}
          isStreaming={streamingMessageId === m.id}
        />
      ))}
      {showTypingIndicator && <LoadingIndicator />}
    </div>
  )
}

const messageShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
})

MessageList.propTypes = {
  messages: PropTypes.arrayOf(messageShape).isRequired,
  loading: PropTypes.bool.isRequired,
  streamingMessageId: PropTypes.string,
}
