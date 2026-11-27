import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";
import { ItemCard } from "@/components/items/item-card";
import { HeroSearch } from "@/components/search/hero-search";
import { searchOptions } from "@/components/search/search-options";
import { cn } from "@/lib/cn";
import { todayInIndiaISO } from "@/lib/dates";
import { formatShortDate } from "@/lib/format";
import { CITY, areas, categories, searchItems, type SearchFilters } from "@/lib/mock-data";
import { rentalDays } from "@/lib/pricing";

export const metadata: Metadata = { title: "Search" };

type Params = Record<string, string | string[] | undefined>;

const sorts = [
  { value: "recommended", label: "Recommended" },
  { value: "price", label: "Lowest price" },
  { value: "distance", label: "Nearest" },
  { value: "rating", label: "Top rated" },
] as const;

const priceCaps = [500, 800, 1200];

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Builds /search?… keeping current params, with `changes` applied (undefined removes a key). */
function hrefWith(current: Params, changes: Record<string, string | undefined>) {
  const next = new URLSearchParams();
  for (const [key, value] of Object.entries(current)) {
    const v = one(value);
    if (v) next.set(key, v);
  }
  for (const [key, value] of Object.entries(changes)) {
    if (value === undefined) next.delete(key);
    else next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `/search?${qs}` : "/search";
}

function Chip({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full border px-3.5 text-sm font-medium transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule text-ink hover:border-ink",
      )}
    >
      {children}
    </Link>
  );
}

async function Results({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = one(params.q);
  const category = one(params.category);
  // Only known areas count, so a hand-edited URL can't empty the page silently.
  const area = areas.find((a) => a === one(params.area));
  const delivery = one(params.delivery) === "1";
  const maxPrice = Number(one(params.max)) || undefined;
  const sort: NonNullable<SearchFilters["sort"]> = sorts.find((s) => s.value === one(params.sort))?.value ?? "recommended";

  // Dates only count when both are present, in order and not in the past; otherwise they are ignored.
  const rawFrom = one(params.from);
  const rawTo = one(params.to);
  // Written as plain checks (not Boolean(...)) so TypeScript knows both dates are strings when inOrder is true.
  const inOrder = rawFrom !== undefined && rawTo !== undefined && rentalDays(rawFrom, rawTo) !== null;
  // "Today" must be read per request, never baked into a prerender.
  if (inOrder) await connection();
  const pastDates = inOrder && rawFrom < todayInIndiaISO();
  const dates = inOrder && !pastDates ? { from: rawFrom, to: rawTo } : undefined;
  const badDates = Boolean(rawFrom && rawTo && !inOrder);

  const { suggestions, areaCounts } = searchOptions();
  const results = searchItems({ q, category, area, delivery, maxPrice, sort, ...dates });
  // Items that match everything except the dates: booked then, or not rentable for that many days.
  const notFreeCount = dates ? searchItems({ q, category, area, delivery, maxPrice }).length - results.length : 0;

  return (
    <>
      {/* The same bar as the home page. Keyed by what was searched, so "Clear dates" or "Any area" resets it too. */}
      <HeroSearch
        key={[q, area, dates?.from, dates?.to].join("|")}
        suggestions={suggestions}
        categories={categories}
        areas={areaCounts}
        city={CITY}
        initial={{ query: q, area: area ?? null, dates }}
      />

      {pastDates && (
        <p role="alert" className="mt-3 rounded-lg bg-booked-wash px-3 py-2 text-sm text-booked">
          The pickup date has passed, so these results ignore your dates. Pick today or a later day.
        </p>
      )}
      {badDates && (
        <p role="alert" className="mt-3 rounded-lg bg-booked-wash px-3 py-2 text-sm text-booked">
          The return date must be after the pickup date, so these results ignore your dates.
        </p>
      )}
      {area && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-action-wash px-3 py-1 font-semibold text-action">In {area}</span>
          <Link href={hrefWith(params, { area: undefined })} className="font-semibold text-action hover:underline">
            Any area
          </Link>
        </p>
      )}
      {dates && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-full bg-ok-wash px-3 py-1 font-semibold text-ok">
            Free {formatShortDate(dates.from)} to {formatShortDate(dates.to)}
          </span>
          <Link
            href={hrefWith(params, { from: undefined, to: undefined })}
            className="font-semibold text-action hover:underline"
          >
            Clear dates
          </Link>
        </p>
      )}

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Category filter">
        <Chip href={hrefWith(params, { category: undefined })} active={!category}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c.slug} href={hrefWith(params, { category: c.slug })} active={category === c.slug}>
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2" aria-label="More filters">
        <Chip href={hrefWith(params, { delivery: delivery ? undefined : "1" })} active={delivery}>
          Delivery available
        </Chip>
        {priceCaps.map((cap) => (
          <Chip
            key={cap}
            href={hrefWith(params, { max: maxPrice === cap ? undefined : String(cap) })}
            active={maxPrice === cap}
          >
            Under ₹{cap}/day
          </Chip>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {results.length} {results.length === 1 ? "item" : "items"} available
          {q ? ` for “${q}”` : ""}
          {notFreeCount > 0 ? `. ${notFreeCount} more ${notFreeCount === 1 ? "isn't" : "aren't"} free for your dates.` : ""}
        </p>
        <div className="flex flex-wrap gap-1 text-sm" aria-label="Sort">
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={hrefWith(params, { sort: s.value === "recommended" ? undefined : s.value })}
              scroll={false}
              aria-current={sort === s.value ? "true" : undefined}
              className={cn(
                "rounded-lg px-2.5 py-1",
                sort === s.value ? "bg-plate font-semibold text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((item, index) => (
            <ItemCard key={item.id} item={item} dates={dates} eager={index < 4} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-rule p-10 text-center">
          <p className="font-semibold">
            {notFreeCount > 0 && dates
              ? `Nothing that matches is free from ${formatShortDate(dates.from)} to ${formatShortDate(dates.to)}.`
              : "No items match."}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            {notFreeCount > 0
              ? "Try moving your dates, or a longer or shorter rental."
              : "Try other words or remove a filter."}
          </p>
          <Link href="/search" className="mt-4 inline-block text-sm font-semibold text-action hover:underline">
            Clear all filters
          </Link>
        </div>
      )}
    </>
  );
}

function ResultsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading results">
      <div className="h-[184px] rounded-[28px] bg-plate sm:h-16 sm:rounded-full" />
      <div className="mt-4 h-9 w-2/3 rounded-full bg-plate" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-plate" />
        ))}
      </div>
    </div>
  );
}

export default function SearchPage(props: PageProps<"/search">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <h1 className="sr-only">Search results</h1>
      <Suspense fallback={<ResultsSkeleton />}>
        <Results searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
