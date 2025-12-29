import { NextRequest, NextResponse } from 'next/server';
import { createPaste, getCurrentTime } from '@/lib/storage';
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
    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

