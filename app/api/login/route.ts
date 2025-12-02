//app/api/login/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signUserJWT, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/auth";
import { isLoginBlocked, registerFailedLogin } from "@/lib/loginRateLimit";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const { email, password } = (body || {}) as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `login:${ip}`;
  const rate = isLoginBlocked(key);
  
  if (rate.blocked) {
    const retrySeconds = Math.ceil((rate.retryAfterMs ?? 60_000) / 1000);
    return NextResponse.json(
      { error: `Terlalu banyak percobaan. Tunggu ${retrySeconds} detik.`, retryAfter: retrySeconds },
      { status: 429 }
    );
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      registerFailedLogin(key);
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      registerFailedLogin(key);
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    if (!user.verifiedAt) {
      return NextResponse.json({ error: "Akun belum diverifikasi. Cek email Anda." }, { status: 403 });
    }

    const token = signUserJWT({
      id: user.id,
      email: user.email,
      name: user.name || "",
    });

    const res = NextResponse.json({ ok: true });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return res;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
