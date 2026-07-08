import { randomBytes } from "crypto";

/**
 * Short, url-safe, crypto-strong id for order external ids.
 * ~10 chars of base36-ish entropy.
 */
export function shortId(): string {
  return randomBytes(8).toString("hex");
}

/**
 * Crypto-strong, url-safe download token (base64url, no padding).
 * 32 bytes = 256 bits of entropy.
 */
export function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Mask an email for display, e.g. "jo***@gmail.com".
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}${"*".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Basic email format validation (used on both client and server). */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}
