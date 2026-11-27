import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "plain" | "verified" | "popular";

const tones: Record<Tone, string> = {
  plain: "border border-rule text-ink-soft",
  verified: "bg-ink text-paper",
  /* "Popular" stays quiet: kite yellow is kept for the one rental tag per page. Solid so it reads on photos. */
  popular: "border border-rule bg-card text-ink",
};

export function Badge({
  tone = "plain",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
