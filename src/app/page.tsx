import Link from "next/link";
import { ItemCard } from "@/components/items/item-card";
import { HeroSearch } from "@/components/search/hero-search";
import { CITY, categories, items } from "@/lib/mock-data";

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
  const counts = new Map(categories.map((c) => [c.slug, items.filter((i) => i.category === c.slug).length]));

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-10 pb-14 md:pt-16 md:pb-20">
        <HeroSearch />
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          Borrow from people in {areas.slice(0, 3).join(", ")} and {areas.length - 3} more areas of {CITY}. Your
          deposit comes back when the item does.
        </p>
      </section>

      <section aria-labelledby="browse" className="border-y border-rule bg-card">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <h2 id="browse" className="type-semi text-lg font-bold text-ink-soft">
            Browse what people lend
          </h2>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/search?category=${category.slug}`}
                  className="type-condensed text-4xl font-extrabold hover:text-action md:text-5xl"
                >
                  {category.name}
                  <sup className="ml-1 align-super text-base font-semibold text-ink-soft">
                    {counts.get(category.slug)}
                  </sup>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="popular" className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="popular" className="type-semi text-3xl font-extrabold">
            Popular in {CITY} this week
          </h2>
          <Link href="/search" className="shrink-0 text-sm font-semibold text-action hover:underline">
            See everything
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section aria-labelledby="how" className="bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <h2 id="how" className="type-semi text-3xl font-extrabold">
            How a rental loops back
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden
                  className="type-condensed grid size-11 place-items-center rounded-full bg-tag text-xl font-extrabold text-ink"
                >
                  {index + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-1 text-paper/75">{step.text}</p>
              </li>
            ))}
          </ol>
          {/* The return path: from the last step back to the first. */}
          <div aria-hidden className="relative mx-[16.66%] mt-6 hidden h-10 rounded-b-[2.5rem] border-2 border-t-0 border-dashed border-tag md:block">
            <span className="absolute -top-2 -left-[7px] size-0 border-x-[6px] border-b-[9px] border-x-transparent border-b-tag" />
          </div>
          <p className="mt-3 hidden text-center text-sm text-paper/75 md:block">
            The item goes home, and so does your deposit.
          </p>
        </div>
      </section>
    </>
  );
}
