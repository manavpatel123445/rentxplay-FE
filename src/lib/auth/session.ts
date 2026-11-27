import "server-only";
import { cookies } from "next/headers";

/**
 * DEMO SESSION, until the API exists. It stores who is "logged in" in an httpOnly cookie so the
 * UI can show logged-in states. It is not authentication: there is no user store or password
 * check. When the API lands, replace this file with its JWT access token + rotating refresh
 * token cookie (PRD FR-01) and keep the same getSession() shape for the UI.
 */

export type SessionUser = { name: string; email: string; phone?: string };

const COOKIE = "gl_demo_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function getSession(): Promise<SessionUser | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (
      data &&
      typeof data === "object" &&
      "name" in data &&
      "email" in data &&
      typeof data.name === "string" &&
      typeof data.email === "string"
    ) {
      const phone = "phone" in data && typeof data.phone === "string" ? data.phone : undefined;
      return { name: data.name.slice(0, 60), email: data.email.slice(0, 254), phone };
    }
  } catch {
    // A cookie we can't read counts as logged out.
  }
  return null;
}

/** Server Actions only: cookies can't be set while a page renders. */
export async function startSession(user: SessionUser) {
  (await cookies()).set(COOKIE, Buffer.from(JSON.stringify(user)).toString("base64url"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}
