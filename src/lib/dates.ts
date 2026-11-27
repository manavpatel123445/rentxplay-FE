/** Date helpers on ISO "YYYY-MM-DD" strings in UTC, so a day never shifts with the time zone. */

const DAY_MS = 86_400_000;

export function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number) {
  return toISO(new Date(Date.parse(`${iso}T00:00:00Z`) + days * DAY_MS));
}

/** Today's date in the viewer's own time zone, as an ISO string. Client only. */
export function localTodayISO() {
  const now = new Date();
  return toISO(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
}

/** All days of a month grid (Sunday first), with nulls for the leading blanks. */
export function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: first.getUTCDay() }, () => null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(new Date(Date.UTC(year, month, d))));
  return cells;
}

const monthName = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
export function formatMonth(year: number, month: number) {
  return monthName.format(new Date(Date.UTC(year, month, 1)));
}
