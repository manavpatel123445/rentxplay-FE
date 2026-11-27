/**
 * Sign-up and login rules. Pure functions, so the API (Zod, per the HLD) can mirror them.
 * Messages say what is wrong and how to fix it. Both forms ask only for email and password;
 * the mobile number is added and verified later, before a first booking (FR-02).
 */

export type AuthField = "email" | "password";
export type FieldErrors = Partial<Record<AuthField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN = 8;
/** bcrypt (NFR: cost 12) only reads the first 72 bytes. */
export const PASSWORD_MAX = 72;

export function normaliseEmail(value: string) {
  return value.trim().toLowerCase();
}

function checkEmail(email: string) {
  if (!email) return "Enter your email address.";
  if (!EMAIL.test(email)) return "Enter an email like name@example.com.";
}

export function checkPassword(password: string) {
  if (!password) return "Enter a password.";
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (new TextEncoder().encode(password).length > PASSWORD_MAX) return `Use ${PASSWORD_MAX} characters or fewer.`;
  if (!/[a-z]/i.test(password) || !/\d/.test(password)) return "Use at least one letter and one number.";
}

export function validateLogin(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const email = checkEmail(input.email);
  if (email) errors.email = email;
  if (!input.password) errors.password = "Enter your password.";
  return errors;
}

export function validateSignup(input: { email: string; password: string }): FieldErrors {
  const errors: FieldErrors = {};
  const email = checkEmail(input.email);
  if (email) errors.email = email;
  const password = checkPassword(input.password);
  if (password) errors.password = password;
  return errors;
}

/** Tabs, newlines and other control characters, which browsers silently delete from URLs. */
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const BASE = "http://gearloop.invalid";

/**
 * Only same-site paths, so a crafted ?next= link can't send people to another site after login.
 * Checks the URL as a browser will read it, not just the raw text: "/<tab>/evil.com" becomes
 * "//evil.com" once the tab is dropped, and "/.//evil.com" normalises to "//evil.com".
 * Anything doubtful falls back to the home page.
 */
export function safeNext(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/")) return "/";
  // Backslashes count as slashes in URLs, and control characters vanish, so neither has a safe use here.
  if (CONTROL_CHARS.test(value) || value.includes("\\")) return "/";

  let url: URL;
  try {
    url = new URL(value, BASE);
  } catch {
    return "/";
  }
  if (url.origin !== BASE) return "/";

  const path = url.pathname + url.search + url.hash;
  // A path that still starts with "//" would be read as another site by the browser.
  return path.startsWith("//") ? "/" : path;
}
