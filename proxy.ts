import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { JWTUserType, UserRole } from "@/utils/type";
import { getAllowedRoles } from "@/utils/permissions";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/home",
  "/events",
  "/login",
  "/register",
  "/forgot-password",
];

// Auth routes (should redirect if already logged in)
const authRoutes = ["/login", "/register", "/forgot-password"];

// Role-based route mapping
const roleRoutes: Record<UserRole, string[]> = {
  admin: ["/admin"],
  organizer: ["/organizer"],
  user: ["/user"],
  staff: ["/organizer"], // Staff can access organizer routes
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // Check if route is auth route
  const isAuthRoute = authRoutes.some((route) => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  // If no token and trying to access protected route
  if (!refreshToken && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If has token and trying to access auth routes, redirect to home
  if (refreshToken && isAuthRoute) {
      // Decode token to get user role
      try {
        const user = jwtDecode<JWTUserType>(accessToken || "");
        const redirectPath = getDefaultRouteForRole(user.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      } catch {
        // Invalid token, allow access to auth routes
        return NextResponse.next();
      }
  }

  // Role-based access control
  if (accessToken && refreshToken) {
      try {
        const user = jwtDecode<JWTUserType>(accessToken);
        const allowedRoles = getAllowedRoles(pathname);

      // If route has role restrictions
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to default route for user's role
        const redirectPath = getDefaultRouteForRole(user.role);
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }

      // Check if user is accessing route outside their role group
      if (pathname.startsWith("/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      if (pathname.startsWith("/organizer") && !["organizer", "admin", "staff"].includes(user.role)) {
        return NextResponse.redirect(new URL("/home", request.url));
      }

      if (pathname.startsWith("/user") && user.role === "admin") {
        // Admin can access user routes, but redirect to admin dashboard by default
        if (pathname === "/user" || pathname === "/user/") {
          return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
      }
    } catch (error) {
      // Invalid token, clear cookies and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
  }

  return NextResponse.next();
}

function getDefaultRouteForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "organizer":
      return "/organizer/dashboard";
    case "staff":
      return "/organizer/dashboard";
    case "user":
    default:
      return "/home";
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
