import { authEdge } from "@/lib/auth-edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(
  req: NextRequest
) {
  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
  ];

  const isPublicRoute =
    publicRoutes.includes(pathname);

  // Public routes
  if (
    isPublicRoute ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Allow API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Protected routes
  const session = await authEdge();

  if (!session?.user) {
    return NextResponse.redirect(
      new URL("/sign-in", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};