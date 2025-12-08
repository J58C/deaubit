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
    role?: string; 
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

export interface SetupStatusResponse {
    initialized: boolean;
}
