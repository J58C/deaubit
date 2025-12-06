# DeauBit

DeauBit adalah aplikasi URL shortener *self-hosted* yang dirancang dengan antarmuka modern (Neo-Brutalism), performa tinggi, dan fokus pada privasi. Proyek ini memberikan kendali penuh atas tautan Anda tanpa pelacak pihak ketiga.

## Fitur

* **Shortening:** Membuat tautan pendek dengan slug acak atau kustom.
* **Autentikasi:** Sistem akun lengkap (Daftar, Login, Verifikasi Email, Reset Password).
* **Analitik:** Statistik klik harian, lokasi pengunjung, perangkat, dan browser.
* **QR Code:** Pembuatan QR Code otomatis untuk setiap tautan.
* **Proteksi Password:** Mengunci tautan sensitif dengan kata sandi.
* **Mode Publik & Privat:** Pengunjung bisa membuat tautan sementara (expired 1 hari), pengguna terdaftar bisa membuat tautan permanen.
* **Keamanan:** Rate limiting, validasi IP asli, dan manajemen sesi yang aman.

## Teknologi

* **Framework:** Next.js 16 (App Router)
* **Database:** PostgreSQL (Prisma ORM)
* **Cache:** Redis (Rate limiting & caching)
* **Styling:** Tailwind CSS v4
* **Email:** Nodemailer (SMTP)

## Instalasi (Self-Hosted)

Pastikan Anda memiliki Node.js 20+, PostgreSQL, dan Redis yang sudah berjalan.

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/deaubit.git](https://github.com/username/deaubit.git)
    cd deaubit
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Konfigurasi Environment**
    Salin file `.env.example` menjadi `.env` dan sesuaikan isinya:
    ```env
    DATABASE_URL="postgresql://user:pass@localhost:5432/deaubit_db"
    KV_URL="redis://localhost:6379"

    NEXT_PUBLIC_APP_HOST="localhost:3000"
    NEXT_PUBLIC_SHORT_HOST="localhost:3000"
    NEXT_PUBLIC_PROTOCOL="http"

    JWT_SECRET="rahasia_jwt_anda"
    CRON_SECRET="rahasia_cron_job"

    SMTP_HOST="smtp.provider.com"
    SMTP_PORT="587"
    SMTP_USER="email@domain.com"
    SMTP_PASS="password_smtp"
    SMTP_FROM="DeauBit <noreply@domain.com>"
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
    ```
    Akses aplikasi di `http://localhost:3000`.