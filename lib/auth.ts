// src/lib/auth.ts
import { SignJWT, jwtVerify, JWTPayload } from "jose";

const encoder = new TextEncoder();

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || "dev-secret-change-me";
  return encoder.encode(secret);
}

/**
 * Verifikasi username + password admin.
 * Hanya single user, dari ENV.
 */
export function verifyAdminCredentials(username: string, password: string): boolean {
  const envUsername = process.env.ADMIN_USERNAME || "admin";
  const envPassword = process.env.ADMIN_PASSWORD || "deauport-dev";

  return username === envUsername && password === envPassword;
}

/**
 * Buat JWT untuk admin.
 */
export async function createAdminJWT(username: string): Promise<string> {
  const secret = getJwtSecret();

  const token = await new SignJWT({
    sub: "admin",
    username,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // berlaku 7 hari
    .sign(secret);

  return token;
}

/**
 * Verifikasi JWT; kalau invalid/expired → return null.
 */
export async function verifyAdminJWT(
  token: string,
): Promise<JWTPayload & { username?: string } | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (payload.sub !== "admin") return null;
    return payload as JWTPayload & { username?: string };
  } catch {
    return null;
  }
}
