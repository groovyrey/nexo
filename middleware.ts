import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

export async function middleware(request: NextRequest) {
  // 1. Skip middleware for static assets, internal Next.js calls, and images
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api/health') ||
    pathname === '/favicon.ico' ||
    pathname === '/nexo.png'
  ) {
    return NextResponse.next();
  }

  // Exception for localhost
  if (request.nextUrl.hostname === 'localhost' || request.nextUrl.hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  // 2. Check Edge Config for system status
  try {
    const [status, reason] = await Promise.all([
      get<string>('status'),
      get<string>('reason')
    ]);
    const isUnlocked = request.cookies.get('app_unlocked')?.value === 'true';

    console.log(`Middleware - Path: ${pathname}, Status: ${status}, Reason: ${reason}, Unlocked: ${isUnlocked}`);

    // 3. Priority 1: Locked Status
    if (status === 'locked') {
      if (!isUnlocked) {
        if (pathname.startsWith('/api') && pathname !== '/api/unlock' && pathname !== '/api/status') {
          return new NextResponse(
            JSON.stringify({ 
              error: 'Locked', 
              message: reason || 'System access is restricted. Authentication required.',
              status: 403 
            }),
            { 
              status: 403, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        }
        
        if (pathname !== '/locked' && pathname !== '/api/unlock' && pathname !== '/api/status') {
          const url = new URL('/locked', request.url);
          if (reason) url.searchParams.set('reason', reason);
          return NextResponse.redirect(url);
        }
        return NextResponse.next();
      }
    }

    // 4. Priority 2: Maintenance Status
    if (status === 'maintenance') {
      if (pathname.startsWith('/api') && pathname !== '/api/status') {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Service Unavailable', 
            message: reason || 'Nexo AI is currently undergoing scheduled maintenance.',
            status: 503 
          }),
          { 
            status: 503, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
      if (pathname !== '/maintenance' && pathname !== '/api/status') {
        const url = new URL('/maintenance', request.url);
        if (reason) url.searchParams.set('reason', reason);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
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
