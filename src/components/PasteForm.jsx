import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaste } from '../services/api';
import { TimePicker } from './TimePicker';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';

export function PasteForm({ onSuccess }) {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await createPaste(content, ttlSeconds || null, maxViews || null);

      // Clear form
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
      
      // Show success message
      showToast('Paste created successfully!', 'success');
      
      // Extract paste ID from URL
      const pasteId = data.url.split('/p/')[1];
      
      // Use callback if provided, otherwise navigate
      if (onSuccess && pasteId) {
        setTimeout(() => {
          onSuccess(pasteId, data.url);
        }, 300);
      } else {
        setTimeout(() => {
          navigate(`/p/${pasteId}`);
        }, 500);
      }
    } catch (err) {
      showToast(err.message || 'An error occurred', 'error');
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

