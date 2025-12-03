//lib/mail.ts

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getEmailTemplate(title: string, bodyContent: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e4e4e7; }
        .header { background-color: #4f46e5; padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .content { padding: 40px 30px; color: #334155; line-height: 1.6; }
        .footer { background-color: #fafafa; padding: 20px; text-align: center; font-size: 12px; color: #a1a1aa; border-top: 1px solid #f4f4f5; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }
        .otp-box { background-color: #f0f9ff; border: 2px dashed #4f46e5; color: #4f46e5; font-size: 32px; font-weight: 900; text-align: center; padding: 20px; margin: 20px 0; letter-spacing: 8px; border-radius: 8px; }
        .text-muted { color: #64748b; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DeauBit</h1>
        </div>
        <div class="content">
          <h2 style="margin-top: 0; color: #0f172a;">${title}</h2>
          ${bodyContent}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} DeauBit URL Shortener. All rights reserved.</p>
          <p>This email was sent automatically. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail(email: string, otp: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP Credentials missing");
  }

  const htmlContent = `
    <p>Halo,</p>
    <p>Terima kasih telah mendaftar di DeauBit. Untuk mengamankan akun Anda, silakan masukkan kode verifikasi berikut:</p>
    
    <div class="otp-box">${otp}</div>
    
    <p class="text-muted">Kode ini hanya berlaku selama <strong>15 menit</strong>. Jangan berikan kode ini kepada siapa pun, termasuk pihak DeauBit.</p>
    <p>Jika Anda tidak merasa mendaftar, abaikan email ini.</p>
  `;

  return await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Kode Verifikasi: ${otp} - DeauBit`,
    html: getEmailTemplate("Verifikasi Email Anda", htmlContent),
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const appHost = process.env.NEXT_PUBLIC_APP_HOST || "localhost:3000";
  const protocol = process.env.NEXT_PUBLIC_PROTOCOL || "http";
  const resetLink = `${protocol}://${appHost}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

  const htmlContent = `
    <p>Halo,</p>
    <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun DeauBit Anda.</p>
    <p>Klik tombol di bawah ini untuk membuat kata sandi baru:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" class="btn">Reset Password Saya</a>
    </div>
    
    <p class="text-muted">Tautan ini akan kadaluarsa dalam <strong>1 jam</strong>.</p>
    <p class="text-muted" style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
      Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut ke browser Anda:<br>
      <a href="${resetLink}" style="color: #4f46e5; word-break: break-all;">${resetLink}</a>
    </p>
  `;

  return await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Permintaan Reset Password - DeauBit",
    html: getEmailTemplate("Reset Password", htmlContent),
  });
}
