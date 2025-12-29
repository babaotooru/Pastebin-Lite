'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  WhatsAppIcon, 
  TwitterIcon, 
  FacebookIcon, 
  TelegramIcon, 
  LinkedInIcon, 
  RedditIcon, 
  EmailIcon, 
  SMSIcon, 
  CopyIcon,
  ShareIcon
} from './Icons';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Web Share API is available
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
      // Prevent body scroll when menu is open on mobile
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
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  const shareToPlatform = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text || title);
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
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

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowMenu(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowMenu(false);
      if (onCopy) {
        onCopy();
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Calculate menu position
  const getMenuStyle = (): React.CSSProperties => {
    if (!buttonRef.current) {
      return {};
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const isMobile = window.innerWidth <= 640;
    
    if (isMobile) {
      return {
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        top: 'auto',
        transform: 'none',
        maxWidth: 'calc(100vw - 2rem)',
      };
    }

    // Desktop: position relative to button
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 400; // Approximate menu height

    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      // Position above button
    return {
      position: 'absolute',
      bottom: 'calc(100% + 0.5rem)',
      left: 0,
      transform: 'none',
      maxWidth: '220px',
    };
    }

    // Position below button (default)
    return {
      position: 'absolute',
      top: 'calc(100% + 0.5rem)',
      left: 0,
      transform: 'none',
      maxWidth: '220px',
    };
  };

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
        <ShareIcon />
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
              ...getMenuStyle(),
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow-lg)',
              padding: '0.5rem',
              zIndex: 10000,
              minWidth: '200px',
              maxWidth: '220px',
              maxHeight: '70vh',
              overflowY: 'auto',
              animation: 'fadeInUp 0.2s ease-out',
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              <ShareMenuItem
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                color="#25D366"
                onClick={() => shareToPlatform('whatsapp')}
              />
              <ShareMenuItem
                icon={<TwitterIcon />}
                label="Twitter / X"
                color="#1DA1F2"
                onClick={() => shareToPlatform('twitter')}
              />
              <ShareMenuItem
                icon={<FacebookIcon />}
                label="Facebook"
                color="#1877F2"
                onClick={() => shareToPlatform('facebook')}
              />
              <ShareMenuItem
                icon={<TelegramIcon />}
                label="Telegram"
                color="#0088cc"
                onClick={() => shareToPlatform('telegram')}
              />
              <ShareMenuItem
                icon={<LinkedInIcon />}
                label="LinkedIn"
                color="#0077B5"
                onClick={() => shareToPlatform('linkedin')}
              />
              <ShareMenuItem
                icon={<RedditIcon />}
                label="Reddit"
                color="#FF4500"
                onClick={() => shareToPlatform('reddit')}
              />
              <div style={{ borderTop: '1px solid var(--border)', margin: '0.375rem 0' }} />
              <ShareMenuItem
                icon={<EmailIcon />}
                label="Email"
                color="#666"
                onClick={() => shareToPlatform('email')}
              />
              <ShareMenuItem
                icon={<SMSIcon />}
                label="SMS"
                color="#666"
                onClick={() => shareToPlatform('sms')}
              />
              <ShareMenuItem
                icon={<CopyIcon />}
                label="Copy Link"
                color="#666"
                onClick={copyToClipboard}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface ShareMenuItemProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick: () => void;
}

function ShareMenuItem({ icon, label, color = '#666', onClick }: ShareMenuItemProps) {
  return (
    <button
      onClick={onClick}
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
        transition: 'var(--transition)',
        width: '100%',
        textAlign: 'left',
        minHeight: '36px',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--bg-secondary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ 
        color: color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        flexShrink: 0,
      }}>
        {icon}
      </span>
      <span style={{ fontWeight: 500, fontSize: '0.8125rem' }}>{label}</span>
    </button>
  );
}
