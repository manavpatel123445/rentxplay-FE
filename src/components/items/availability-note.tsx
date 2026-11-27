"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { addDays, localTodayISO } from "@/lib/dates";
import { formatShortDate } from "@/lib/format";
import { nextFreeDate } from "@/lib/pricing";
import type { Item } from "@/lib/types";

/**
 * "Free today" or the next free day, for cards shown without search dates.
 * "Today" comes from the viewer's clock, so it is read after mount; the line keeps its height meanwhile.
 */
export function AvailabilityNote({ item, className }: { item: Pick<Item, "unavailable">; className?: string }) {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the client clock
    setToday(localTodayISO());
  }, []);

  if (!today) return <p aria-hidden className={cn("h-5", className)} />;

  const free = nextFreeDate(item, today);
  const label =
    free === today ? "Free today" : free === addDays(today, 1) ? "Free from tomorrow" : `Free from ${formatShortDate(free)}`;

  return (
    <p className={cn("flex items-center gap-1.5 text-sm", free === today ? "font-semibold text-ok" : "text-ink-soft", className)}>
      <span aria-hidden className={cn("size-2 shrink-0 rounded-full", free === today ? "bg-ok" : "bg-booked")} />
      {label}
    </p>
  );
}
