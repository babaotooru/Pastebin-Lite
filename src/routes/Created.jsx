import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CopyButton } from '../components/CopyButton';
import { ShareButton } from '../components/ShareButton';

export function Created() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pasteId, setPasteId] = useState(null);
  const [pasteUrl, setPasteUrl] = useState(null);

  useEffect(() => {
    const id = searchParams.get('pasteId');
    const url = searchParams.get('url');
    
    if (id && url) {
      setPasteId(id);
      setPasteUrl(decodeURIComponent(url));
    } else {
      // Redirect to home if no paste data
      navigate('/');
    }
  }, [searchParams, navigate]);

  if (!pasteId || !pasteUrl) {
    return null;
  }

  const handleViewPaste = () => {
    navigate(`/p/${pasteId}`);
  };

  return (
    <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
        }}>
          ✅
        </div>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)',
          marginBottom: '0.5rem'
        }}>
          Paste Created Successfully!
        </h1>
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1.125rem',
          marginBottom: '1.5rem',
          wordBreak: 'break-all'
        }}>
          {pasteUrl}
        </p>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <CopyButton text={pasteUrl} />
          <ShareButton url={pasteUrl} title="Check out this paste" />
        </div>
        <button
          onClick={handleViewPaste}
          className="btn"
          style={{ width: '100%', maxWidth: '300px' }}
        >
          View Paste
        </button>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          style={{ width: '100%', maxWidth: '300px' }}
        >
          Create Another
        </button>
      </div>
    </div>
  );
}

