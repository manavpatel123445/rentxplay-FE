"use client";

import "./globals.css";

/**
 * Last-resort screen when the root layout itself fails. It replaces the whole document, so it
 * brings its own <html>, <body> and stylesheet (Next.js doesn't include global styles here).
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-paper px-5 font-sans text-ink">
        <div role="alert" className="max-w-md text-center">
          <h1 className="text-4xl font-extrabold">GearLoop didn&apos;t load</h1>
          <p className="mt-3 text-ink-soft">Something went wrong on our side. Try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            className="mt-8 inline-flex h-10 items-center rounded-full bg-action px-5 text-sm font-semibold text-white hover:bg-action-dark"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
