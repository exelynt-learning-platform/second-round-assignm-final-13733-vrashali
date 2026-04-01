/**
 * Normalize user/assistant text for display (trim trailing whitespace, preserve intentional line breaks).
 * @param {string} content
 * @returns {string}
 */
export function normalizeMessageContent(content) {
  if (content == null) return ''
  return String(content).replace(/\r\n/g, '\n').trimEnd()
}

/**
 * Split assistant content into lines for line-break rendering when not using pre-wrap.
 * @param {string} content
 * @returns {string[]}
 */
export function splitMessageLines(content) {
  const normalized = normalizeMessageContent(content)
  return normalized.length ? normalized.split('\n') : ['']
}
