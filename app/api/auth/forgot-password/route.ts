//app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limit = await checkRateLimit(ip, "forgot_pass");

  if (!limit.ok) {
    return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });
  }

  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ message: "Jika email terdaftar, link reset telah dikirim." }, { status: 200 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    try {
      await sendPasswordResetEmail(email, token);
    } catch (err) {
      return NextResponse.json({ error: "Gagal mengirim email." }, { status: 500 });
    }

    return NextResponse.json({ message: "Jika email terdaftar, link reset telah dikirim." }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
