'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: CopyButtonProps) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className={`btn btn-icon ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? '✓' : '📋'}
    </button>
  );
}

