import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const hasUser = request.cookies.has('accessToken');

  if (hasUser && path === '/') {
    return NextResponse.redirect(new URL('/dashboard/home', request.url));
  }

  if (!hasUser && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}