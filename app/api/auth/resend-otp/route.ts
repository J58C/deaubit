// app/api/auth/resend-otp/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  
  const limit = await checkRateLimit(ip, "resend_otp");

  if (!limit.ok) {
    return NextResponse.json(
      { error: `Tunggu ${Math.ceil((limit.retryAfter || 60) / 60)} menit sebelum kirim ulang.` },
      { status: 429 }
    );
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email diperlukan" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.verifiedAt) {
      return NextResponse.json({ error: "Akun sudah diverifikasi." }, { status: 400 });
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.user.update({
      where: { email },
      data: { otpSecret: newOtp },
    });

    await sendVerificationEmail(email, newOtp);

    return NextResponse.json({ message: "Kode baru telah dikirim." }, { status: 200 });

  } catch (error) {
    console.error("Resend OTP Error:", error);
    return NextResponse.json({ error: "Gagal mengirim ulang." }, { status: 500 });
  }
}
