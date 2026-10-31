import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Protects /dashboard: signed-out visitors are redirected to /login.
export async function proxy(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
