"use server";

import { getItem } from "@/lib/mock-data";
import { MAX_REPORT_DETAILS, isReportReason, type ReportState } from "./reasons";

export async function reportListing(_prev: ReportState, formData: FormData): Promise<ReportState> {
  const itemId = formData.get("itemId");
  const reason = formData.get("reason");
  const rawDetails = formData.get("details");
  const details = typeof rawDetails === "string" ? rawDetails.trim() : "";
  const values = { reason: typeof reason === "string" ? reason : undefined, details };

  if (typeof itemId !== "string" || !getItem(itemId)) {
    return { error: "We couldn't find this listing. Reload the page and try again.", values };
  }
  if (typeof reason !== "string" || !isReportReason(reason)) {
    return { error: "Choose what is wrong with this listing.", values };
  }
  if (details.length > MAX_REPORT_DETAILS) {
    return { error: `Keep the details under ${MAX_REPORT_DETAILS} characters.`, values };
  }
  if (reason === "other" && !details) {
    return { error: "Tell us what is wrong, so we know what to check.", values };
  }

  // TODO(API): POST /items/:id/reports (signed-in, rate-limited). Nothing is stored in the demo.
  return { sent: true };
}
