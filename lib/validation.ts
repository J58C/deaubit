//lib/validation.ts

import { RESERVED_SLUGS } from "@/constants";

export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

export function isValidSlug(slug: string): boolean {
    if (!slug || typeof slug !== "string") return false;
    if (RESERVED_SLUGS.has(slug)) return false;

    const slugRegex = /^[a-zA-Z0-9_-]+$/;
    return slugRegex.test(slug);
}

export function sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, "");
}

export function validateTargetUrl(targetUrl: string): {
    valid: boolean;
    error?: string;
} {
    if (!targetUrl) {
        return { valid: false, error: "URL tidak boleh kosong" };
    }

    if (!isValidUrl(targetUrl)) {
        return {
            valid: false,
            error: "URL tidak valid. Pastikan menyertakan http:// atau https://",
        };
    }

    return { valid: true };
}
