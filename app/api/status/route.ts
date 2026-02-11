import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [status, reason, version] = await Promise.all([
      get<string>('status'),
      get<string>('reason'),
      get<string>('version')
    ]);
    return NextResponse.json({ status, reason, version });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch status' }, { status: 500 });
  }
}
