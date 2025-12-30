'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRealtimePaste } from '@/hooks/useRealtimePaste';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { CopyButton } from '@/components/CopyButton';
import { ShareButton } from '@/components/ShareButton';
import { ExpiresDate } from '@/components/ExpiresDate';
import { BackButton } from '@/components/BackButton';
import { ExpiredMessage } from '@/components/ExpiredMessage';

interface PasteViewerProps {
  pasteId: string;
  content: string;
  contentHtml: string;
  remainingViews: number | null;
  expiresAt: number | null;
}

export function PasteViewer({
  pasteId,
  content,
  contentHtml: initialContentHtml,
  remainingViews: initialRemainingViews,
  expiresAt: initialExpiresAt,
}: PasteViewerProps) {
  const router = useRouter();
  const { stats } = useRealtimePaste(pasteId, true);
  const { toasts, showToast, removeToast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const hasRedirected = useRef(false);

  const remainingViews = stats?.remaining_views ?? initialRemainingViews;
  const expiresAt = stats?.expires_at 
    ? new Date(stats.expires_at).getTime() 
    : initialExpiresAt;
  
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!expiresAt) {
      setTimeRemaining(null);
      setIsExpired(false);
      return;
    }

    const updateTimeRemaining = () => {
      const now = Date.now();
      const diff = expiresAt - now;

      if (diff <= 0) {
        setTimeRemaining('Time Completed');
        setIsExpired(true);
        // Redirect to home page with message
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          // Use window.location for proper redirect (full page reload)
          setTimeout(() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/?timeCompleted=true';
            }
          }, 500); // Small delay to show "Time Completed" briefly
        }
        return;
      }
      
      setIsExpired(false);

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

    // Initial update immediately
    updateTimeRemaining();
    // Update every second
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

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
  if (remainingViews !== null && remainingViews <= 0) {
    return <ExpiredMessage pasteId={pasteId} />;
  }

  // Check if expired - show expired message
  if (isExpired && timeRemaining === 'Time Completed') {
    return <ExpiredMessage pasteId={pasteId} />;
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="loading" style={{ 
            width: '3rem', 
            height: '3rem', 
            margin: '2rem auto',
            borderWidth: '4px'
          }}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Loading paste...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Countdown Timer - Top Right */}
      {expiresAt && timeRemaining && timeRemaining !== 'Time Completed' && !isExpired && (
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
        <BackButton />
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
            <a href="/" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
              ← Create New
            </a>
          </div>
        </div>

        <div className="paste-meta">
          {remainingViews !== null && (
            <div className="paste-meta-item">
              <span className={`badge ${remainingViews > 0 ? 'badge-success' : 'badge-warning'}`}>
                👁️ {remainingViews} {remainingViews === 1 ? 'view' : 'views'} remaining
              </span>
            </div>
          )}
          {expiresAt && timeRemaining !== 'Time Completed' && (
            <ExpiresDate timestamp={expiresAt} />
          )}
        </div>

        <div className="paste-content" dangerouslySetInnerHTML={{ __html: initialContentHtml }} />

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

