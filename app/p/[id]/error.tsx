'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function PasteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Paste view error:', error);
  }, [error]);

  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
          }}>
            ⚠️
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--error)',
            marginBottom: '0.5rem'
          }}>
            Failed to load paste
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            {error.message || 'Unable to load this paste. It may have expired or been deleted.'}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          <button
            onClick={reset}
            className="btn"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            Try Again
          </button>
          <Link href="/" className="btn btn-secondary" style={{ width: '100%', maxWidth: '300px', textDecoration: 'none' }}>
            Create New Paste
          </Link>
        </div>
      </div>
    </div>
  );
}


