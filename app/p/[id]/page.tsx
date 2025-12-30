import { notFound } from 'next/navigation';
import { getPaste, getExpiresAt } from '@/lib/paste';
import { formatContentForDisplay } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';
import { headers } from 'next/headers';
import { PasteViewer } from '@/components/PasteViewer';

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
    <PasteViewer
      pasteId={resolvedParams.id}
      content={paste.content}
      contentHtml={contentHtml}
      remainingViews={paste.remainingViews}
      expiresAt={expiresAt}
    />
  );
}
