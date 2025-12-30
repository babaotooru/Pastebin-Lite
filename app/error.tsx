'use client';

import { ErrorBox } from '@/components/ErrorBox';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorBox error={error} reset={reset} />;
}


