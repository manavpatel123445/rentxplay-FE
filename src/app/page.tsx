import Link from "next/link";
import { CategoryTiles, type CategoryTile } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { LoopSteps } from "@/components/home/loop-steps";
import { ItemCard } from "@/components/items/item-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { Suggestion } from "@/components/search/hero-search";
import { ArrowIcon } from "@/components/ui/icons";
import { CITY, categories, categoryName, items } from "@/lib/mock-data";

const steps = [
  { title: "Ask the owner", text: "Pick your dates and send a request. Nothing is charged yet." },
  {
    title: "Pay and collect",
    text: "When the owner says yes, pay the rent and a deposit within 30 minutes. Collect it, or have it delivered.",
  },
  {
    title: "Bring it back",
    text: "Return it on your last day. Once the owner checks it, your deposit is refunded within 24 hours.",
  },
];

export default function HomePage() {
  const popular = items.filter((item) => item.popular);
  const areas = [...new Set(items.map((item) => item.area))];

  // Popular items first, so the hero opens on something people rent a lot.
  const suggestions: Suggestion[] = items
    .toSorted((a, b) => Number(b.popular) - Number(a.popular))
    .map((item) => ({
      id: item.id,
      title: item.title,
      categoryName: categoryName(item.category),
      area: item.area,
      dayPrice: item.prices.oneDay,
      weekRate: item.prices.sevenPlus,
      popular: item.popular,
    }));

  const tiles: CategoryTile[] = categories.flatMap((c) => {
    const inCategory = items.filter((item) => item.category === c.slug);
    return inCategory.length ? [{ slug: c.slug, name: c.name, count: inCategory.length, imageId: inCategory[0].id }] : [];
  });

  return (
    <>
      <Hero
        suggestions={suggestions}
        categories={categories}
        areasLine={`Cameras, consoles, drones and more from owners in ${areas.slice(0, 3).join(", ")} and ${areas.length - 3} more areas of ${CITY}. Pay by the day.`}
      />

      <section aria-labelledby="browse" className="border-y border-rule bg-card">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <h2 id="browse" className="type-semi text-3xl font-extrabold">
            Browse what people lend
          </h2>
          <CategoryTiles tiles={tiles} />
        </div>
      </section>

      <section aria-labelledby="popular" className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="popular" className="type-semi text-3xl font-extrabold">
            Popular in {CITY} this week
          </h2>
          <Link
            href="/search"
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-action hover:underline"
          >
            See everything
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </div>
        <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((item, index) => (
            <RevealItem key={item.id} className="grid">
              <ItemCard item={item} eager={index < 4} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="how" className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 id="how" className="type-semi text-3xl font-extrabold">
            How a rental loops back
          </h2>
          <LoopSteps steps={steps} />
          <p className="mt-3 hidden text-center text-sm text-paper/75 md:block">
            The item goes home, and so does your deposit.
          </p>
        </div>
      </section>
    </>
  );
}
