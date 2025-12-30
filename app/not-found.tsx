'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
          }}>
            🔍
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--error)',
            marginBottom: '0.5rem'
          }}>
            404 - Page Not Found
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          <Link href="/" className="btn" style={{ width: '100%', maxWidth: '300px', textDecoration: 'none' }}>
            ✨ Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}


