"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { logIn, type AuthFormState } from "@/lib/auth/actions";
import { useAuthPreview } from "./auth-preview";
import { SubmitButton } from "./submit-button";
import { PasswordToggle, TextField } from "./text-field";

/** S04 log in. Errors come back from the server action; the first wrong field gets focus. */
export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(logIn, {});
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const preview = useAuthPreview();

  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  return (
    <form ref={formRef} action={action} noValidate className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      <TextField
        id="email"
        name="email"
        onChange={(event) => preview.update({ email: event.target.value })}
        type="email"
        label="Email"
        autoComplete="email"
        inputMode="email"
        placeholder="name@example.com"
        defaultValue={state.values?.email}
        error={state.errors?.email}
        required
      />
      <TextField
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        label="Password"
        autoComplete="current-password"
        error={state.errors?.password}
        trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
        required
      />
      <SubmitButton pending={pending} pendingLabel="Logging in…">
        Log in
      </SubmitButton>
    </form>
  );
}
