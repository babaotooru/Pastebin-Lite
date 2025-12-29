import { NextRequest, NextResponse } from 'next/server';
import { getPasteReadOnly, getCurrentTime, getExpiresAt } from '@/lib/storage';

/**
 * Get paste stats without decrementing views (for real-time updates)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;
    const now = getCurrentTime(request.headers);

    const paste = await getPasteReadOnly(id, now);

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
        remaining_views: paste.remainingViews,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      },
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching paste stats:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

