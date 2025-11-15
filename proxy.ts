//proxy.ts

import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "admin_session";

const RESERVED_SLUGS = new Set([
  "",
  "login",
  "dash",
  "api",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
]);

function isPublicPath(pathname: string): boolean {
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname === "/api/logout" ||
    pathname === "/api/public-links" ||
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

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  return !!cookie?.value;
}

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
    if (authed && pathname === "/") {
      return NextResponse.redirect(new URL("/dash", req.url));
    }
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!authed) {
    const loginUrl = new URL("/", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
