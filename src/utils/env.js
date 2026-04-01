/**
 * Vite injects `import.meta.env` at build time. Jest sets `process.env.VITE_OPENAI_API_KEY`.
 * Never commit real keys. In production, prefer a backend proxy so the key stays server-side.
 * @returns {string | undefined}
 */
const DEFAULT_MODEL = 'gpt-4o-mini'

/**
 * Optional override: VITE_OPENAI_MODEL=gpt-4o-mini | gpt-3.5-turbo | ...
 * @returns {string}
 */
export function getOpenAiModelFromEnv() {
  let value
  try {
    value = import.meta.env?.VITE_OPENAI_MODEL
  } catch {
    value = undefined
  }
  if (value == null || value === '') {
    if (typeof process !== 'undefined' && process.env?.VITE_OPENAI_MODEL) {
      value = process.env.VITE_OPENAI_MODEL
    }
  }
  if (typeof value !== 'string') return DEFAULT_MODEL
  const trimmed = value.trim()
  return trimmed === '' ? DEFAULT_MODEL : trimmed
}

export function getOpenAiApiKeyFromEnv() {
  let value
  try {
    value = import.meta.env?.VITE_OPENAI_API_KEY
  } catch {
    value = undefined
  }
  if (value == null || value === '') {
    if (typeof process !== 'undefined' && process.env?.VITE_OPENAI_API_KEY) {
      value = process.env.VITE_OPENAI_API_KEY
    }
  }
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed === '' ? undefined : trimmed
}
