//types/index.ts

export interface ApiResponse {
    success?: boolean;
    error?: string;
    [key: string]: unknown;
}

export interface LoginResponse extends ApiResponse {
    retryAfter?: number;
}

export interface PublicLinkResponse extends ApiResponse {
    slug: string;
    targetUrl: string;
}

export interface SessionResponse extends ApiResponse {
    authenticated: boolean;
    username?: string;
}

export interface LoginFormData {
    username: string;
    password: string;
}

export interface PublicShortlinkFormData {
    targetUrl: string;
}

export interface ShortlinkResult {
    slug: string;
    shortUrl: string;
}

export interface ShortlinkData {
    id: string;
    slug: string;
    targetUrl: string;
    createdAt: Date;
}

export interface AdminJwtPayload {
    username: string;
    role: "admin";
    iat?: number;
    exp?: number;
}

export interface RateLimitResult {
    allowed: boolean;
    retryAfter?: number;
}
