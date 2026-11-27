"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { safeNext } from "@/lib/auth/validate";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/login", label: "Log in" },
  { href: "/signup", label: "Sign up" },
];

/**
 * Switches between log in and sign up, keeping ?next. Lives in the (auth) layout, so the
 * dark pill slides across when the page changes.
 */
export function AuthSwitch() {
  const pathname = usePathname();
  const next = safeNext(useSearchParams().get("next"));
  const query = next === "/" ? "" : `?next=${encodeURIComponent(next)}`;

  return (
    <nav aria-label="Log in or sign up" className="inline-grid grid-cols-2 rounded-full border border-rule bg-card p-1">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={`${tab.href}${query}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative h-10 rounded-full px-6 text-sm leading-10 font-semibold transition-colors",
              active ? "text-paper" : "text-ink-soft hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId="auth-switch-pill"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
                className="absolute inset-0 rounded-full bg-ink"
              />
            )}
            <span className="relative">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Same size and look while the switch waits for the URL. */
export function AuthSwitchFallback() {
  return (
    <div aria-hidden className="inline-grid grid-cols-2 rounded-full border border-rule bg-card p-1">
      <span className="h-10 w-24 rounded-full bg-plate" />
      <span className="h-10 w-24" />
    </div>
  );
}
