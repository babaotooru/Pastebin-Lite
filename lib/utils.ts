/**
 * Escape HTML to prevent XSS attacks
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
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
export function formatContentForDisplay(content: string): string {
  return escapeHtml(content)
    .split('\n')
    .map((line) => `<span class="line">${line || ' '}</span>`)
    .join('\n');
}

