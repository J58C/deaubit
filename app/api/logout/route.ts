import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "deaubit_token";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });

  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
