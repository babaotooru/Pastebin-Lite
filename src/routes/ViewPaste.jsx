import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPaste } from '../services/api';
import { PasteBox } from '../components/PasteBox';
import { formatContentForDisplay } from '../lib/paste';

export function ViewPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate('/404');
      return;
    }

    const fetchPaste = async () => {
      try {
        setLoading(true);
        const data = await getPaste(id);
        
        const contentHtml = formatContentForDisplay(data.content);
        const expiresAt = data.expires_at ? new Date(data.expires_at).getTime() : null;

        setPaste({
          ...data,
          contentHtml,
          expiresAt,
        });
        setError(null);
      } catch (err) {
        setError(err.message);
        if (err.message.includes('not found') || err.message.includes('expired')) {
          setTimeout(() => {
            navigate('/expired');
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <div className="loading" style={{ 
            width: '3rem', 
            height: '3rem', 
            margin: '2rem auto',
            borderWidth: '4px'
          }}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            Loading paste...
          </p>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="container">
        <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h1 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Error</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            {error || 'Paste not found'}
          </p>
          <button onClick={() => navigate('/')} className="btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <PasteBox
      pasteId={id}
      content={paste.content}
      contentHtml={paste.contentHtml}
      remainingViews={paste.remaining_views}
      expiresAt={paste.expiresAt}
    />
  );
}

