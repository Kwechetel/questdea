import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    // Check role - use type assertion to ensure proper typing
    const role = token?.role as Role | undefined;
    const isAdmin = role === Role.ADMIN;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // Protect admin routes - only ADMIN role can access
    if (isAdminRoute && !isAdmin) {
      const loginUrl = new URL("/admin-access", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

        // If accessing admin route, must be authenticated AND be admin
        if (isAdminRoute) {
          const role = token?.role as Role | undefined;
          const isAdmin = role === Role.ADMIN;
          return !!token && isAdmin;
        }

        // Other routes don't require auth
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};

