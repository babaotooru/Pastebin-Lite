import { useNavigate } from 'react-router-dom';

export function Expired() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
          }}>
            ⏰
          </div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 700, 
            color: 'var(--error)',
            marginBottom: '0.5rem'
          }}>
            Paste Expired
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.125rem',
            marginBottom: '1.5rem'
          }}>
            This paste has expired or reached its maximum view limit.
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
            Create New Paste
          </button>
        </div>
      </div>
    </div>
  );
}

