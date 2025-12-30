import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="container">
      <div className="header">
        <h1>✨ Pastebin-Lite</h1>
        <p>Create and share text snippets with real-time updates</p>
      </div>
      <Outlet />
    </div>
  );
}

