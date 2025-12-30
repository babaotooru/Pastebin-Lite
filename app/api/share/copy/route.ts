import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Return the URL as JSON for client-side copying
  return NextResponse.json(
    { url, message: 'URL ready to copy' },
    { status: 200 }
  );
}


