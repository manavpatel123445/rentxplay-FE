import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

/** Any address that doesn't exist. Items have their own message in items/[id]/not-found.tsx. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="type-condensed text-5xl font-extrabold">We can&apos;t find that page</h1>
      <p className="mt-3 text-ink-soft">The link may be mistyped or out of date.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/search">Browse items</ButtonLink>
        <Link
          href="/"
          className="inline-flex h-10 items-center rounded-full px-5 text-sm font-semibold text-action hover:bg-action-wash"
        >
          Go to the home page
        </Link>
      </div>
    </div>
  );
}
