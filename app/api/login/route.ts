// app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  verifyAdminCredentials,
  signAdminJWT,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { isLoginBlocked, registerFailedLogin } from "@/lib/loginRateLimit";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Payload tidak valid." },
      { status: 400 }
    );
  }

  const { username, password } = (body || {}) as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username dan password wajib diisi." },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    (req as unknown as { ip?: string }).ip ||
    "unknown";

  const key = `login:${ip}`;

  const rate = isLoginBlocked(key);
  if (rate.blocked) {
    const retrySeconds = Math.ceil((rate.retryAfterMs ?? 60_000) / 1000);
    return NextResponse.json(
      {
        error:
          "Terlalu banyak percobaan login. Coba lagi beberapa saat lagi.",
        retryAfter: retrySeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retrySeconds),
        },
      }
    );
  }

  const ok = await verifyAdminCredentials(username, password);

  if (!ok) {
    registerFailedLogin(key);
    return NextResponse.json(
      { error: "Username atau password salah." },
      { status: 401 }
    );
  }

  const token = signAdminJWT(username);

  const res = NextResponse.json({ ok: true });

  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return res;
}
