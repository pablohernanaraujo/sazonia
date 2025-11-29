import { type NextRequest, NextResponse } from 'next/server';

/**
 * Routes that require authentication
 * Users without a session cookie will be redirected to login
 */
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

/**
 * Routes only for unauthenticated users
 * Users with a session cookie will be redirected to dashboard
 */
const authRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password'];

/**
 * Middleware for route protection
 *
 * NOTE: This middleware only checks for session cookie presence.
 * Full token verification happens in server components/actions
 * because Firebase Admin SDK cannot run in Edge runtime.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('__session')?.value;

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
