import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ IMPORTANT: Exclude ALL API routes and Next internals from i18n
  if (
    pathname.startsWith('/api') || // exclude every API route (not only /api/auth)
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    /\.[^/]+$/.test(pathname) // exclude files like /images/logo.png
  ) {
    return NextResponse.next();
  }

  // Handle internationalization for other routes
  return intlMiddleware(request);
}

// Apply middleware to all non-API, non-static paths
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};