"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CheckIcon } from "@/components/ui/icons";
import { signUp, type AuthFormState } from "@/lib/auth/actions";
import { PASSWORD_MIN } from "@/lib/auth/validate";
import { cn } from "@/lib/cn";
import { useAuthPreview } from "./auth-preview";
import { SubmitButton } from "./submit-button";
import { PasswordToggle, TextField } from "./text-field";

/** S04 sign up: just email and password, with live password rules. Name and mobile come later. */
export function SignupForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signUp, {});
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const preview = useAuthPreview();

  useEffect(() => {
    formRef.current?.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  const rules = [
    { ok: password.length >= PASSWORD_MIN, text: `${PASSWORD_MIN} or more characters` },
    { ok: /[a-z]/i.test(password) && /\d/.test(password), text: "A letter and a number" },
  ];

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
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={state.errors?.password}
        trailing={<PasswordToggle shown={showPassword} onToggle={() => setShowPassword((s) => !s)} />}
        hint={
          <ul className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Password rules">
            {rules.map((rule) => (
              <li key={rule.text} className={cn("flex items-center gap-1.5 transition-colors", rule.ok && "text-ok")}>
                <span
                  className={cn(
                    "grid size-4 place-items-center rounded-full border transition-colors",
                    rule.ok ? "border-ok bg-ok text-white" : "border-rule",
                  )}
                >
                  {rule.ok && <CheckIcon className="size-3" strokeWidth={3} />}
                </span>
                {rule.text}
                <span className="sr-only">{rule.ok ? ", done" : ", not yet"}</span>
              </li>
            ))}
          </ul>
        }
        required
      />
      <SubmitButton pending={pending} pendingLabel="Creating your account…">
        Create account
      </SubmitButton>
    </form>
  );
}
