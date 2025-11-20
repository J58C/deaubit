# DeauBit - Elegant URL Shortener

DeauBit adalah aplikasi URL shortener yang elegan dan mudah digunakan, dirancang untuk di-deploy pada VPS Anda sendiri. Aplikasi ini dibangun dengan Next.js 16, Prisma, dan PostgreSQL.

## Fitur

- ✨ **URL Shortening** - Buat shortlink dengan slug acak atau custom
- 🔒 **Admin Authentication** - Login dengan JWT untuk mengelola shortlinks
- 🌐 **Public Links** - Buat shortlink tanpa login untuk akses publik
- 🎨 **UI Modern** - Design yang indah dengan dark mode support
- 🚀 **Performance** - Standalone mode untuk deployment yang optimal
- 🔐 **Rate Limiting** - Perlindungan terhadap abuse

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) dengan App Router
- **Database**: PostgreSQL dengan [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT dengan bcryptjs
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Runtime**: Node.js

## Prerequisites

- Node.js 20+ atau compatible runtime
- PostgreSQL database
- pnpm (recommended) atau npm/yarn

## Setup & Installation

### 1. Clone repository

```bash
git clone <repository-url>
cd deauport-shortlink
```

### 2. Install dependencies

```bash
pnpm install
# atau
npm install
```

### 3. Configure environment variables

Buat file `.env` di root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shortlink_db"

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET="your-super-secret-jwt-key"

# Admin Credentials (password harus bcrypt hash)
# Generate hash: node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="$2a$10$..."

# Base URL for shortlinks (optional, untuk canonical redirects)
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

### 4. Setup database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate deploy
```

### 5. Run development server

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## Production Deployment

### Build aplikasi

```bash
pnpm build
```

### Start production server

```bash
pnpm start
```

### Docker Deployment (dengan standalone output)

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

## Project Structure

```
deauport-shortlink/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dash/              # Dashboard untuk admin
│   └── page.tsx           # Login & public shortlink page
├── components/            # React components
│   ├── LoginForm.tsx
│   ├── PublicShortlinkForm.tsx
│   └── ...
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication functions
│   ├── prisma.ts         # Prisma client
│   ├── validation.ts     # Input validation
│   └── ...
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
├── prisma/                # Database schema & migrations
├── proxy.ts               # Next.js 16 proxy (replaces middleware)
└── next.config.ts         # Next.js configuration
```

## Development Workflow

### Running linter

```bash
pnpm lint
```

### Database operations

```bash
# Create new migration
pnpm prisma migrate dev --name migration_name

# Open Prisma Studio
pnpm prisma studio

# Reset database (development only!)
pnpm prisma migrate reset
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key untuk JWT signing |
| `ADMIN_USERNAME` | Yes | Username untuk admin login |
| `ADMIN_PASSWORD` | Yes | Bcrypt hash dari admin password |
| `NEXT_PUBLIC_BASE_URL` | No | Base URL untuk canonical redirects |

## Security Notes

- **Password Hashing**: Admin password harus disimpan sebagai bcrypt hash
- **JWT Secret**: Gunakan string yang kuat dan random
- **Rate Limiting**: Built-in rate limiting untuk login dan public link creation
- **Environment Variables**: Jangan commit file `.env` ke repository

## License

[Your License Here]

## Contributing

Contributions welcome! Please open an issue or submit a pull request.

## Author

Created with ❤️ by deauport
