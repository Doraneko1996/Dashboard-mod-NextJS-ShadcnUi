import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
  const isLoginPage = req.nextUrl.pathname === '/';

  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/', req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL('/dashboard/home', req.url));
  }

  return NextResponse.next();
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}