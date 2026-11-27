"use client";

import { useActionState, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { reportListing } from "@/lib/reports/actions";
import { MAX_REPORT_DETAILS, REPORT_REASONS, type ReportState } from "@/lib/reports/reasons";

/** "Report this listing": a short form that opens in place under the reviews. */
export function ReportListing({ itemId }: { itemId: string }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ReportState, FormData>(reportListing, {});

  if (state.sent) {
    return (
      <p role="status" className="rounded-lg bg-ok-wash px-4 py-3 text-sm">
        Thanks. GearLoop will check this listing. Don&apos;t pay or share your number outside GearLoop meanwhile.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="inline-flex min-h-11 items-center text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
      >
        Report this listing
      </button>
    );
  }

  return (
    <form action={action} aria-labelledby={`${id}-title`} className="rounded-xl border border-rule p-4">
      <h2 id={`${id}-title`} className="font-semibold">
        Report this listing
      </h2>
      <input type="hidden" name="itemId" value={itemId} />
      <fieldset className="mt-3">
        <legend className="text-sm text-ink-soft">What is wrong?</legend>
        <div className="mt-2 grid gap-1">
          {Object.entries(REPORT_REASONS).map(([value, label]) => (
            <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="reason"
                value={value}
                defaultChecked={state.values?.reason === value}
                className="size-4 accent-action"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor={`${id}-details`} className="mt-3 block text-sm font-semibold">
        Details <span className="font-normal text-ink-soft">(optional)</span>
      </label>
      <textarea
        id={`${id}-details`}
        name="details"
        rows={3}
        maxLength={MAX_REPORT_DETAILS}
        defaultValue={state.values?.details}
        className="mt-1 w-full rounded-xl border border-rule bg-card px-3 py-2 text-sm focus:border-action focus:outline-none focus:ring-2 focus:ring-action/20"
      />
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-booked">
          {state.error}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Sending report…" : "Send report"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold hover:bg-plate"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
