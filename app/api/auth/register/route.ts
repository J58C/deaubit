//app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.verifiedAt) {
        return NextResponse.json({ error: "Email sudah digunakan." }, { status: 400 });
      }

      await prisma.user.update({
        where: { email },
        data: {
          name: name || existingUser.name,
          password: hashedPassword,
          otpSecret: otp,
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name: name || email.split("@")[0],
          email,
          password: hashedPassword,
          otpSecret: otp,
        },
      });
    }

    try {
      await sendVerificationEmail(email, otp);
    } catch (err) {
      console.error("Gagal kirim email:", err);
      return NextResponse.json(
        { message: "Registrasi berhasil, namun email verifikasi gagal terkirim. Silakan coba login untuk kirim ulang." },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { message: "Kode verifikasi telah dikirim ke email Anda." },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
