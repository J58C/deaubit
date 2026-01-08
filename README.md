# DeauBit

DeauBit adalah aplikasi URL shortener self-hosted yang modern dan berfokus pada privasi. Dibangun dengan Next.js dan PostgreSQL.

## Fitur

- **Shortening:** Membuat tautan pendek kustom atau acak.
- **Autentikasi:** Sistem akun lengkap (Login, Register, OTP, Reset Password).
- **Analitik:** Statistik klik, browser, OS, lokasi, dan referer.
- **QR Code:** Generate QR Code otomatis untuk setiap tautan.
- **Password Protection:** Opsi mengunci tautan dengan kata sandi.
- **Expiry Date:** Mengatur tanggal kadaluarsa untuk tautan.
- **Rate Limiting:** Perlindungan anti-spam ringan menggunakan *In-Memory Map*.
- **Bot Protection:** Integrasi Cloudflare Turnstile untuk mencegah bot pada halaman Login & Register.
- **Setup Wizard:** Halaman instalasi awal untuk membuat akun admin.

## Teknologi

- **Runtime:** Bun
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Prisma ORM)
- **Security:** Cloudflare Turnstile
- **Styling:** Tailwind CSS v4
- **Email:** Nodemailer (SMTP)

## Prasyarat

Pastikan server Anda memiliki:
- **Node.js**
- **PostgreSQL Database**

## Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/j58c/deaubit.git
    cd deaubit
    ```

2.  **Install Dependencies**
    Menggunakan Bun package manager:
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment**
    Salin `.env.example` ke `.env` dan sesuaikan isinya:

    ```env
    # Database
    DATABASE_URL="postgresql://user:pass@localhost:5432/deaubit_db"

    # App Config
    NEXT_PUBLIC_APP_HOST="localhost:3000"
    NEXT_PUBLIC_SHORT_HOST="localhost:3000"
    NEXT_PUBLIC_PROTOCOL="http"
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"

    # Security (Wajib diganti dengan string acak)
    JWT_SECRET="rahasia_jwt_panjang_acak"
    CRON_SECRET="rahasia_cron_job"
    
    # Cloudflare Turnstile (Wajib untuk Login/Register)
    NEXT_PUBLIC_TURNSTILE_SITE_KEY="<SITE_KEY_DARI_CLOUDFLARE>"
    TURNSTILE_SECRET_KEY="<SECRET_KEY_DARI_CLOUDFLARE>"

    # SMTP Email (Wajib untuk OTP & Reset Password)
    SMTP_HOST="smtp.provider.com"
    SMTP_PORT="587"
    SMTP_USER="email@domain.com"
    SMTP_PASS="password_smtp"
    SMTP_FROM="DeauBit <noreply@domain.com>"
    
    # Abuse Report
    ABUSE_REPORT_EMAIL="admin@domain.com"
    ```

4.  **Setup Database**
    Generate client Prisma untuk runtime Bun:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Jalankan Server**
    Untuk pengembangan (Development):
    ```bash
    npm dev
    ```

    Untuk produksi (Production):
    ```bash
    npm run build
    npm run start
    ```

## Setup Admin

Setelah aplikasi berjalan, Anda wajib membuat akun Administrator pertama untuk mengelola sistem:

1. Buka browser dan akses: `http://localhost:3000/setup`
2. Isi nama, email, dan password untuk akun root.
3. Masukkan kode OTP yang dikirim ke email.
4. Halaman setup akan terkunci otomatis setelah admin dibuat.

## Cron Job (Pembersihan Link)

Untuk menghapus tautan yang sudah kadaluarsa secara otomatis, buat cron job yang memanggil endpoint API berikut (misal: setiap jam):

```bash
curl -X POST http://localhost:3000/api/cron/cleanup \
     -H "Authorization: Bearer RAHASIA_CRON_JOB"
```
*Ganti `RAHASIA_CRON_JOB` sesuai nilai `CRON_SECRET` di file .env.*

## Docker Deployment

Build dan jalankan menggunakan Docker:

```bash
docker build -t deaubit .
docker run -p 3000:3000 --env-file .env deaubit
```

## Lisensi

[MIT License](LICENSE)