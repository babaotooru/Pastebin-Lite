'use client';

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/useToast';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePlatform, setSharePlatform] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [canUseNativeShare, setCanUseNativeShare] = useState(false);
  const { showToast } = useToast();
  const { copy } = useCopyToClipboard();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowShareModal(false);
        setSharePlatform(null);
      }
    };

    if (showShareModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [showShareModal]);

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
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
        showToast('Failed to share. Please try again.', 'error', 3000);
      }
    }
  };

  const shareToPlatform = async (platform: string) => {
    if (platform === 'copy') {
      // Copy directly inline
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

    // Generate share URL for the platform
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text || title);
    const encodedTitle = encodeURIComponent(title);

    let generatedShareUrl = '';

    switch (platform) {
      case 'whatsapp':
        generatedShareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'twitter':
      case 'x':
        generatedShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        generatedShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'telegram':
        generatedShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'linkedin':
        generatedShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'reddit':
        generatedShareUrl = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;
        break;
      case 'email':
        generatedShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'sms':
        generatedShareUrl = `sms:?body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    // Show modal with share link
    setShareUrl(generatedShareUrl);
    setSharePlatform(platform);
    setShowShareModal(true);
    setShowMenu(false);
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

  const platformConfig: Record<string, { name: string; icon: React.ReactNode; color: string }> = {
    whatsapp: { name: 'WhatsApp', icon: <WhatsAppIcon />, color: '#25D366' },
    twitter: { name: 'Twitter / X', icon: <TwitterIcon />, color: '#1DA1F2' },
    x: { name: 'Twitter / X', icon: <TwitterIcon />, color: '#1DA1F2' },
    facebook: { name: 'Facebook', icon: <FacebookIcon />, color: '#1877F2' },
    telegram: { name: 'Telegram', icon: <TelegramIcon />, color: '#0088cc' },
    linkedin: { name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
    reddit: { name: 'Reddit', icon: <RedditIcon />, color: '#FF4500' },
    email: { name: 'Email', icon: <EmailIcon />, color: '#666' },
    sms: { name: 'SMS', icon: <SMSIcon />, color: '#666' },
  };

  const handleOpenShare = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      setShowShareModal(false);
      setSharePlatform(null);
      showToast('Opening share page...', 'info', 2000);
    }
  };

  const handleCopyShareUrl = async () => {
    if (shareUrl) {
      const success = await copy(shareUrl);
      if (success) {
        showToast('Share link copied to clipboard!', 'success', 3000);
      } else {
        showToast('Failed to copy link. Please try again.', 'error', 3000);
      }
    }
  };

  return (
    <>
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
                  onClick={() => shareToPlatform('copy')}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Share Modal - Shows inline on same page */}
      {showShareModal && sharePlatform && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10001,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={() => {
              setShowShareModal(false);
              setSharePlatform(null);
            }}
          >
            <div
              ref={modalRef}
              style={{
                background: 'var(--bg-primary)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                animation: 'fadeInUp 0.3s ease-out',
                border: '1px solid var(--border)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${platformConfig[sharePlatform]?.color || '#666'} 0%, ${platformConfig[sharePlatform]?.color || '#666'}dd 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2.5rem',
                  boxShadow: 'var(--shadow-lg)',
                }}>
                  {platformConfig[sharePlatform]?.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}>
                    Share to {platformConfig[sharePlatform]?.name}
                  </h2>
                  <p style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                  }}>
                    Click the button below to open the share page
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>
                <button
                  onClick={handleOpenShare}
                  className="btn"
                  style={{
                    width: '100%',
                    background: `linear-gradient(135deg, ${platformConfig[sharePlatform]?.color || '#666'} 0%, ${platformConfig[sharePlatform]?.color || '#666'}dd 100%)`,
                  }}
                >
                  Open {platformConfig[sharePlatform]?.name}
                </button>
                <button
                  onClick={handleCopyShareUrl}
                  className="btn btn-secondary"
                  style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <CopyIcon />
                  <span>Copy Share Link</span>
                </button>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setSharePlatform(null);
                  }}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
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
