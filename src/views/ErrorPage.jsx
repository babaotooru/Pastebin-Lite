import { useNavigate } from 'react-router-dom';

export function ErrorPage({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
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
            Something went wrong!
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            {error?.message || 'An unexpected error occurred'}
          </p>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          alignItems: 'center'
        }}>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="btn"
              style={{ width: '100%', maxWidth: '300px' }}
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            style={{ width: '100%', maxWidth: '300px' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

