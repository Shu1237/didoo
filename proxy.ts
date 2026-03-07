
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { Roles } from '@/utils/enum';
import { cookies } from 'next/headers'
import { decodeJWT } from '@/lib/utils';
import { JWTUserType } from '@/types/user';

// Define public routes that don't require authentication
const publicPaths = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/confirm',
  '/api/login',
  '/api/logout',
  '/api/refresh_token',
];

// Define role-based route access - Map URL prefixes to allowed roles
// Token chỉ có USER và ADMIN. Organizer = User có organizerId (verified) - dùng role USER để vào /organizer
const rolePermissions: Record<string, Roles[]> = {
  '/admin': [Roles.ADMIN],
  '/organizer': [Roles.USER, Roles.ORGANIZER], // USER: user upgrade lên organizer (check organizerId + status ở layout/page)
  '/home': [Roles.USER, Roles.GUEST],
  '/user': [Roles.USER, Roles.GUEST],
  '/events': [Roles.USER, Roles.GUEST],
  '/organizers': [Roles.USER, Roles.GUEST],
  '/map': [Roles.USER, Roles.GUEST],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublic =
    publicPaths.some(path => pathname.startsWith(path)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/public') ||
    pathname === '/';

  // Case 1: Public route
  if (isPublic) {
    return NextResponse.next();
  }
  // Case 2: No refresh_token -> Middleware blocks immediately (As per AuthContext logic)
  if (!refreshToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // 3. Validate Access Token if it exists
  if (accessToken) {
    try {
      const user = decodeJWT<JWTUserType>(accessToken);

      // Token hết hạn: giữ cookie để AuthContext gọi refresh (BE chỉ chấp nhận khi token ĐÃ hết hạn)
      const currentTime = Math.floor(Date.now() / 1000);
      if (user.exp < currentTime) {
        return NextResponse.next();
      }

      // Valid Token -> Check Role-based Access (RBAC)
      const matchedPath = Object.keys(rolePermissions).find(path => pathname.startsWith(path));
      if (matchedPath) {
        const allowedRoles = rolePermissions[matchedPath];
        const userRole = user.Role as Roles;

        if (!allowedRoles.includes(userRole)) {
          // Sai quyền truy cập -> redirect về login
          const url = new URL('/login', request.url);
          url.searchParams.set('redirect', pathname);
          return NextResponse.redirect(url);
        }
      }

    } catch (error) {
      console.error("Token decoding failed:", error);
      // Invalid token structure -> redirect về login
      const url = new URL('/login', request.url);
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Case 3: No Access Token, có Refresh Token.
  // Cho request đi qua → Layout nhận [null, refreshToken].
  // AuthContext không refresh được (thiếu UserId từ access token) → redirect /login.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
