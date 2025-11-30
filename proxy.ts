//proxy.ts

import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, RESERVED_SLUGS, SLUG_BASE_URL } from "@/constants";

let SLUG_HOST: string | null = null;
if (SLUG_BASE_URL) {
  try {
    SLUG_HOST = new URL(SLUG_BASE_URL).hostname;
  } catch {
    SLUG_HOST = null;
  }
}

function isShortlinkPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length !== 1) return false;

  const slug = segments[0];
  if (RESERVED_SLUGS.has(slug)) return false;

  return true;
}

function isPublicPath(pathname: string): boolean {
  const publicPaths = [
    "/",
    "/login",
    "/api/login",
    "/api/logout",
    "/api/public-links",
    "/api/session",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/api/cron/cleanup",
  ];

  if (publicPaths.includes(pathname)) {
    return true;
  }

  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/static")) return true;
  if (pathname.startsWith("/images")) return true;

  return false;
}

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get(SESSION_COOKIE_NAME);
  return !!cookie?.value;
}

export default function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  const hostHeader = req.headers.get("host") || "";
  const requestHost = hostHeader.split(":")[0];

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const authed = isAuthenticated(req);

  if (isShortlinkPath(pathname)) {
    if (SLUG_HOST && requestHost !== SLUG_HOST) {
      const search = req.nextUrl.search || "";
      const target = `${SLUG_BASE_URL}${pathname}${search}`;
      return NextResponse.redirect(target, 301);
    }

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
