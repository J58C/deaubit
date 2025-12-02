//lib/mail.ts

import nodemailer from "nodemailer";

console.log("SMTP Config Check:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER ? "Set" : "Missing",
  pass: process.env.SMTP_PASS ? "Set" : "Missing",
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, otp: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP Credentials (USER/PASS) are missing in .env");
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Verifikasi Akun DeauBit",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Selamat Datang!</h2>
        <p>Kode verifikasi Anda:</p>
        <div style="background: #eee; padding: 10px; font-size: 24px; font-weight: bold;">
          ${otp}
        </div>
        <p>Berlaku 15 menit.</p>
      </div>
    `,
  });
  return info;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const appHost = process.env.NEXT_PUBLIC_APP_HOST || "localhost:3000";
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "http";
  
  const resetLink = `${protocol}://${appHost}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Reset Password DeauBit",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>Permintaan Reset Password</h2>
        <p>Anda menerima email ini karena ada permintaan untuk mengganti password akun DeauBit Anda.</p>
        <p>Klik tombol di bawah ini untuk mengganti password (berlaku 1 jam):</p>
        <a href="${resetLink}" style="display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Reset Password
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">Jika Anda tidak merasa meminta ini, abaikan saja.</p>
      </div>
    `,
  });
  return info;
}