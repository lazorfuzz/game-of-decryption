export function shortenText(text, len, ellipsis = true) {
  return `${text.slice(0, len)}${ellipsis && text.length > len ? '...' : ''}`;
}