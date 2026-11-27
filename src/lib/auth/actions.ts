"use server";

import { redirect } from "next/navigation";
import { endSession, startSession } from "./session";
import {
  normaliseEmail,
  safeNext,
  validateLogin,
  validateSignup,
  type FieldErrors,
} from "./validate";

/** What a form gets back when it can't go through. Passwords are never sent back. */
export type AuthFormState = {
  errors?: FieldErrors;
  values?: { email?: string };
};

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** "priya.k@example.com" -> "Priya". Demo only: people add their real name in their profile later. */
function nameFromEmail(email: string) {
  const first = email.split("@")[0].split(/[._-]/)[0] ?? "";
  return first ? first[0].toUpperCase() + first.slice(1) : "Renter";
}

export async function logIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = normaliseEmail(text(formData, "email"));
  const password = text(formData, "password");
  const errors = validateLogin({ email, password });
  if (Object.keys(errors).length) return { errors, values: { email } };

  // TODO(API): POST /auth/login; on 401 return { errors: { password: "That email and password don't match." } }.
  await startSession({ name: nameFromEmail(email), email });
  redirect(safeNext(formData.get("next")));
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = normaliseEmail(text(formData, "email"));
  const password = text(formData, "password");
  const errors = validateSignup({ email, password });
  if (Object.keys(errors).length) return { errors, values: { email } };

  // TODO(API): POST /auth/signup. Mobile number + OTP (S05, FR-02) come later, before the first booking.
  await startSession({ name: nameFromEmail(email), email });
  redirect(safeNext(formData.get("next")));
}

export async function logOut() {
  await endSession();
  redirect("/");
}
