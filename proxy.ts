import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { get } from '@vercel/edge-config';

export default async function proxy(request: NextRequest) {
  // 1. Skip proxy for static assets, internal Next.js calls, and images
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

  // 2. Check Edge Config for system status
  try {
    const [status, reason, disabledPages] = await Promise.all([
      get<string>('status'),
      get<string>('reason'),
      get<any[]>('disabledPages')
    ]);
    const isUnlocked = request.cookies.get('app_unlocked')?.value === 'true';

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

    // 5. Priority 3: Disabled Pages
    if (disabledPages && Array.isArray(disabledPages)) {
      const disabledPage = disabledPages.find(p => {
        const pagePath = p.page.startsWith('/') ? p.page : `/${p.page}`;
        const normalizedPage = p.page.replace(/^\//, '');
        
        // Match the page itself or its sub-paths
        if (pathname === pagePath || pathname.startsWith(`${pagePath}/`)) return true;

        // Auto-block associated APIs
        if (normalizedPage === 'chat' && pathname.startsWith('/api/nexo')) return true;
        
        return false;
      });

      if (disabledPage) {
        if (pathname.startsWith('/api') && pathname !== '/api/status') {
          return new NextResponse(
            JSON.stringify({ 
              error: 'Forbidden', 
              message: disabledPage.reason || 'This feature is temporarily disabled.',
              status: 403 
            }),
            { 
              status: 403, 
              headers: { 'Content-Type': 'application/json' } 
            }
          );
        }
        
        if (pathname !== '/disabled' && pathname !== '/api/status') {
          const url = new URL('/disabled', request.url);
          url.searchParams.set('reason', disabledPage.reason || 'This page is temporarily disabled.');
          url.searchParams.set('page', disabledPage.page);
          url.searchParams.set('returnTo', pathname);
          return NextResponse.redirect(url);
        }
      }
    }
  } catch (error) {
    // Fallback: if Edge Config fails, let the app run
    console.error('Edge Config proxy error:', error);
  }

  return NextResponse.next();
}

// Optional: Configure which paths the proxy runs on
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
