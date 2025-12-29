import { NextResponse } from 'next/server';
import { checkStorageHealth } from '@/lib/storage';

export async function GET() {
  const storageHealthy = await checkStorageHealth();

  return NextResponse.json(
    {
      status: 'ok',
      storage: storageHealthy ? 'available' : 'unavailable',
      timestamp: new Date().toISOString(),
    },
    {
      status: storageHealthy ? 200 : 503,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

