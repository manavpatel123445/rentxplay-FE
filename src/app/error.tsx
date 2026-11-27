"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Any screen that fails while loading. Says what happened and offers a retry, which re-renders
 * this part of the page. The digest matches the server log entry when the error came from the server.
 */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  const digest = error instanceof Error && "digest" in error ? String(error.digest) : undefined;

  useEffect(() => {
    // TODO(observability): send to Sentry once it is set up (PRD NFR).
    console.error(error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="type-condensed text-5xl font-extrabold">This page didn&apos;t load</h1>
      <p className="mt-3 text-ink-soft">
        Something went wrong on our side. Try again, and if it keeps happening, come back in a few minutes.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => retry()}
          className="inline-flex h-10 items-center rounded-full bg-action px-5 text-sm font-semibold text-white hover:bg-action-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-action hover:bg-action-wash"
        >
          Go to the home page
        </Link>
      </div>
      {digest && <p className="mt-6 text-xs text-ink-soft">Error reference: {digest}</p>}
    </div>
  );
}
