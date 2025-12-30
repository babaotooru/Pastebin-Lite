'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorBoxProps {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  message?: string;
}

export function ErrorBox({ error, reset, title, message }: ErrorBoxProps) {
  useEffect(() => {
    if (error) {
      console.error('Application error:', error);
    }
  }, [error]);

  const errorMessage = message || error?.message || 'An unexpected error occurred';
  const errorTitle = title || 'Something went wrong!';

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
            {errorTitle}
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            {errorMessage}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          {reset && (
            <button
              onClick={reset}
              className="btn"
              style={{ width: '100%', maxWidth: '300px' }}
            >
              Try Again
            </button>
          )}
          <Link href="/" className="btn btn-secondary" style={{ width: '100%', maxWidth: '300px', textDecoration: 'none' }}>
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

