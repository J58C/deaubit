# DeauBit

DeauBit adalah aplikasi URL shortener self-hosted yang modern dan berfokus pada privasi. Dibangun dengan Next.js, PostgreSQL, dan Redis untuk kinerja tinggi.

## Fitur

- **Shortening:** Membuat tautan pendek kustom atau acak.
- **Autentikasi:** Sistem akun lengkap (Login, Register, OTP, Reset Password).
- **Analitik:** Statistik klik, browser, OS, lokasi, dan referer.
- **QR Code:** Generate QR Code otomatis untuk setiap tautan.
- **Password Protection:** Opsi mengunci tautan dengan kata sandi.
- **Expiry Date:** Mengatur tanggal kadaluarsa untuk tautan.
- **Rate Limiting:** Perlindungan anti-spam menggunakan Redis.
- **Setup Wizard:** Halaman instalasi awal untuk membuat akun admin.

## Teknologi

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Prisma ORM)
- **Cache:** Redis
- **Styling:** Tailwind CSS v4
- **Email:** Nodemailer (SMTP)

## Prasyarat

Pastikan server Anda memiliki:
- Node.js v20+
- PostgreSQL Database
- Redis Server

## Instalasi

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/deaubit.git
    cd deaubit
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    # atau npm install
    ```

3.  **Konfigurasi Environment**
    Salin `.env.example` ke `.env` dan sesuaikan isinya:

    ```env
    # Database & Redis
    DATABASE_URL="postgresql://user:pass@localhost:5432/deaubit_db"
    KV_URL="redis://localhost:6379"

    # App Config
    NEXT_PUBLIC_APP_HOST="localhost:3000"
    NEXT_PUBLIC_SHORT_HOST="localhost:3000"
    NEXT_PUBLIC_PROTOCOL="http"
    NEXT_PUBLIC_BASE_URL="http://localhost:3000"

    # Security (Wajib diganti)
    JWT_SECRET="rahasia_jwt_panjang_acak"
    CRON_SECRET="rahasia_cron_job"

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
    ```bash
    pnpm prisma generate
    pnpm prisma db push
    ```

5.  **Jalankan Server**
    ```bash
    pnpm dev
    # atau pnpm start (untuk production setelah build)
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