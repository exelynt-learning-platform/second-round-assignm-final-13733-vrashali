import { memo } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { normalizeMessageContent } from '../../utils/formatMessage'

function UserAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white ring-1 ring-indigo-500/40 dark:bg-indigo-500 dark:ring-indigo-400/30"
      aria-hidden
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z" />
      </svg>
    </div>
  )
}

function BotAvatar() {
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 ring-1 ring-slate-300/60 dark:bg-slate-700 dark:text-slate-100 dark:ring-slate-600"
      aria-hidden
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1v2h-1v3H4v-3H3v-2h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.5 13A1.5 1.5 0 109 14.5 1.5 1.5 0 007.5 13zm9 0a1.5 1.5 0 101.5 1.5 1.5 1.5 0 00-1.5-1.5z" />
      </svg>
    </div>
  )
}

function formatDisplayTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

const markdownComponents = {
  a: ({ children, href, ...props }) => (
    <a
      {...props}
      href={href}
      className="font-medium text-indigo-600 underline decoration-indigo-400/70 underline-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
}

function MessageBubbleComponent({
  id,
  role,
  content,
  timestamp,
  isStreaming = false,
}) {
  const isUser = role === 'user'
  const text = normalizeMessageContent(content)
  const showThinking = !isUser && isStreaming && text === ''

  return (
    <div
      data-message-id={id}
      className={`flex w-full animate-fade-in-up gap-2 opacity-0 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && <BotAvatar />}
      <div
        className={`flex max-w-[85%] flex-col gap-1 md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}
      >
        <div
          aria-busy={!isUser && isStreaming ? true : undefined}
          className={`rounded-2xl px-3 py-2 text-sm shadow-sm transition-colors duration-200 md:text-[0.9375rem] ${
            isUser
              ? 'rounded-br-md bg-indigo-600 text-white dark:bg-indigo-500'
              : 'rounded-bl-md border border-slate-200/80 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed text-white">
              {text}
            </p>
          ) : showThinking ? (
            <div className="flex items-center gap-2 py-0.5 text-slate-500 dark:text-slate-400">
              <span
                className="inline-block h-4 w-0.5 shrink-0 animate-streaming-cursor rounded-sm bg-current"
                aria-hidden
              />
              <span className="text-sm">Thinking…</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-p:leading-relaxed prose-headings:my-3 prose-headings:font-semibold prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-pre:my-2 prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:border prose-pre:border-slate-700 prose-pre:bg-slate-950 prose-pre:p-3 prose-pre:text-slate-100 prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none dark:prose-pre:border-slate-600 dark:prose-code:bg-slate-700/80">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {text}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <span className="px-1 text-[10px] text-slate-400 dark:text-slate-500 md:text-xs">
          {formatDisplayTime(timestamp)}
        </span>
      </div>
      {isUser && <UserAvatar />}
    </div>
  )
}

MessageBubbleComponent.propTypes = {
  id: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['user', 'assistant']).isRequired,
  content: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  isStreaming: PropTypes.bool,
}

const MessageBubble = memo(MessageBubbleComponent)

MessageBubble.displayName = 'MessageBubble'

export default MessageBubble
