export default function CopyLoading() {
  return (
    <div className="container">
      <div className="card text-center" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div className="loading" style={{ 
          width: '3rem', 
          height: '3rem', 
          margin: '2rem auto',
          borderWidth: '4px'
        }}></div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Preparing to copy...
        </p>
      </div>
    </div>
  );
}


