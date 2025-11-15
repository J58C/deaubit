//app/api/session/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminJWT,
  signAdminJWT,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    const res = NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  }

  const payload = verifyAdminJWT(token);
  if (!payload) {
    const res = NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
    res.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  }

  const newToken = signAdminJWT(payload.username);

  const res = NextResponse.json({
    authenticated: true,
    username: payload.username,
  });

  res.cookies.set(SESSION_COOKIE_NAME, newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  return res;
}
