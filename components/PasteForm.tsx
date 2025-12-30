'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { TimePicker } from '@/components/TimePicker';

export function PasteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  // Check for timeCompleted query parameter
  useEffect(() => {
    const timeCompleted = searchParams.get('timeCompleted');
    if (timeCompleted === 'true') {
      showToast('⏰ Time Completed - The paste has expired', 'error', 5000);
      // Clean up URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/');
      }
    }
  }, [searchParams, showToast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body: any = { content };
      if (ttlSeconds) {
        body.ttl_seconds = parseInt(ttlSeconds, 10);
      }
      if (maxViews) {
        body.max_views = parseInt(maxViews, 10);
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details?.[0]?.message || data.error || 'Failed to create paste';
        showToast(errorMsg, 'error');
        return;
      }

      // Clear form
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
      
      // Show success message
      showToast('Paste created successfully!', 'success');
      
      // Redirect to paste view page
      setTimeout(() => {
        router.push(data.url);
      }, 500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="form" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Paste your content here...&#10;&#10;Supports multiple lines and special characters."
              style={{ minHeight: '300px' }}
            />
            <small>{content.length} characters</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ttl_seconds">⏱️ Time to Live</label>
              <TimePicker value={ttlSeconds} onChange={setTtlSeconds} />
              <small>Paste will expire after this duration</small>
            </div>

            <div className="form-group">
              <label htmlFor="max_views">👁️ Maximum Views</label>
              <input
                type="number"
                id="max_views"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                min="1"
                placeholder="e.g., 10"
              />
              <small>Limit how many times this can be viewed</small>
            </div>
          </div>

          <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
            {loading ? (
              <>
                <span className="loading" style={{ marginRight: '0.5rem' }}></span>
                Creating...
              </>
            ) : (
              '🚀 Create Paste'
            )}
          </button>
        </form>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

