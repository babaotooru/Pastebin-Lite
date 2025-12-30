'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { CopyIcon } from '@/components/Icons';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';

export default function CopyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { toasts, showToast, removeToast } = useToast();
  
  const url = searchParams.get('url');

  useEffect(() => {
    if (!url) {
      return;
    }

    // Auto-copy on page load
    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('✅ Link copied to clipboard!', 'success', 3000);
        
        // Redirect back after a moment
        setTimeout(() => {
          const referrer = document.referrer;
          if (referrer && referrer.includes(window.location.origin)) {
            router.back();
          } else {
            router.push('/');
          }
        }, 1500);
      } catch (error) {
        console.error('Failed to copy:', error);
        showToast('Failed to copy link. Please try again.', 'error', 3000);
      }
    };

    // Small delay to show the page
    const timer = setTimeout(copyToClipboard, 200);
    return () => clearTimeout(timer);
  }, [url, router, showToast]);

  if (!url) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '500px', margin: '2rem auto' }}>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Invalid Copy Request</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Missing URL parameter.
          </p>
          <button onClick={() => router.push('/')} className="btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
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
              background: copied 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '2.5rem',
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.3s ease',
            }}>
              {copied ? '✅' : <CopyIcon />}
            </div>
            <div>
              <h1 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {copied ? 'Link Copied!' : 'Copying Link...'}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                {url}
              </p>
            </div>
          </div>

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
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}


