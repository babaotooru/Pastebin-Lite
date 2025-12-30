/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Format content for display (preserve line breaks)
 */
export function formatContentForDisplay(content) {
  return escapeHtml(content)
    .split('\n')
    .map((line) => `<span class="line">${line || ' '}</span>`)
    .join('\n');
}

