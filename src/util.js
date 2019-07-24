/**
 * Shortens a string
 *
 * @export
 * @param {string} text
 * @param {number} len
 * @param {boolean} [ellipsis=true]
 * @returns {string} Shortened string
 */
export function shortenText(text, len, ellipsis = true) {
  return `${text.slice(0, len)}${ellipsis && text.length > len ? '...' : ''}`;
}