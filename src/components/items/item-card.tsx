import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/lib/format";
import { dayRate, rentalDays } from "@/lib/pricing";
import type { Item } from "@/lib/types";
import { ItemImage } from "./item-image";

/**
 * An item as a rental tag: hole at the top, perforated stub with the price.
 * With dates, the stub shows the rent for those dates and the link carries them to the item page.
 */
export function ItemCard({ item, dates }: { item: Item; dates?: { from: string; to: string } }) {
  const days = dates ? rentalDays(dates.from, dates.to) : null;
  const href = days && dates ? `/items/${item.id}?from=${dates.from}&to=${dates.to}` : `/items/${item.id}`;

  return (
    <Link href={href} className="group tag-v tag-outline relative block hover:bg-ink">
      <article className="tag-v relative flex h-full flex-col bg-card px-3 pt-8 pb-0">
        <span className="tag-hole left-1/2 top-3 -translate-x-1/2" aria-hidden />
        <ItemImage item={item} className="aspect-[4/3] w-full rounded-md" />
        <div className="flex flex-1 flex-col px-1 pt-3 pb-3">
          <h3 className="font-semibold leading-snug underline-offset-4 group-hover:underline">{item.title}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {item.area}, {item.distanceKm.toFixed(1)} km
          </p>
        </div>
        <div className="perforated -mx-3 mt-auto px-4 py-3">
          {days ? (
            <p className="whitespace-nowrap">
              <span className="type-condensed text-2xl font-extrabold">{formatINR(dayRate(item, days) * days)}</span>
              <span className="text-sm text-ink-soft">
                {" "}
                for {days} {days === 1 ? "day" : "days"}
              </span>
            </p>
          ) : (
            <p className="whitespace-nowrap">
              <span className="type-condensed text-2xl font-extrabold">{formatINR(item.prices.oneDay)}</span>
              <span className="text-sm text-ink-soft"> a day</span>
            </p>
          )}
          <p className="mt-1 flex justify-between gap-2 text-xs text-ink-soft">
            <span className="font-semibold text-ink">{item.rating.toFixed(1)} ★</span>
            <span>{item.deliveryFee === null ? "Pickup only" : `Delivers for ${formatINR(item.deliveryFee)}`}</span>
          </p>
        </div>
      </article>
      {item.popular && (
        <Badge tone="sticker" className="absolute right-2 top-6">
          Popular
        </Badge>
      )}
    </Link>
  );
}
