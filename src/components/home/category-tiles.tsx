import Image from "next/image";
import Link from "next/link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { formatINR } from "@/lib/format";

/** `fromRate` is the cheapest per-day rate in the category (from `lowestDayRate`). */
export type CategoryTile = { slug: string; name: string; fromRate: number; imageId: string };

/** Categories as tiles with a real listing's picture. A swipeable row on phones, a grid from tablet up. */
export function CategoryTiles({ tiles }: { tiles: CategoryTile[] }) {
  return (
    <RevealGroup
      list
      className="-mx-5 mt-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7"
    >
      {tiles.map((tile) => (
        <RevealItem list key={tile.slug} className="grid w-32 shrink-0 snap-start sm:w-auto">
          <Link
            href={`/search?category=${tile.slug}`}
            className="group flex flex-col rounded-[24px] border border-rule bg-card p-2 pb-3 transition-colors hover:border-ink"
          >
            <span className="relative block aspect-square overflow-hidden rounded-[18px] bg-plate">
              <Image
                src={`/items/${tile.imageId}.svg`}
                alt=""
                fill
                unoptimized
                sizes="160px"
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
            </span>
            <span className="mt-2 px-1 font-semibold group-hover:underline">{tile.name}</span>
            <span className="px-1 text-sm text-ink-soft">From {formatINR(tile.fromRate)} a day</span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
