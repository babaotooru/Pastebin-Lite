import { Suspense } from 'react';
import { PasteForm } from '@/components/PasteForm';

export default function HomePage() {
  return (
    <div className="container">
      <div className="header">
        <h1>✨ Pastebin-Lite</h1>
        <p>Create and share text snippets with real-time updates</p>
      </div>
      <Suspense fallback={
        <div className="card text-center">
          <div className="loading" style={{ margin: '2rem auto' }}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading...</p>
        </div>
      }>
        <PasteForm />
      </Suspense>
    </div>
  );
}
