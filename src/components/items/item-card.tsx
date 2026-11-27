import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "@/components/ui/icons";
import { formatINR } from "@/lib/format";
import { rentFor, rentalDays } from "@/lib/pricing";
import type { Item } from "@/lib/types";
import { AvailabilityNote } from "./availability-note";
import { ItemImage } from "./item-image";

/**
 * An item as a rental tag: hole at the top, perforated stub with the price.
 * With dates, the stub shows the rent for those dates and the link carries them to the item page.
 */
export function ItemCard({
  item,
  dates,
  eager,
  hidePopular,
}: {
  item: Item;
  dates?: { from: string; to: string };
  /** Load the image straight away: set for cards in the first row. */
  eager?: boolean;
  /** Leave out the "Popular" badge where the section already says so. */
  hidePopular?: boolean;
}) {
  const days = dates ? rentalDays(dates.from, dates.to) : null;
  const href = days && dates ? `/items/${item.id}?from=${dates.from}&to=${dates.to}` : `/items/${item.id}`;

  return (
    <Link href={href} className="group tag-v tag-outline relative block hover:bg-ink">
      <article className="tag-v relative flex h-full flex-col bg-card px-3 pt-8 pb-0">
        <span className="tag-hole left-1/2 top-3 -translate-x-1/2" aria-hidden />
        <ItemImage item={item} eager={eager} className="aspect-[4/3] w-full rounded-md" />
        <div className="flex flex-1 flex-col gap-1 px-1 pt-3 pb-3">
          <h3 className="font-semibold leading-snug underline-offset-4 group-hover:underline">{item.title}</h3>
          <p className="text-sm text-ink-soft">
            {item.area}, {item.distanceKm.toFixed(1)} km
          </p>
          <p className="flex flex-wrap items-center gap-x-1.5 text-sm">
            <span className="text-ink-soft">{item.owner.name}</span>
            {item.owner.verified && (
              <span className="inline-flex items-center gap-1 font-semibold text-ink">
                <span aria-hidden className="grid size-4 place-items-center rounded-full bg-ok-wash text-ok">
                  <CheckIcon className="size-3" strokeWidth={3} />
                </span>
                Verified owner
              </span>
            )}
          </p>
          {days ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-ok">
              <span aria-hidden className="size-2 shrink-0 rounded-full bg-ok" />
              Free on your dates
            </p>
          ) : (
            <AvailabilityNote item={item} />
          )}
        </div>
        <div className="perforated -mx-3 mt-auto px-4 py-3">
          <div className="flex items-baseline justify-between gap-2">
            {days ? (
              <p className="whitespace-nowrap">
                <span className="type-condensed text-3xl font-extrabold">{formatINR(rentFor(item, days))}</span>
                <span className="text-sm text-ink-soft">
                  {" "}
                  for {days} {days === 1 ? "day" : "days"}
                </span>
              </p>
            ) : (
              <p className="whitespace-nowrap">
                <span className="type-condensed text-3xl font-extrabold">{formatINR(item.prices.oneDay)}</span>
                <span className="text-sm text-ink-soft"> a day</span>
              </p>
            )}
            <p className="shrink-0 text-sm">
              <span className="font-semibold">{item.rating.toFixed(1)} ★</span>
              <span className="sr-only"> from {item.reviewCount} reviews</span>
            </p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {item.deliveryFee === null ? "Pickup only" : `Pickup, or delivery for ${formatINR(item.deliveryFee)}`}
          </p>
        </div>
      </article>
      {item.popular && !hidePopular && (
        <Badge tone="popular" className="absolute right-5 top-10">
          Popular
        </Badge>
      )}
    </Link>
  );
}
