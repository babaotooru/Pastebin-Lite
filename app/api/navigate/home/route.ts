import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Redirect to home page
  const baseUrl = request.nextUrl.origin;
  return NextResponse.redirect(new URL('/', baseUrl));
}

