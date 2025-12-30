import { NextResponse } from 'next/server';
import { checkStorageHealth } from '@/lib/redis';

export async function GET() {
  try {
    const storageHealthy = await checkStorageHealth();
    const hasConfig = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

    return NextResponse.json(
      {
        status: 'ok',
        storage: storageHealthy ? 'available' : 'unavailable',
        configured: hasConfig,
        timestamp: new Date().toISOString(),
        ...(hasConfig ? {} : { 
          message: 'KV_REST_API_URL and KV_REST_API_TOKEN environment variables are required',
          help: 'See VERCEL_SETUP.md for setup instructions'
        }),
      },
      {
        status: storageHealthy ? 200 : 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        storage: 'unavailable',
        configured: !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN),
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

