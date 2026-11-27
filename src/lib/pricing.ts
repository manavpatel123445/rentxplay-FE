import type { Handover, Item } from "./types";

/** PRD defaults. Keep in one place so the backend can mirror them. */
export const SERVICE_FEE_RATE = 0.1;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Rental days = return date minus pickup date (PRD rule). Null if invalid. */
export function rentalDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const diff = (Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / DAY_MS;
  return Number.isFinite(diff) && diff >= 1 ? diff : null;
}

/** The per-day rate for a booking of `days` days. */
export function dayRate(item: Item, days: number) {
  if (days >= 7) return item.prices.sevenPlus;
  if (days >= 3) return item.prices.threePlus;
  return item.prices.oneDay;
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
  const rent = rate * days;
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
