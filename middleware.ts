import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  '/child-dashboard(.*)',
  '/guardian-dashboard(.*)'
]);

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
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

    // Redirect to the correct dashboard based on the user's role
    if (userRole === 'child' && !path.startsWith('/child-dashboard')) {
      return NextResponse.redirect(new URL('/child-dashboard', req.url));
    }

    if (userRole === 'guardian' && !path.startsWith('/guardian-dashboard')) {
      return NextResponse.redirect(new URL('/guardian-dashboard', req.url));
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