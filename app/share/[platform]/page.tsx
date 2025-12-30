'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { 
  WhatsAppIcon, 
  TwitterIcon, 
  FacebookIcon, 
  TelegramIcon, 
  LinkedInIcon, 
  RedditIcon, 
  EmailIcon, 
  SMSIcon 
} from '@/components/Icons';

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

export default function SharePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const platform = (params?.platform as string)?.toLowerCase();
  const url = searchParams?.get('url') || null;
  const text = searchParams?.get('text') || 'Check out this paste';
  const title = searchParams?.get('title') || 'Check out this paste';

  const config = platformConfig[platform];

  useEffect(() => {
    if (!url || !config) {
      return;
    }

    // Small delay to show the page briefly before redirecting
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      const encodedUrl = encodeURIComponent(url);
      const encodedText = encodeURIComponent(text);
      const encodedTitle = encodeURIComponent(title);

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
          shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
          break;
        case 'sms':
          shareUrl = `sms:?body=${encodedText}%20${encodedUrl}`;
          break;
        default:
          router.push('/');
          return;
      }

      // Open in new tab
      const newWindow = window.open(shareUrl, '_blank');
      
      // If popup was blocked, show message
      if (!newWindow) {
        alert(`Please allow popups to share to ${config.name}. You can also copy this link: ${url}`);
      }
      
      // Close this tab/window after a moment if opened in new tab
      // Otherwise redirect back
      setTimeout(() => {
        // Check if this window was opened by another window
        if (window.opener) {
          window.close();
        } else {
          const referrer = document.referrer;
          if (referrer && referrer.includes(window.location.origin)) {
            router.back();
          } else {
            router.push('/');
          }
        }
      }, 1000);
    }, 300);

    return () => clearTimeout(timer);
  }, [url, platform, text, title, config, router]);

  if (!config || !url) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '2rem auto' }}>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Invalid Share Request</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Missing required parameters or invalid platform.
          </p>
          <button onClick={() => router.push('/')} className="btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div style={{ 
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${config.color} 0%, ${config.color}dd 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2.5rem',
            boxShadow: 'var(--shadow-lg)',
          }}>
            {config.icon}
          </div>
          <div>
            <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Sharing to {config.name}
            </h1>
            {isRedirecting ? (
              <p style={{ color: 'var(--text-secondary)' }}>
                Opening {config.name}...
              </p>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>
                Preparing to share...
              </p>
            )}
          </div>
        </div>

        {isRedirecting && (
          <div className="loading" style={{ 
            width: '3rem', 
            height: '3rem', 
            margin: '0 auto',
            borderWidth: '4px'
          }}></div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={() => router.back()} 
            className="btn btn-secondary"
            style={{ marginRight: '0.5rem' }}
          >
            ← Go Back
          </button>
          <button 
            onClick={() => router.push('/')} 
            className="btn btn-secondary"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

