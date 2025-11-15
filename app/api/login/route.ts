import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const AUTH_COOKIE_NAME = "deaubit_token";

async function createToken() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);
  const token = await new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey);
  return token;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const username = String(body.username || "");
  const password = String(body.password || "");

  const adminUser = process.env.ADMIN_USERNAME || "deauport";
  const adminPass = process.env.ADMIN_PASSWORD || "changeme";

  if (username !== adminUser || password !== adminPass) {
    return NextResponse.json(
      { error: "Username atau password salah" },
      { status: 401 },
    );
  }

  const token = await createToken();

  const res = NextResponse.json({ ok: true });

  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
