import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShareButton } from './ShareButton';

export function ExpiredMessage({ pasteId }) {
  const navigate = useNavigate();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            ⏰
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--error)',
            marginBottom: '0.5rem'
          }}>
            ⏰ Time Completed
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            This paste has expired and is no longer available.
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            className="btn"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            ✨ Create New Paste
          </button>
        </div>

        {pasteId && currentUrl && (
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '2rem', 
            borderTop: '1px solid var(--border)'
          }}>
            <p style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              Share this page to let others know the paste has expired
            </p>
            <ShareButton 
              url={currentUrl}
              title="Paste Expired"
              text="This paste has expired"
            />
          </div>
        )}
      </div>
    </div>
  );
}

