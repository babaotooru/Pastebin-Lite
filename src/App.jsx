import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Created } from './pages/Created';
import { ViewPaste } from './pages/ViewPaste';
import { Expired } from './pages/Expired';
import { NotFound } from './pages/NotFound';
import { ErrorPage } from './pages/ErrorPage';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorPage error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
      onReset={() => window.location.href = '/'}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="created" element={<Created />} />
            <Route path="p/:id" element={<ViewPaste />} />
            <Route path="expired" element={<Expired />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

