import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
          }}>
            404
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            Page Not Found
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            The page you're looking for doesn't exist.
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
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

