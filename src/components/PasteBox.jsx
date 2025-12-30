import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPasteStats } from '../services/api';
import { CopyButton } from './CopyButton';
import { ShareButton } from './ShareButton';
import { ExpiresDate } from './ExpiresDate';
import { ExpiredMessage } from './ExpiredMessage';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './Toast';

export function PasteBox({ pasteId, content, contentHtml, remainingViews, expiresAt }) {
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [currentRemainingViews, setCurrentRemainingViews] = useState(remainingViews);
  const [currentExpiresAt, setCurrentExpiresAt] = useState(expiresAt);
  const hasRedirected = useRef(false);

  // Real-time updates
  useEffect(() => {
    if (!pasteId) return;

    const updateStats = async () => {
      try {
        const stats = await getPasteStats(pasteId);
        setCurrentRemainingViews(stats.remaining_views);
        if (stats.expires_at) {
          setCurrentExpiresAt(new Date(stats.expires_at).getTime());
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    // Initial fetch
    updateStats();
    // Update every 2 seconds
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, [pasteId]);

  // Countdown timer
  useEffect(() => {
    if (!currentExpiresAt) {
      setTimeRemaining(null);
      return;
    }

    const updateTimeRemaining = () => {
      const now = Date.now();
      const diff = currentExpiresAt - now;

      if (diff <= 0) {
        setTimeRemaining('Time Completed');
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          setTimeout(() => {
            navigate('/expired');
          }, 500);
        }
        return;
      }

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours % 24}h remaining`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes % 60}m remaining`);
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds % 60}s remaining`);
      } else {
        setTimeRemaining(`${seconds}s remaining`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [currentExpiresAt, navigate]);

  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(`${window.location.origin}/p/${pasteId}`);
    }
  }, [pasteId]);

  const handleShareCopy = () => {
    showToast('Link copied to clipboard!', 'success', 3000);
  };

  // Check if views exceeded
  if (currentRemainingViews !== null && currentRemainingViews <= 0) {
    return <ExpiredMessage pasteId={pasteId} />;
  }

  // Check if expired
  if (timeRemaining === 'Time Completed') {
    return <ExpiredMessage pasteId={pasteId} />;
  }

  return (
    <>
      {/* Countdown Timer */}
      {currentExpiresAt && timeRemaining && timeRemaining !== 'Time Completed' && (
        <div className="countdown-timer">
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>⏱️</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-secondary)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              lineHeight: 1.2
            }}>
              Time Remaining
            </div>
            <div style={{ 
              fontSize: '1rem', 
              fontWeight: 700,
              color: 'var(--primary)',
              fontFamily: 'monospace',
              lineHeight: 1.4,
              wordBreak: 'break-word'
            }}>
              {timeRemaining}
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="card">
          <div className="paste-header">
            <h1>Paste #{pasteId.substring(0, 12)}...</h1>
            <div className="paste-actions">
              {fullUrl && (
                <>
                  <CopyButton text={fullUrl} />
                  <ShareButton 
                    url={fullUrl} 
                    title={`Paste #${pasteId.substring(0, 12)}`}
                    text="Check out this paste"
                    onCopy={handleShareCopy}
                  />
                </>
              )}
              <button 
                onClick={() => navigate('/')} 
                className="btn btn-secondary"
              >
                ← Create New
              </button>
            </div>
          </div>

          <div className="paste-meta">
            {currentRemainingViews !== null && (
              <div className="paste-meta-item">
                <span className={`badge ${currentRemainingViews > 0 ? 'badge-success' : 'badge-warning'}`}>
                  👁️ {currentRemainingViews} {currentRemainingViews === 1 ? 'view' : 'views'} remaining
                </span>
              </div>
            )}
            {currentExpiresAt && timeRemaining !== 'Time Completed' && (
              <ExpiresDate timestamp={currentExpiresAt} />
            )}
          </div>

          <div className="paste-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <div className="paste-actions" style={{ marginTop: '1.5rem' }}>
            <CopyButton text={content} className="btn-secondary" />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              Real-time updates enabled
            </span>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

