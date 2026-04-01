import PropTypes from 'prop-types'

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

export default function LoadingIndicator({ className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Assistant is typing"
      className={`flex w-full justify-start gap-2 ${className}`}
    >
      <BotAvatar />
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-slate-200/80 bg-white px-3 py-2 text-sm shadow-sm transition dark:border-slate-600 dark:bg-slate-800 md:max-w-[75%]">
        <div className="flex items-center gap-1.5 py-1">
          <span
            className="inline-block h-2 w-2 animate-bounce-dot rounded-full bg-slate-400 [animation-delay:0ms] dark:bg-slate-500"
            aria-hidden
          />
          <span
            className="inline-block h-2 w-2 animate-bounce-dot rounded-full bg-slate-400 [animation-delay:150ms] dark:bg-slate-500"
            aria-hidden
          />
          <span
            className="inline-block h-2 w-2 animate-bounce-dot rounded-full bg-slate-400 [animation-delay:300ms] dark:bg-slate-500"
            aria-hidden
          />
        </div>
      </div>
    </div>
  )
}

LoadingIndicator.propTypes = {
  className: PropTypes.string,
}
