import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

const MAX_TEXTAREA_HEIGHT_PX = 96
const PLACEHOLDER = 'Type a message...'

export default function MessageInput({ onSend, disabled, maxLength = 8000 }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = '0px'
    const next = Math.min(ta.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)
    ta.style.height = `${next}px`
  }, [])

  useEffect(() => {
    resizeTextarea()
  }, [value, resizeTextarea])

  const submit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        resizeTextarea()
      }
    })
  }, [value, disabled, onSend, resizeTextarea])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submit()
      }
    },
    [submit],
  )

  const handleChange = useCallback((e) => {
    const next = e.target.value
    if (next.length > maxLength) return
    setValue(next)
  }, [maxLength])

  const canSend = !disabled && value.trim().length > 0

  return (
    <div className="border-t border-slate-200/90 bg-white/90 px-3 py-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 md:px-4">
      <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-2 py-2 shadow-inner dark:border-slate-600 dark:bg-slate-800/80">
        <textarea
          id="chat-message-input"
          name="message"
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDER}
          className="max-h-24 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-100 dark:placeholder:text-slate-500 md:text-[0.9375rem]"
          aria-label="Message input"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!canSend}
          className="mb-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:disabled:bg-slate-600 dark:disabled:text-slate-400"
          aria-label="Send message"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="mt-1 flex justify-end px-1 text-[10px] text-slate-400 dark:text-slate-500 md:text-xs">
        <span aria-live="polite">
          {value.length > 0 ? `${value.length} / ${maxLength}` : '\u00a0'}
        </span>
      </div>
    </div>
  )
}

MessageInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  maxLength: PropTypes.number,
}
