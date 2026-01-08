//app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOTP } from "@/lib/auth"; 
import { sendPasswordResetEmail } from "@/lib/mail";
import { verifyTurnstileWithCookie } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  try {
    const { email, cfTurnstile } = await req.json();

    const turnstileCheck = await verifyTurnstileWithCookie(req, cfTurnstile);
    if (!turnstileCheck.success) {
        return NextResponse.json({ error: "Security check failed." }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    const successResponse = NextResponse.json({ message: "If email exists, reset link sent." });

    if (turnstileCheck.cookieAction) {
       if (!user) return turnstileCheck.cookieAction(successResponse);
    } else {
       if (!user) return successResponse;
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: otp,
        resetTokenExpiry: expires,
      },
    });

    await sendPasswordResetEmail(user.email, otp);

    if (turnstileCheck.cookieAction) {
        return turnstileCheck.cookieAction(successResponse);
    }
    return successResponse;

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
