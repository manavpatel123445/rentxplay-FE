"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { logOut } from "@/lib/auth/actions";
import { cn } from "@/lib/cn";

const links = [
  { href: "/account", label: "Your account" },
  { href: "/bookings", label: "My bookings" },
  { href: "/lend", label: "Lend your gear" },
];

/** Logged-in header control: the person's initial on a yellow disc, opening their account links. */
export function UserMenu({ name, email }: { name: string; email: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstName = name.split(" ")[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node && rootRef.current?.contains(event.target))) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Account menu for ${name}`}
        className={cn(
          "flex h-10 items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 transition-colors hover:border-ink",
          open ? "border-ink" : "border-rule",
        )}
      >
        <span aria-hidden className="grid size-8 place-items-center rounded-full bg-tag text-sm font-bold text-ink">
          {firstName.slice(0, 1).toUpperCase()}
        </span>
        <span className="hidden max-w-28 truncate text-sm font-semibold sm:block">{firstName}</span>
        <svg aria-hidden viewBox="0 0 24 24" className={cn("size-4 transition-transform", open && "rotate-180")}>
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 520, damping: 36 }}
            style={{ originX: 1, originY: 0 }}
            className="absolute top-full right-0 z-30 mt-2 w-64 rounded-[24px] border border-rule bg-card p-2"
          >
            <div className="px-3 pt-2 pb-3">
              <p className="truncate font-semibold">{name}</p>
              <p className="truncate text-sm text-ink-soft">{email}</p>
            </div>
            <nav aria-label="Account" className="border-t border-rule pt-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center rounded-2xl px-3 text-sm font-medium hover:bg-plate"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <form action={logOut} className="mt-1 border-t border-rule pt-1">
              <button type="submit" className="flex h-11 w-full items-center rounded-2xl px-3 text-left text-sm font-medium hover:bg-plate">
                Log out
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
