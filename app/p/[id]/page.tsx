import { notFound } from 'next/navigation';
import { getPaste, getCurrentTime, getExpiresAt } from '@/lib/storage';
import { formatContentForDisplay } from '@/lib/utils';
import { headers } from 'next/headers';
import { PasteViewClient } from '@/components/PasteViewClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ViewPastePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const headersList = await headers();
  const now = getCurrentTime(headersList);
  
  const paste = await getPaste(resolvedParams.id, now);

  if (!paste) {
    notFound();
  }

  const expiresAt = getExpiresAt(paste);
  const contentHtml = formatContentForDisplay(paste.content);

  return (
    <PasteViewClient
      pasteId={resolvedParams.id}
      content={paste.content}
      contentHtml={contentHtml}
      remainingViews={paste.remainingViews}
      expiresAt={expiresAt}
    />
  );
}
