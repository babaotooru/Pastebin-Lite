import { getKV } from './redis';
import { getCurrentTime } from './time';

export interface PasteData {
  content: string;
  createdAt: number;
  ttlSeconds: number | null;
  maxViews: number | null;
  remainingViews: number | null;
}

const PASTE_PREFIX = 'paste:';
const PASTE_META_PREFIX = 'paste:meta:';

/**
 * Check if a paste has expired based on TTL
 */
export function isExpired(paste: PasteData, now: number): boolean {
  if (paste.ttlSeconds === null) {
    return false;
  }
  const expiresAt = paste.createdAt + paste.ttlSeconds * 1000;
  return now >= expiresAt;
}

/**
 * Check if a paste has exceeded max views
 */
export function hasExceededViews(paste: PasteData): boolean {
  if (paste.maxViews === null) {
    return false;
  }
  return paste.remainingViews !== null && paste.remainingViews <= 0;
}

/**
 * Calculate expiry timestamp (null if no TTL)
 */
export function getExpiresAt(paste: PasteData): number | null {
  if (paste.ttlSeconds === null) {
    return null;
  }
  return paste.createdAt + paste.ttlSeconds * 1000;
}

/**
 * Store a new paste
 */
export async function createPaste(
  content: string,
  ttlSeconds: number | null,
  maxViews: number | null,
  now: number
): Promise<{ id: string; url: string }> {
  const kv = getKV();
  
  // Generate a unique ID using crypto for better randomness
  // Format: timestamp (base36) + random string (base36)
  const timestamp = now.toString(36);
  const randomPart = Math.random().toString(36).substring(2, 11) + 
                     Math.random().toString(36).substring(2, 11);
  const id = `${timestamp}-${randomPart}`.substring(0, 24); // Limit to 24 chars for URL-friendliness

  const paste: PasteData = {
    content,
    createdAt: now,
    ttlSeconds,
    maxViews,
    remainingViews: maxViews,
  };

  // Store the paste data
  const pasteKey = `${PASTE_PREFIX}${id}`;
  
  // If TTL is set, use Redis TTL; otherwise store indefinitely
  if (ttlSeconds !== null) {
    await kv.set(pasteKey, paste, { ex: ttlSeconds });
  } else {
    await kv.set(pasteKey, paste);
  }

  // Store metadata separately for quick lookups (optional, but useful)
  const metaKey = `${PASTE_META_PREFIX}${id}`;
  await kv.set(metaKey, { createdAt: now, ttlSeconds, maxViews }, { ex: ttlSeconds || 86400 * 365 }); // Default 1 year for metadata

  // Get the domain from environment or use a placeholder
  const domain = process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  return {
    id,
    url: `${domain}/p/${id}`,
  };
}

/**
 * Get a paste by ID and decrement views if applicable
 */
export async function getPaste(id: string, now: number): Promise<PasteData | null> {
  const kv = getKV();
  const pasteKey = `${PASTE_PREFIX}${id}`;
  const paste = await kv.get<PasteData>(pasteKey);

  if (!paste) {
    return null;
  }

  // Check if expired
  if (isExpired(paste, now)) {
    // Optionally delete expired paste
    await kv.del(pasteKey);
    return null;
  }

  // Check if views exceeded
  if (hasExceededViews(paste)) {
    return null;
  }

  // Decrement views if maxViews is set
  if (paste.maxViews !== null && paste.remainingViews !== null) {
    const newRemainingViews = Math.max(0, paste.remainingViews - 1);
    paste.remainingViews = newRemainingViews;

    // Update the paste with new remaining views
    const ttl = paste.ttlSeconds ? paste.ttlSeconds : undefined;
    if (ttl) {
      const remainingTtl = Math.max(1, Math.floor((paste.createdAt + ttl * 1000 - now) / 1000));
      await kv.set(pasteKey, paste, { ex: remainingTtl });
    } else {
      await kv.set(pasteKey, paste);
    }

    // If views are now 0, we can optionally delete it
    if (newRemainingViews === 0) {
      // Keep it for one more check, but mark as unavailable
    }
  }

  return paste;
}

/**
 * Get a paste without decrementing views (for read-only operations)
 */
export async function getPasteReadOnly(id: string, now: number): Promise<PasteData | null> {
  const kv = getKV();
  const pasteKey = `${PASTE_PREFIX}${id}`;
  const paste = await kv.get<PasteData>(pasteKey);

  if (!paste) {
    return null;
  }

  // Check if expired
  if (isExpired(paste, now)) {
    return null;
  }

  // Check if views exceeded
  if (hasExceededViews(paste)) {
    return null;
  }

  return paste;
}

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

