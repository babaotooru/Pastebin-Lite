import { NextRequest, NextResponse } from 'next/server';
import { getPaste, getExpiresAt } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both sync and async params (for Next.js compatibility)
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const now = getCurrentTime(request.headers);

    const paste = await getPaste(id, now);

    if (!paste) {
      return NextResponse.json(
        {
          error: 'Paste not found or expired',
        },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const expiresAt = getExpiresAt(paste);

    return NextResponse.json(
      {
        content: paste.content,
        remaining_views: paste.remainingViews,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching paste:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

