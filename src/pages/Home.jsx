import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PasteForm } from '../components/PasteForm';

export function Home() {
  const navigate = useNavigate();
  const [createdPaste, setCreatedPaste] = useState(null);

  const handleSuccess = (pasteId, url) => {
    setCreatedPaste({ id: pasteId, url });
    navigate(`/created?pasteId=${pasteId}&url=${encodeURIComponent(url)}`);
  };

  return <PasteForm onSuccess={handleSuccess} />;
}

