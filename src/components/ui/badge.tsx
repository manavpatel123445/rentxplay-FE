import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "plain" | "verified" | "sticker";

const tones: Record<Tone, string> = {
  plain: "border border-rule text-ink-soft",
  verified: "bg-ink text-paper",
  /* A round kite-yellow sticker, used only for "Popular". */
  sticker: "bg-tag text-ink -rotate-3",
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
