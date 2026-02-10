import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  // 1. Skip middleware for static assets, internal Next.js calls, and the maintenance page itself
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/health') ||
    pathname === '/favicon.ico' ||
    pathname === '/nexo.png' ||
    pathname === '/maintenance'
  ) {
    return NextResponse.next();
  }

  // Exception for localhost
  if (request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  try {
    // 2. Check Edge Config for system status
    const status = await get<string>('status');

    // 3. If in maintenance mode, redirect/rewrite to maintenance page
    if (status === 'maintenance') {
      if (pathname.startsWith('/api')) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Service Unavailable', 
            message: 'Nexo AI is currently undergoing scheduled maintenance.',
            status: 503 
          }),
          { 
            status: 503, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
      // We use rewrite so the URL doesn't change, but the content is the maintenance page
      return NextResponse.rewrite(new URL('/maintenance', request.url));
    }
  } catch (error) {
    // Fallback: if Edge Config fails, let the app run
    console.error('Edge Config middleware error:', error);
  }

  return NextResponse.next();
}

// Optional: Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
