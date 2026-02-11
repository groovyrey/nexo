import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import { logIncident } from '@/lib/incidents';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const correctPassword = await get<string>('password');

    if (password === correctPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set a cookie that expires in 24 hours
      response.cookies.set('app_unlocked', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      console.log('API Unlock - Password correct, cookie set.');
      return response;
    }

    // Log failed attempt as incident
    await logIncident('AUTH_FAILURE', 'POST /api/unlock', 'Invalid security key attempt detected.');

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error: any) {
    await logIncident('AUTH_CRASH', 'POST /api/unlock', error.message || 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
