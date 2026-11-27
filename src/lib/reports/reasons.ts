/** Why someone reports a listing. Kept out of actions.ts: a "use server" file may export only async functions. */
export const REPORT_REASONS = {
  scam: "It looks like a scam",
  wrong: "Photos or details are wrong",
  prohibited: "It shouldn't be rented out",
  other: "Something else",
} as const;

export type ReportReason = keyof typeof REPORT_REASONS;

export const MAX_REPORT_DETAILS = 500;

export type ReportState = { sent?: boolean; error?: string; values?: { reason?: string; details?: string } };

export function isReportReason(value: string): value is ReportReason {
  return value in REPORT_REASONS;
}
