"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { addDays, formatMonth, monthGrid } from "@/lib/dates";
import { formatShortDate } from "@/lib/format";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type Range = { from: string | null; to: string | null };

type Props = {
  today: string;
  value: Range;
  onChange: (range: Range) => void;
  /** Booked or blocked ranges, inclusive. */
  unavailable: { from: string; to: string }[];
  minDays: number;
  maxDays: number;
};

/**
 * Pickup-and-return calendar. Booked days are crossed out and cannot be picked, and while
 * choosing a return date only valid ones are offered, so a booking can never cross booked days.
 */
export function RangeCalendar({ today, value, onChange, unavailable, minDays, maxDays }: Props) {
  const anchor = value.from ?? today;
  const [view, setView] = useState({ y: Number(anchor.slice(0, 4)), m: Number(anchor.slice(5, 7)) - 1 });

  const isBooked = (d: string) => unavailable.some((r) => d >= r.from && d <= r.to);
  const isPast = (d: string) => d < today;

  // While a pickup is chosen and the return is not, work out the window of valid return dates.
  const choosingReturn = Boolean(value.from && !value.to);
  let returnMin = "";
  let returnMax = "";
  if (value.from && choosingReturn) {
    const pickup = value.from;
    returnMin = addDays(pickup, minDays);
    returnMax = addDays(pickup, maxDays);
    // The return may fall on the first booked day (the item comes back that morning), not after it.
    const nextBooked = unavailable
      .map((r) => r.from)
      .filter((f) => f > pickup)
      .sort()[0];
    if (nextBooked && nextBooked < returnMax) returnMax = nextBooked;
  }
  const validReturn = (d: string) => choosingReturn && d >= returnMin && d <= returnMax;

  function pick(d: string) {
    if (validReturn(d)) onChange({ from: value.from, to: d });
    else onChange({ from: d, to: null });
  }

  const monthStart = `${view.y}-${String(view.m + 1).padStart(2, "0")}-01`;
  const canGoBack = monthStart > today.slice(0, 8) + "01";
  const shift = (delta: number) =>
    setView(({ y, m }) => {
      const next = m + delta;
      return { y: y + Math.floor(next / 12), m: ((next % 12) + 12) % 12 };
    });

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Previous month"
          className="grid size-9 place-items-center rounded-full text-lg hover:bg-plate disabled:opacity-30"
        >
          ‹
        </button>
        <p className="font-semibold" aria-live="polite">
          {formatMonth(view.y, view.m)}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          aria-label="Next month"
          className="grid size-9 place-items-center rounded-full text-lg hover:bg-plate"
        >
          ›
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center text-xs text-ink-soft" aria-hidden>
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w.slice(0, 2)}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1" role="group" aria-label="Choose pickup and return dates">
        {monthGrid(view.y, view.m).map((d, i) => {
          if (!d) return <span key={`b${i}`} />;
          const booked = isBooked(d);
          const past = isPast(d);
          // A booked day can still be the return day when it is the end of a valid window.
          const disabled = past || (booked && !validReturn(d));
          const isStart = d === value.from;
          const isEnd = d === value.to;
          const inRange = value.from && value.to && d > value.from && d < value.to;
          const dimmed = choosingReturn && !validReturn(d) && !isStart && !past && !booked;

          return (
            <button
              key={d}
              type="button"
              disabled={disabled}
              onClick={() => pick(d)}
              aria-pressed={isStart || isEnd}
              aria-label={`${formatShortDate(d)}${booked ? ", booked" : ""}${isStart ? ", pickup" : ""}${isEnd ? ", return" : ""}`}
              className={cn(
                "mx-auto grid size-9 place-items-center rounded-full text-sm tabular-nums",
                inRange && "w-full rounded-none bg-action-wash",
                (isStart || isEnd) && "bg-action font-bold text-white",
                !isStart && !isEnd && !disabled && "hover:ring-2 hover:ring-action",
                past && "text-rule",
                booked && !isStart && !isEnd && "text-booked line-through decoration-2",
                dimmed && "text-ink-soft/50",
              )}
            >
              {Number(d.slice(8))}
            </button>
          );
        })}
      </div>

      <p className="mt-3 min-h-5 text-xs text-ink-soft" aria-live="polite">
        {!value.from && "Tap your pickup day."}
        {choosingReturn &&
          value.from &&
          (returnMin <= returnMax
            ? `Now tap your return day: ${formatShortDate(returnMin)} to ${formatShortDate(returnMax)}.`
            : `It's booked again too soon after ${formatShortDate(value.from)}. Pick another pickup day.`)}
        {value.from && value.to && (
          <button type="button" className="font-semibold text-action hover:underline" onClick={() => onChange({ from: null, to: null })}>
            Clear dates
          </button>
        )}
      </p>
      <p className="mt-1 flex items-center gap-3 text-xs text-ink-soft" aria-hidden>
        <span className="text-booked line-through decoration-2">12</span> booked
        <span className="ml-2 inline-block size-3 rounded-full bg-action" /> your dates
      </p>
    </div>
  );
}
