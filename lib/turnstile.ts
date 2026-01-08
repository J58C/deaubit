//lib/turnstile.ts

const VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.warn("⚠️ Turnstile Secret Key is missing. Skipping verification.");
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      body: `secret=${encodeURIComponent(secret)}&response=${encodeURIComponent(token)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error("Turnstile Verification Error:", error);
    return false;
  }
}
