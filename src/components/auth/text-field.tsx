"use client";

import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = ComponentProps<"input"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
  /** Shown inside the field before the text, e.g. "+91". */
  leading?: ReactNode;
  /** Shown inside the field after the text, e.g. a show-password button. */
  trailing?: ReactNode;
};

/**
 * Outlined text field (56px tall, Material size) with its label above and its error or hint below,
 * tied together for screen readers.
 */
export function TextField({ id, label, error, hint, leading, trailing, className, ...input }: Props) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div
        className={cn(
          "mt-1.5 flex h-14 items-center rounded-2xl border bg-card transition-[border-color,box-shadow] duration-150 focus-within:ring-4",
          error
            ? "border-booked focus-within:border-booked focus-within:ring-booked/15"
            : "border-rule hover:border-ink-soft focus-within:border-action focus-within:ring-action/15",
        )}
      >
        {leading && <span className="pl-4 text-ink-soft">{leading}</span>}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          // The wrapper draws the focus ring; `!` beats the global :focus-visible outline.
          className="h-full min-w-0 flex-1 rounded-2xl bg-transparent px-4 text-base text-ink outline-none placeholder:text-ink-soft/60 focus-visible:outline-none!"
          {...input}
        />
        {trailing}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key={error}
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="mt-1.5 text-sm font-medium text-booked"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      {hint && (
        <div id={hintId} className="mt-1.5 text-sm text-ink-soft">
          {hint}
        </div>
      )}
    </div>
  );
}

/** A password field with a show/hide button. */
export function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={shown}
      className="mr-2 h-10 shrink-0 rounded-xl px-3 text-sm font-semibold text-action hover:bg-action-wash"
    >
      {shown ? "Hide" : "Show"}
    </button>
  );
}
