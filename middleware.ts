import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');
  const path = request.nextUrl.pathname;

  // Nếu đã đăng nhập và cố truy cập trang login
  if (accessToken && path === '/') {
    return NextResponse.redirect(new URL('/dashboard/home', request.url));
  }

  // Nếu chưa đăng nhập và truy cập vào route được bảo vệ
  if (!accessToken && path.startsWith('/dashboard')) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('auth_redirect', 'unauthorized', {
      maxAge: 5, // Cookie tồn tại 5 giây
      path: '/'
    });
    return response;
  }

  return NextResponse.next();
}
