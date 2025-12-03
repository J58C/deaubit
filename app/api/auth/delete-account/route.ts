//app/api/auth/delete-account/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SESSION_COOKIE_NAME, verifyUserJWT } from "@/lib/auth";
import { sendAccountDeletedEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyUserJWT(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { password } = await req.json();
    if (!password) return NextResponse.json({ error: "Password wajib diisi untuk konfirmasi" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Password salah" }, { status: 401 });

    const userEmail = user.email;
    const userName = user.name || "User";

    await prisma.user.delete({ where: { id: user.id } });

    try {
        await sendAccountDeletedEmail(userEmail, userName);
    } catch (e) {
        console.error("Gagal kirim delete email:", e);
    }

    const res = NextResponse.json({ success: true });
    res.cookies.delete(SESSION_COOKIE_NAME);
    
    return res;

  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Gagal menghapus akun" }, { status: 500 });
  }
}
