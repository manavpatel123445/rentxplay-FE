import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { logOut } from "@/lib/auth/actions";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 md:py-16">
      <Suspense fallback={<AccountSkeleton />}>
        <AccountContent />
      </Suspense>
    </div>
  );
}

/** S18 profile. Logged out: log in first, then come back here. */
async function AccountContent() {
  const user = await getSession();
  if (!user) redirect("/login?next=/account");

  return (
    <>
      <div className="flex items-center gap-4">
        <span aria-hidden className="type-condensed grid size-16 place-items-center rounded-full bg-tag text-3xl font-extrabold">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h1 className="type-condensed truncate text-4xl font-extrabold">{user.name}</h1>
          <p className="truncate text-ink-soft">{user.email}</p>
        </div>
      </div>

      <section aria-labelledby="details" className="mt-8 rounded-[24px] border border-rule bg-card p-5">
        <h2 id="details" className="font-bold">
          Your details
        </h2>
        <dl className="mt-3 divide-y divide-rule text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-ink-soft">Email</dt>
            <dd className="truncate font-medium">{user.email}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-ink-soft">Mobile</dt>
            <dd className="flex items-center gap-2 font-medium">
              {user.phone ? `+91 ${user.phone.slice(0, 5)} ${user.phone.slice(5)}` : "Not added"}
              {user.phone && <Badge>Not verified yet</Badge>}
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-xs text-ink-soft">
          You&apos;ll add and verify your mobile number before your first booking, so owners can reach you after you pay.
        </p>
      </section>

      <nav aria-label="Your GearLoop" className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link href="/bookings" className="rounded-[24px] border border-rule bg-card p-5 transition-colors hover:border-ink">
          <span className="font-bold">My bookings</span>
          <span className="mt-1 block text-sm text-ink-soft">Requests, upcoming and past rentals</span>
        </Link>
        <Link href="/lend" className="rounded-[24px] border border-rule bg-card p-5 transition-colors hover:border-ink">
          <span className="font-bold">Lend your gear</span>
          <span className="mt-1 block text-sm text-ink-soft">List items and approve requests</span>
        </Link>
      </nav>

      <form action={logOut} className="mt-8">
        <button
          type="submit"
          className="h-11 rounded-full border-2 border-ink px-6 text-sm font-semibold transition-colors hover:bg-ink hover:text-paper"
        >
          Log out
        </button>
      </form>
    </>
  );
}

function AccountSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading your account">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-plate" />
        <div className="h-8 w-48 rounded bg-plate" />
      </div>
      <div className="mt-8 h-40 animate-pulse rounded-[24px] bg-plate motion-reduce:animate-none" />
    </div>
  );
}
