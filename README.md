# DeauBit - Brutally Simple URL Shortener

DeauBit adalah aplikasi URL shortener *self-hosted* dengan desain **Neo-Brutalism** yang tegas, performa tinggi, dan fitur lengkap. Dibangun untuk Anda yang ingin kendali penuh atas tautan Anda tanpa *tracker* pihak ketiga.

![DeauBit Preview](https://via.placeholder.com/1200x600.png?text=DeauBit+Dashboard+Preview)

## ✨ Fitur Utama

* **🎨 Neo-Brutalism UI:** Desain antarmuka yang berani, kontras tinggi, border tebal, dan shadow keras. Konsisten di Light & Dark Mode.
* **🔗 Smart Shortening:** Buat shortlink dengan slug acak atau kustom.
* **🔐 Secure Authentication:** Sistem login lengkap dengan Register, Verifikasi Email (OTP), Lupa Password, dan Hapus Akun.
* **📊 Analytics:** Pantau performa link dengan grafik klik harian, lokasi (Negara/Kota), perangkat, dan browser.
* **🚀 High Performance:** Menggunakan **Next.js 16 (App Router)** dan **Redis** untuk caching & rate limiting.
* **📱 QR Code Generator:** Buat QR Code instan untuk setiap shortlink.
* **🛡️ Password Protection:** Kunci link sensitif dengan password.
* **⚡ Public & Private Mode:** Buat link instan tanpa login (expired 3 hari) atau login untuk link permanen.

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Database:** PostgreSQL (via Prisma ORM)
* **Cache & Rate Limit:** Redis (via Upstash atau Self-hosted)
* **Styling:** Tailwind CSS v4 (CSS Variables)
* **Auth:** JWT (JSON Web Tokens) & Bcrypt
* **Email:** Nodemailer (SMTP)
* **Charts:** Recharts
* **Icons:** Lucide React

## ⚙️ Prasyarat

Sebelum memulai, pastikan Anda memiliki:
* Node.js 20+
* PostgreSQL Database
* Redis Server (Lokal atau Cloud)
* SMTP Server (untuk fitur email)

## 🚀 Cara Install & Menjalankan (Local)

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/username/deaubit.git](https://github.com/username/deaubit.git)
    cd deaubit
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```

3.  **Setup Environment Variables**
    Duplikasi file `.env.example` menjadi `.env` dan isi konfigurasi berikut:

    ```env
    # --- DATABASE ---
    DATABASE_URL="postgresql://user:pass@localhost:5432/deaubit_db"
    
    # --- REDIS (Rate Limiting) ---
    KV_URL="redis://localhost:6379"

    # --- APP CONFIG ---
    # Ganti dengan domain asli saat produksi
    NEXT_PUBLIC_APP_HOST="localhost:3000"
    NEXT_PUBLIC_SHORT_HOST="localhost:3000"
    NEXT_PUBLIC_PROTOCOL="http"

    # --- SECURITY ---
    JWT_SECRET="rahasia_super_panjang_dan_acak"
    CRON_SECRET="rahasia_untuk_cron_job"

    # --- SMTP (Email) ---
    SMTP_HOST="smtp.provider.com"
    SMTP_PORT="587"
    SMTP_USER="email@domain.com"
    SMTP_PASS="password_smtp"
    SMTP_FROM="DeauBit <noreply@domain.com>"
    ```

4.  **Setup Database**
    ```bash
    # Generate Prisma Client
    pnpm prisma generate

    # Push Schema ke DB
    pnpm prisma db push
    ```

5.  **Jalankan Server Development**
    ```bash
    pnpm dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🌐 Deployment (Production)

Aplikasi ini dioptimalkan untuk deployment menggunakan **Docker** atau **VPS** (Ubuntu/Debian).

### Menggunakan Script Auto-Deploy (VPS)
Jika Anda menggunakan skema **Builder (Tencent) -> Runner (Alibaba)**:

1.  Pastikan file `deploy-to-ali.sh` sudah terkonfigurasi dengan IP server produksi.
2.  Jalankan script dari mesin lokal/builder:
    ```bash
    ./deploy-to-ali.sh
    ```
    Script ini akan otomatis build, kirim file, install dependencies produksi, dan restart PM2 di server tujuan.

### Perintah Manual (VPS)
```bash
pnpm build
pnpm start
# Atau menggunakan PM2
pm2 start npm --name "deaubit" -- start