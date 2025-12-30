'use client';

import { useState, useEffect } from 'react';

interface ExpiresDateProps {
  timestamp: number;
}

export function ExpiresDate({ timestamp }: ExpiresDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Format date consistently on client side only
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    setFormattedDate(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
  }, [timestamp]);

  if (!formattedDate) return null;

  return (
    <div className="paste-meta-item" style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
      Expires: {formattedDate}
    </div>
  );
}


