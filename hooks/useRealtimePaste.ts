'use client';

import { useState, useEffect, useRef } from 'react';

interface PasteStats {
  remaining_views: number | null;
  expires_at: string | null;
}

export function useRealtimePaste(pasteId: string | null, enabled = true) {
  const [stats, setStats] = useState<PasteStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pasteId || !enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Use stats endpoint to avoid decrementing views on each poll
        const response = await fetch(`/api/pastes/${pasteId}/stats`, {
          cache: 'no-store',
        });
        if (response.ok) {
          const data = await response.json();
          setStats({
            remaining_views: data.remaining_views,
            expires_at: data.expires_at,
          });
        } else if (response.status === 404) {
          // Paste expired or not found
          setStats(null);
        }
      } catch (error) {
        console.error('Failed to fetch paste stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchStats();

    // Then poll every 3 seconds
    intervalRef.current = setInterval(fetchStats, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [pasteId, enabled]);

  return { stats, isLoading };
}

