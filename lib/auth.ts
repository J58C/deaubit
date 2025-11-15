// lib/auth.ts

import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET is not set");
}
const JWT_SECRET: Secret = rawSecret;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error(
    "ADMIN_USERNAME dan ADMIN_PASSWORD wajib diset di environment variable"
  );
}

export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 jam (detik)
export const SESSION_COOKIE_NAME = "admin_session";

export interface AdminJwtPayload extends JwtPayload {
  username: string;
  role: "admin";
}

export function signAdminJWT(username: string): string {
  const payload: Pick<AdminJwtPayload, "username" | "role"> = {
    username,
    role: "admin",
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: SESSION_MAX_AGE,
  });
}

export function verifyAdminJWT(token: string): AdminJwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminJwtPayload | string;

    if (typeof decoded === "string") {
      return null;
    }

    if (!decoded.username || decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export async function verifyAdminCredentials(
  inputUsername: string,
  inputPassword: string
): Promise<boolean> {
  if (inputUsername !== ADMIN_USERNAME) return false;
  return bcrypt.compare(inputPassword, ADMIN_PASSWORD!);
}
