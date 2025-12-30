/**
 * Helper to parse JSON response or handle errors
 */
async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
  }
  
  return response.json();
}

/**
 * Create a new paste
 */
export async function createPaste(content, ttlSeconds = null, maxViews = null) {
  const body = { content };
  if (ttlSeconds) {
    body.ttl_seconds = parseInt(ttlSeconds, 10);
  }
  if (maxViews) {
    body.max_views = parseInt(maxViews, 10);
  }

  // Use relative URL to go through Vite proxy (or direct on Vercel)
  const apiUrl = import.meta.env.PROD 
    ? '/api/pastes'  // On Vercel, API routes are at the same domain
    : '/api/pastes'; // Local dev goes through Vite proxy
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.details?.[0]?.message || data.error || 'Failed to create paste');
  }

  return data;
}

/**
 * Get a paste by ID
 */
export async function getPaste(id) {
  const response = await fetch(`/api/pastes/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch paste');
  }

  return data;
}

/**
 * Get paste stats (without decrementing views)
 */
export async function getPasteStats(id) {
  const response = await fetch(`/api/pastes/${id}/stats`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch paste stats');
  }

  return data;
}

/**
 * Check API health
 */
export async function checkHealth() {
  const response = await fetch('/api/healthz', {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return parseResponse(response);
}

