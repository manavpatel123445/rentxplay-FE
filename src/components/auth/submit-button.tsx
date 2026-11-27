"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/** Full-width primary button that says what is happening while the form sends. */
export function SubmitButton({ pending, pendingLabel, children }: { pending: boolean; pendingLabel: string; children: ReactNode }) {
  return (
    <motion.button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      whileTap={pending ? undefined : { scale: 0.97 }}
      className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-action px-7 text-base font-semibold text-white transition-colors hover:bg-action-dark disabled:cursor-wait disabled:bg-action/70"
    >
      {pending && (
        <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
      )}
      {pending ? pendingLabel : children}
    </motion.button>
  );
}
