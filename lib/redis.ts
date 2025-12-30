import { kv } from '@vercel/kv';

// Check if KV is configured
export function checkKVConfig() {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error('Vercel KV is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.');
  }
}

/**
 * Check if storage is available
 */
export async function checkStorageHealth(): Promise<boolean> {
  try {
    checkKVConfig();
    // Try a simple operation to check if KV is available
    await kv.get('health:check');
    return true;
  } catch (error) {
    // If KV is not configured, return false
    return false;
  }
}

/**
 * Get the KV client (for use in paste.ts)
 */
export function getKV() {
  checkKVConfig();
  return kv;
}

