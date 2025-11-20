//constants/index.ts

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 24;

export const SLUG_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(
    /\/+$/,
    ""
);

export const RESERVED_SLUGS = new Set([
    "",
    "login",
    "dash",
    "api",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "_next",
    "static",
    "images",
]);

export const LOGIN_RATE_LIMIT_WINDOW = 15 * 60 * 1000;
export const LOGIN_RATE_LIMIT_MAX_ATTEMPTS = 5;
export const PUBLIC_LINK_RATE_LIMIT_WINDOW = 60 * 1000;
export const PUBLIC_LINK_RATE_LIMIT_MAX_REQUESTS = 10;

export const ERROR_MESSAGES = {
    LOGIN_FAILED: "Login gagal",
    RATE_LIMIT_EXCEEDED: "Terlalu banyak percobaan. Coba lagi nanti.",
    INVALID_URL: "URL tidak valid",
    SHORTLINK_CREATE_FAILED: "Gagal membuat shortlink",
    UNAUTHORIZED: "Tidak memiliki akses",
    SESSION_EXPIRED: "Sesi telah berakhir",
} as const;
