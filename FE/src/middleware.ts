import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Tanımladığınız yollar
const publicPaths = ['/', '/login', '/blog', '/tag/:path*', '/post/:path*'];
const privatePaths = [
  '/blog/create-post',
  '/blog/saved-posts',
  '/blog/edit-post',
  '/blog/edit-post/:path*',
  '/profile-settings',
];

const loginPath = '/login';
const redirectPath = '/blog';

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('authState');
  const authCookieValue = authCookie?.value;

  const isAuthenticated = Boolean(authCookieValue && JSON.parse(authCookieValue)?.isAuthenticated);

  const pathname = request.nextUrl.pathname;

  // Helper function to match wildcard paths
  const matchesPath = (path: string) => {
    // Remove wildcard for comparison
    const pathWithoutWildcard = path.split(':')[0];
    // Check if the path matches the pattern
    return (
      pathname.startsWith(pathWithoutWildcard) &&
      (path.endsWith('*') || pathname === pathWithoutWildcard)
    );
  };

  // Determine if the request is for a public path
  const isPublicPath = publicPaths.some(matchesPath);

  if (isAuthenticated) {
    // Allow access to all paths if authenticated
    return NextResponse.next();
  }

  if (!isAuthenticated && !isPublicPath) {
    // Redirect to login if not authenticated and trying to access a private path
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

// Yönlendirme yapılacak yolları belirtir
export const config = {
  matcher: [
    '/',
    '/login',
    '/blog',
    '/tag/:path*',
    '/post/:path*',
    '/blog/create-post',
    '/blog/saved-posts',
    '/blog/edit-post',
    '/blog/edit-post/:path*',
    '/profile-settings',
  ],
};
