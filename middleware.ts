import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth(async function middleware(req) {
  const session = await auth();
  const { pathname } = req.nextUrl;
  
  const isLoggedIn = !!session?.user;
  const isOnDashboard = pathname.startsWith('/dashboard');
  const isOnLoginPage = pathname === '/';

  // Nếu đang ở dashboard mà chưa đăng nhập -> chuyển về trang login
  if (isOnDashboard && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  // Nếu đã đăng nhập mà vào trang login -> chuyển về dashboard
  if (isOnLoginPage && isLoggedIn) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    return NextResponse.redirect(
      new URL(callbackUrl || "/dashboard/home", req.url)
    );
  }

  return NextResponse.next();
});

export const config = { 
  matcher: ['/', '/dashboard/:path*']
};