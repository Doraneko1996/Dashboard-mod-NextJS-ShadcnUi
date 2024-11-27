import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const accessToken = request.cookies.get('accessToken');
  const refreshToken = request.cookies.get('refreshToken');

  // Nếu không có cả 2 token và đang ở route protected
  if (!accessToken && !refreshToken && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu có token và đang ở trang login
  if ((accessToken || refreshToken) && path === '/') {
    return NextResponse.redirect(new URL('/dashboard/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
};