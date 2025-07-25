import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/child-dashboard(.*)',
  '/guardian-dashboard(.*)',
  '/assessment(.*)'
]);

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/auth/sync-user'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // If the user is not authenticated, redirect them to the sign-in page
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Get the user's role from the session claims
    const userRole = (sessionClaims?.metadata as any)?.userType;
    const path = req.nextUrl.pathname;
    
    // If user has a role, enforce role-based routing
    if (userRole) {
      // Redirect child users trying to access guardian dashboard
      if (userRole === 'child' && path.startsWith('/guardian-dashboard')) {
        return NextResponse.redirect(new URL('/child-dashboard', req.url));
      }

      // Redirect guardian users trying to access child dashboard or assessments
      if (userRole === 'guardian' && (path.startsWith('/child-dashboard') || path.startsWith('/assessment'))) {
        return NextResponse.redirect(new URL('/guardian-dashboard', req.url));
      }

      // If accessing root dashboard paths, redirect to appropriate dashboard
      if (path === '/child-dashboard' && userRole === 'guardian') {
        return NextResponse.redirect(new URL('/guardian-dashboard', req.url));
      }
      
      if (path === '/guardian-dashboard' && userRole === 'child') {
        return NextResponse.redirect(new URL('/child-dashboard', req.url));
      }
    } else {
      // If no role is set in metadata, try to determine from the path they're trying to access
      // This handles cases where database is synced but Clerk metadata isn't
      console.log('User has no role in metadata, checking database sync...');
      
      // For now, allow access and let the dashboard handle the sync
      // The dashboard will call the sync-user API if needed
    }
  }

  // Handle post-authentication redirects from Clerk
  if (req.url.includes('__clerk_redirect_url')) {
    const { userId, sessionClaims } = await auth();
    if (userId) {
      const userRole = (sessionClaims?.metadata as any)?.userType;
      
      if (userRole === 'child') {
        return NextResponse.redirect(new URL('/child-dashboard', req.url));
      } else if (userRole === 'guardian') {
        return NextResponse.redirect(new URL('/guardian-dashboard', req.url));
      }
      
      // If no role, redirect to a neutral page or handle appropriately
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});

// See https://clerk.com/docs/references/nextjs/auth-middleware for more info
export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)'
  ],
}; 