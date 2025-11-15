import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "deaubit_token";

const RESERVED_SLUGS = new Set([
  "",
  "login",
  "api",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

function isPublicPath(pathname: string): boolean {
  if (
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname === "/api/logout" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return true;
  }
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/static")) return true;
  if (pathname.startsWith("/images")) return true;
  return false;
}

function isShortlinkPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  const slug = segments[0];
  if (RESERVED_SLUGS.has(slug)) return false;
  return true;
}

function getAuthToken(req: NextRequest): string | null {
  const cookie = req.cookies.get(AUTH_COOKIE_NAME);
  return cookie?.value ?? null;
}

function isAuthenticated(req: NextRequest): boolean {
  const token = getAuthToken(req);
  if (!token) return false;
  return true;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const authed = isAuthenticated(req);

  if (isShortlinkPath(pathname)) {
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    if (authed && pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const loginUrl = new URL("/login", req.url);
    const nextPath = pathname + (search || "");
    if (pathname !== "/") {
      loginUrl.searchParams.set("next", nextPath);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
