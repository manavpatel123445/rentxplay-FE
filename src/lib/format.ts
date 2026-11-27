const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(amount: number) {
  return inr.format(amount);
}

const shortDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

/** "2026-12-12" -> "12 Dec" (parsed as UTC so the day never shifts). */
export function formatShortDate(iso: string) {
  return shortDate.format(new Date(`${iso}T00:00:00Z`));
}
