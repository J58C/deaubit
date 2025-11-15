//lib/slug.ts

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateRandomSlug(length = 6): string {
  let out = "";
  const chars = ALPHABET.length;
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars);
    out += ALPHABET[idx];
  }
  return out;
}
