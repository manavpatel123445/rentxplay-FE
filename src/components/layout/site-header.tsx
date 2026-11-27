import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { HideOnAuthPages } from "./hide-on-auth-pages";
import { NavLinks } from "./nav-links";
import { UserMenu } from "./user-menu";

/** A small tag on a loop of string: the wordmark's glyph. */
function TagGlyph() {
  return (
    <svg aria-hidden width="26" height="26" viewBox="0 0 26 26" className="shrink-0">
      <path d="M3 13c0-5 4-9 9-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 4h8l3 3v14H12l-3-3V7z" fill="var(--color-tag)" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="13.5" cy="8.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="type-condensed flex items-center gap-1.5 text-2xl font-extrabold tracking-tight">
          <TagGlyph />
          GearLoop
        </Link>
        <NavLinks />
        {/* Reads the session cookie, so it streams in; the rest of the header is static. */}
        <Suspense fallback={<div aria-hidden className="h-10 w-24 animate-pulse rounded-full bg-plate sm:w-44" />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}

async function HeaderAccount() {
  const user = await getSession();
  if (user) return <UserMenu name={user.name} email={user.email} />;
  return (
    <HideOnAuthPages>
      <div className="flex items-center gap-1">
        <Link
          href="/login"
          className="inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold text-ink transition-colors hover:bg-plate"
        >
          Log in
        </Link>
        <ButtonLink href="/signup" className="hidden sm:inline-flex">
          Sign up
        </ButtonLink>
      </div>
    </HideOnAuthPages>
  );
}
