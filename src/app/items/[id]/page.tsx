import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingPanel } from "@/components/items/booking-panel";
import { ItemImage } from "@/components/items/item-image";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { dayRate } from "@/lib/pricing";
import { categoryName, getItem, items } from "@/lib/mock-data";

export function generateStaticParams() {
  return items.map((item) => ({ id: item.id }));
}

export async function generateMetadata(props: PageProps<"/items/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const item = getItem(id);
  return { title: item ? `Rent ${item.title}` : "Item not found" };
}

export default function ItemPage(props: PageProps<"/items/[id]">) {
  return (
    <Suspense fallback={<ItemSkeleton />}>
      <ItemContent params={props.params} />
    </Suspense>
  );
}

function ItemSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading item" className="mx-auto max-w-6xl px-4 py-6 md:py-10">
      <div className="h-4 w-40 rounded bg-plate" />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-plate" />
        <div className="h-96 animate-pulse rounded-xl bg-plate" />
      </div>
    </div>
  );
}

async function ItemContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getItem(id);
  if (!item) notFound();

  // Prices for each rental length, so renters see the saving without doing the maths.
  const lengths = [1, 3, 7]
    .filter((d) => d >= item.minDays && d <= item.maxDays)
    .map((days) => ({ days, rate: dayRate(item, days), total: dayRate(item, days) * days }));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 md:pt-10 lg:pb-10">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link href="/search" className="hover:text-ink">
          Search
        </Link>
        {" / "}
        <Link href={`/search?category=${item.category}`} className="hover:text-ink">
          {categoryName(item.category)}
        </Link>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <ItemImage item={item} eager className="aspect-[4/3] w-full rounded-xl" />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {item.popular && <Badge tone="sticker">Popular</Badge>}
            <Badge>{item.condition}</Badge>
            <Badge>{item.deliveryFee === null ? "Pickup only" : "Delivery available"}</Badge>
          </div>
          <h1 className="type-condensed mt-3 text-4xl font-extrabold leading-none md:text-5xl">{item.title}</h1>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div>
              <dt className="sr-only">Rating</dt>
              <dd>
                <strong>{item.rating.toFixed(1)} ★</strong> <span className="text-ink-soft">from {item.reviewCount} reviews</span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Location</dt>
              <dd className="text-ink-soft">
                {item.area}, {item.distanceKm.toFixed(1)} km away
              </dd>
            </div>
          </dl>

          <section aria-labelledby="pricing" className="mt-6">
            <h2 id="pricing" className="sr-only">
              Pricing
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {lengths.map((l) => (
                <div key={l.days} className="rounded-xl border-2 border-ink p-3 text-center">
                  <p className="text-xs text-ink-soft">
                    {l.days} {l.days === 1 ? "day" : "days"}
                  </p>
                  <p className="type-condensed text-2xl font-extrabold">{formatINR(l.total)}</p>
                  <p className={l.rate < item.prices.oneDay ? "text-xs font-semibold text-ok" : "text-xs text-ink-soft"}>
                    {formatINR(l.rate)} a day
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm">
              Plus a <strong>{formatINR(item.deposit)}</strong> deposit that comes back after you return it. Rent for{" "}
              {item.minDays} to {item.maxDays} days.
            </p>
          </section>

          <section aria-labelledby="about" className="mt-8">
            <h2 id="about" className="text-lg font-bold">
              About this item
            </h2>
            <p className="mt-2 text-ink-soft">{item.description}</p>
            <h3 className="mt-4 text-sm font-semibold">In the box</h3>
            <ul className="mt-2 grid gap-1 text-sm text-ink-soft sm:grid-cols-2">
              {item.inTheBox.map((thing) => (
                <li key={thing}>• {thing}</li>
              ))}
            </ul>
          </section>


          <section aria-labelledby="owner" className="mt-8 flex items-center gap-4 rounded-xl border border-rule p-4">
            <div aria-hidden className="grid size-12 place-items-center rounded-full bg-tag text-lg font-bold text-ink">
              {item.owner.name.slice(0, 1)}
            </div>
            <div>
              <h2 id="owner" className="font-semibold">
                {item.owner.name}
                {item.owner.verified && (
                  <Badge tone="verified" className="ml-2 align-middle">
                    Verified
                  </Badge>
                )}
              </h2>
              <p className="text-sm text-ink-soft">
                {item.owner.rating.toFixed(1)} ★ over {item.owner.rentals} rentals. Usually replies within {item.owner.replyHours}{" "}
                {item.owner.replyHours === 1 ? "hour" : "hours"}. You get their phone number once you pay.
              </p>
            </div>
          </section>

          <section aria-labelledby="terms" className="mt-8">
            <h2 id="terms" className="text-lg font-bold">
              Before you book
            </h2>
            <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-semibold">Cancelling</dt>
                <dd className="mt-1 text-ink-soft">
                  Full refund up to 2 days before pickup, half refund up to 1 day before. Your deposit always comes back.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">Returning late</dt>
                <dd className="mt-1 text-ink-soft">
                  Each extra day costs {formatINR(Math.round(item.prices.oneDay * 1.5))}, taken from the deposit.
                </dd>
              </div>
              <div>
                <dt className="font-semibold">If something breaks</dt>
                <dd className="mt-1 text-ink-soft">
                  Either of you can report it within 48 hours of return, with photos. GearLoop decides how much of the
                  deposit the owner keeps.
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="reviews" className="mt-8">
            <h2 id="reviews" className="text-lg font-bold">
              Reviews
            </h2>
            {item.reviews.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft">No written reviews yet.</p>
            ) : (
              <ul className="mt-3 space-y-4">
                {item.reviews.map((review) => (
                  <li key={review.author + review.date} className="border-b border-rule pb-4">
                    <p className="text-sm font-semibold">
                      {review.author} <span aria-label={`${review.rating} out of 5`}>{"★".repeat(review.rating)}</span>
                    </p>
                    <p className="mt-1 text-sm text-ink-soft">{review.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {/* The panel reads ?from&to from the URL, so it streams in behind its own boundary. */}
          <Suspense fallback={<div className="h-[640px] animate-pulse rounded-xl bg-plate" />}>
            <BookingPanel item={item} />
          </Suspense>
        </aside>
      </div>

      {/* Phones: price and a jump to the calendar stay in reach above the tab bar. */}
      <div className="fixed inset-x-0 bottom-14 z-10 flex items-center justify-between gap-3 border-t border-rule bg-card px-4 py-3 lg:hidden">
        <p>
          <span className="type-condensed text-2xl font-extrabold">{formatINR(item.prices.oneDay)}</span>
          <span className="text-sm text-ink-soft"> a day</span>
        </p>
        <ButtonLink href="#book">Pick dates</ButtonLink>
      </div>
    </div>
  );
}
