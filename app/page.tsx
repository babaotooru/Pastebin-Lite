'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { CopyButton } from '@/components/CopyButton';
import { ShareButton } from '@/components/ShareButton';
import { TimePicker } from '@/components/TimePicker';

export default function HomePage() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ id: string; url: string; content?: string } | null>(null);
  const [viewingPaste, setViewingPaste] = useState<{ id: string; content: string; url: string } | null>(null);
  const { toasts, showToast, removeToast } = useToast();

  const handleShareCopy = () => {
    showToast('Link copied to clipboard!', 'success', 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

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

      setResult({ ...data, content });
      showToast('Paste created successfully!', 'success');
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
      
      // Scroll to result
      setTimeout(() => {
        const resultElement = document.getElementById('paste-result');
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getFullUrl = () => {
    if (!result) return '';
    if (result.url.startsWith('http')) return result.url;
    return `${window.location.origin}${result.url}`;
  };

  const handleViewPaste = async (pasteId: string) => {
    try {
      const response = await fetch(`/api/pastes/${pasteId}`);
      if (response.ok) {
        const data = await response.json();
        setViewingPaste({
          id: pasteId,
          content: data.content,
          url: getFullUrl(),
        });
        // Scroll to view
        setTimeout(() => {
          const viewElement = document.getElementById('paste-view');
          if (viewElement) {
            viewElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        showToast('Failed to load paste', 'error');
      }
    } catch (err) {
      showToast('Error loading paste', 'error');
    }
  };

  const handleCreateNew = () => {
    setResult(null);
    setViewingPaste(null);
    setContent('');
    setTtlSeconds('');
    setMaxViews('');
  };

  return (
    <>
      <div className="container">
        <div className="header">
          <h1>✨ Pastebin-Lite</h1>
          <p>Create and share text snippets with real-time updates</p>
        </div>

        {result && (
          <div id="paste-result" className="card" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: '200px', width: '100%' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>✅ Paste Created!</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  Share this link with others
                </p>
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem', 
                  alignItems: 'center',
                  background: 'var(--bg-secondary)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius)',
                  border: '2px solid var(--border)'
                }}>
                  <code style={{ 
                    flex: 1, 
                    fontSize: '0.875rem', 
                    color: 'var(--text-primary)',
                    wordBreak: 'break-all'
                  }}>
                    {getFullUrl()}
                  </code>
                  <CopyButton text={getFullUrl()} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%', marginTop: '1rem' }}>
                <button 
                  onClick={() => handleViewPaste(result.id)} 
                  className="btn btn-secondary" 
                  style={{ flex: 1, minWidth: '120px' }}
                >
                  👁️ View Paste
                </button>
                <ShareButton 
                  url={getFullUrl()} 
                  title="Check out this paste"
                  text="Check out this paste I created"
                  onCopy={handleShareCopy}
                />
              </div>
            </div>
          </div>
        )}

        {viewingPaste && (
          <div id="paste-view" className="card" style={{ animation: 'fadeInUp 0.4s ease-out', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>📋 Paste Content</h3>
              <button onClick={handleCreateNew} className="btn btn-secondary">
                ✨ Create New
              </button>
            </div>
            <div className="paste-content" style={{ 
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, monospace',
              fontSize: '0.9375rem',
              lineHeight: '1.8',
              padding: '1.5rem',
              background: 'var(--bg-tertiary)',
              border: '2px solid var(--border)',
              borderRadius: 'var(--radius)',
            }}>
              {viewingPaste.content}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <CopyButton text={viewingPaste.content} className="btn-secondary" />
              <ShareButton 
                url={viewingPaste.url} 
                title="Check out this paste"
                text="Check out this paste"
                onCopy={handleShareCopy}
              />
            </div>
          </div>
        )}

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
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
