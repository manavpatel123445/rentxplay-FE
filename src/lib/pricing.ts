import { addDays } from "./dates";
import type { Handover, Item } from "./types";

/** PRD defaults. Keep in one place so the backend can mirror them. */
export const SERVICE_FEE_RATE = 0.1;
/** PRD late return: 1.5 × the day rate for each extra day or part day, taken from the deposit. */
export const LATE_FEE_MULTIPLIER = 1.5;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Rental days = return date minus pickup date (PRD rule). Null if invalid. */
export function rentalDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const diff = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS;
  return Number.isFinite(diff) && diff >= 1 ? diff : null;
}

/** The cheapest per-day rate any of these items offers, at any rental length. Null for no items. */
export function lowestDayRate(items: Item[]): number | null {
  const rates = items.flatMap((item) => [item.prices.oneDay, item.prices.threePlus, item.prices.sevenPlus]);
  return rates.length ? Math.min(...rates) : null;
}

/** The per-day rate for a booking of `days` days. */
export function dayRate(item: Item, days: number) {
  if (days >= 7) return item.prices.sevenPlus;
  if (days >= 3) return item.prices.threePlus;
  return item.prices.oneDay;
}

/** Rent for `days` days at the tier rate for that length (before the service fee). */
export function rentFor(item: Item, days: number) {
  return dayRate(item, days) * days;
}

/** Charged per extra day when an item comes back late. Based on the 1-day rate. */
export function lateFeePerDay(item: Item) {
  return Math.round(item.prices.oneDay * LATE_FEE_MULTIPLIER);
}

/** True if the item can be rented for this many days (owner's minimum and maximum). */
export function fitsRentalLength(item: Item, days: number) {
  return days >= item.minDays && days <= item.maxDays;
}

export type Quote = {
  days: number;
  rate: number;
  rent: number;
  serviceFee: number;
  deliveryFee: number;
  deposit: number;
  total: number;
};

export function quote(item: Item, days: number, handover: Handover): Quote {
  const rate = dayRate(item, days);
  const rent = rentFor(item, days);
  const serviceFee = Math.round(rent * SERVICE_FEE_RATE);
  const deliveryFee = handover === "delivery" ? (item.deliveryFee ?? 0) : 0;
  return {
    days,
    rate,
    rent,
    serviceFee,
    deliveryFee,
    deposit: item.deposit,
    total: rent + serviceFee + deliveryFee + item.deposit,
  };
}

/** True if [start, end) overlaps any unavailable range of the item. */
export function overlapsUnavailable(item: Item, start: string, end: string) {
  return item.unavailable.some((r) => start <= r.to && end > r.from);
}

/**
 * First day on or after `today` that falls in no unavailable range (ranges are inclusive).
 * Returns `today` when the item is free now.
 */
export function nextFreeDate(item: Pick<Item, "unavailable">, today: string) {
  let day = today;
  for (;;) {
    const blocking = item.unavailable.find((r) => r.from <= day && day <= r.to);
    if (!blocking) return day;
    day = addDays(blocking.to, 1);
  }
}
