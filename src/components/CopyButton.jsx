import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

export function CopyButton({ text, className = '' }) {
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

