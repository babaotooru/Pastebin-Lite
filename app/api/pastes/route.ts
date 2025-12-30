import { NextRequest, NextResponse } from 'next/server';
import { createPaste } from '@/lib/paste';
import { getCurrentTime } from '@/lib/time';
import { validateCreatePasteRequest } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateCreatePasteRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const now = getCurrentTime(request.headers);
    const result = await createPaste(
      body.content,
      body.ttl_seconds ?? null,
      body.max_views ?? null,
      now
    );

    return NextResponse.json(result, {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
        },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Error creating paste:', error);
    
    // Check if it's a KV configuration error
    if (error instanceof Error && error.message.includes('KV_REST_API')) {
      return NextResponse.json(
        {
          error: 'Storage not configured',
          message: 'Vercel KV environment variables are missing. Please configure KV_REST_API_URL and KV_REST_API_TOKEN in your Vercel project settings.',
          details: 'See VERCEL_SETUP.md for instructions',
        },
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

