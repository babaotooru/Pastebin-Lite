export default function Loading() {
  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="loading" style={{ 
          width: '3rem', 
          height: '3rem', 
          margin: '2rem auto',
          borderWidth: '4px'
        }}></div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

