"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { localTodayISO } from "@/lib/dates";
import { formatINR, formatShortDate } from "@/lib/format";
import { overlapsUnavailable, quote, rentalDays } from "@/lib/pricing";
import type { Handover, Item } from "@/lib/types";
import { RangeCalendar, type Range } from "./range-calendar";

/** Dates carried over from search, kept only if they are valid and free for this item. */
function initialRange(item: Item, from: string | null, to: string | null, today: string) {
  const days = from && to ? rentalDays(from, to) : null;
  const ok =
    from && to && days && from >= today && days >= item.minDays && days <= item.maxDays && !overlapsUnavailable(item, from, to);
  return { range: ok ? { from, to } : { from: null, to: null }, dropped: Boolean(from && to && !ok) };
}

/** S03 booking panel, shaped as a handover slip: calendar, pickup or delivery, live total. */
export function BookingPanel({ item }: { item: Item }) {
  const id = useId();
  const params = useSearchParams();
  const [today, setToday] = useState<string | null>(null);
  const [range, setRange] = useState<Range>({ from: null, to: null });
  const [dropped, setDropped] = useState(false);
  const [handover, setHandover] = useState<Handover>("pickup");

  // "Today" depends on the viewer's clock, so it is read after mount, never during prerender.
  useEffect(() => {
    const t = localTodayISO();
    const init = initialRange(item, params.get("from"), params.get("to"), t);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the client clock and URL
    setToday(t);
    setRange(init.range);
    setDropped(init.dropped);
  }, [item, params]);

  const days = range.from && range.to ? rentalDays(range.from, range.to) : null;
  const q = days ? quote(item, days, handover) : null;
  const canDeliver = item.deliveryFee !== null;

  return (
    <section id="book" aria-labelledby={`${id}-title`} className="tag-v tag-outline scroll-mt-24">
      <div className="tag-v relative bg-card px-5 pt-9 pb-5">
        <span className="tag-hole left-1/2 top-3 -translate-x-1/2" aria-hidden />
        <h2 id={`${id}-title`}>
          <span className="type-condensed text-3xl font-extrabold">{formatINR(item.prices.oneDay)}</span>
          <span className="text-sm text-ink-soft"> a day, less for longer rentals</span>
        </h2>

        {dropped && (
          <p className="mt-3 rounded-lg bg-tag-wash px-3 py-2 text-sm">
            Your search dates aren&apos;t free for this item. Pick new ones below.
          </p>
        )}

        <div className="mt-4">
          {today ? (
            <RangeCalendar
              today={today}
              value={range}
              onChange={(r) => {
                setRange(r);
                setDropped(false);
              }}
              unavailable={item.unavailable}
              minDays={item.minDays}
              maxDays={item.maxDays}
            />
          ) : (
            <div className="h-80 animate-pulse rounded-lg bg-plate" aria-label="Loading calendar" />
          )}
        </div>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold">How you get it</legend>
          <div className="mt-2 grid grid-cols-2 gap-1 rounded-full bg-plate p-1">
            {(["pickup", "delivery"] as const).map((option) => {
              const disabled = option === "delivery" && !canDeliver;
              const selected = handover === option;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={disabled}
                  aria-pressed={selected}
                  onClick={() => setHandover(option)}
                  className={cn(
                    "h-10 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-ink-soft/50",
                    selected ? "bg-ink font-semibold text-paper" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {option === "pickup"
                    ? `Pick up in ${item.area}`
                    : canDeliver
                      ? `Delivery +${formatINR(item.deliveryFee ?? 0)}`
                      : "No delivery"}
                </button>
              );
            })}
          </div>
          {handover === "delivery" && item.deliveryRadiusKm !== null && (
            <p className="mt-1 text-xs text-ink-soft">Delivers within {item.deliveryRadiusKm} km of {item.area}.</p>
          )}
        </fieldset>

        <div className="perforated -mx-5 mt-5 min-h-24 px-5 pt-4" aria-live="polite">
          {!q && <p className="text-sm text-ink-soft">Pick your dates to see the total.</p>}
          {q && (
            <dl className="space-y-1.5 text-sm">
              <Row label={`${formatINR(q.rate)} × ${q.days} ${q.days === 1 ? "day" : "days"}`} value={formatINR(q.rent)} />
              <Row label="Service fee (10%)" value={formatINR(q.serviceFee)} />
              {q.deliveryFee > 0 && <Row label="Delivery" value={formatINR(q.deliveryFee)} />}
              <div className="flex justify-between">
                <dt className="text-ink-soft">Deposit</dt>
                <dd>
                  {formatINR(q.deposit)} <span className="text-xs font-semibold text-ok">comes back</span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-rule pt-2 font-semibold">
                <dt>Total to pay</dt>
                <dd className="type-condensed text-2xl font-extrabold">{formatINR(q.total)}</dd>
              </div>
            </dl>
          )}
        </div>

        <Button size="lg" className="mt-4 w-full" disabled={!q}>
          {q ? `Request ${formatShortDate(range.from!)} to ${formatShortDate(range.to!)}` : "Request booking"}
        </Button>
        <p className="mt-2 text-center text-xs text-ink-soft">
          Nothing is charged until {item.owner.name} says yes.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-soft">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
