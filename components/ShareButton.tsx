'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  className?: string;
  onCopy?: () => void;
}

export function ShareButton({ url, title = 'Check out this paste', text, className = '', onCopy }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      setCanUseNativeShare(true);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [showMenu]);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: text || title,
        url,
      });
      setShowMenu(false);
      showToast('Shared successfully!', 'success', 3000);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        showToast('Failed to share. Please try again.', 'error', 3000);
      }
    }
  };

  const shareToPlatform = async (platform: string) => {
    if (platform === 'copy') {
      const success = await copy(url);
      if (success) {
        showToast('Link copied to clipboard!', 'success', 3000);
        if (onCopy) {
          onCopy();
        }
      } else {
        showToast('Failed to copy link. Please try again.', 'error', 3000);
      }
      setShowMenu(false);
      return;
    }

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text || title);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setShowMenu(false);
  };

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', color: '#25D366' },
    { id: 'twitter', name: 'Twitter / X', color: '#1DA1F2' },
    { id: 'facebook', name: 'Facebook', color: '#1877F2' },
    { id: 'telegram', name: 'Telegram', color: '#0088cc' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0077B5' },
    { id: 'reddit', name: 'Reddit', color: '#FF4500' },
    { id: 'email', name: 'Email', color: '#666' },
    { id: 'sms', name: 'SMS', color: '#666' },
    { id: 'copy', name: 'Copy Link', color: '#666' },
  ];

  return (
    <div ref={buttonRef} style={{ position: 'relative', display: 'inline-block', zIndex: 1000 }}>
      <button
        onClick={() => {
          if (canUseNativeShare) {
            handleNativeShare();
          } else {
            setShowMenu(!showMenu);
          }
        }}
        className={`btn ${className}`}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <span>🔗</span>
        <span>Share</span>
      </button>

      {showMenu && !canUseNativeShare && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={() => setShowMenu(false)}
          />
          <div
            ref={menuRef}
            style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              left: 0,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.5rem',
              zIndex: 10000,
              minWidth: '200px',
              maxWidth: '220px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              padding: '0.375rem 0.5rem', 
              fontSize: '0.6875rem', 
              fontWeight: 600, 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: '1px solid var(--border)',
              marginBottom: '0.375rem',
            }}>
              Share via
            </div>
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => shareToPlatform(platform.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.625rem 0.5rem',
                  background: 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: 'var(--text-primary)',
                  width: '100%',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ color: platform.color, fontWeight: 'bold' }}>•</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
