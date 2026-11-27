import Link from "next/link";
import { CategoryTiles, type CategoryTile } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { LoopSteps } from "@/components/home/loop-steps";
import { RenterReviews, type ReviewCard } from "@/components/home/renter-reviews";
import { ItemCard } from "@/components/items/item-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { searchOptions } from "@/components/search/search-options";
import { ArrowIcon, CheckIcon } from "@/components/ui/icons";
import { CITY, areas, categories, items } from "@/lib/mock-data";
import { lowestDayRate } from "@/lib/pricing";

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

// Same rules as the item page's "Before you book" (PRD FR-19 to 21). Change them together.
const safeguards = [
  {
    title: "Verified owners",
    text: "Owners confirm their ID before they lend. Look for the Verified owner mark on each item.",
  },
  {
    title: "Your deposit comes back",
    text: "It is held while you have the item, never spent. You get it back within 24 hours of the owner checking it.",
  },
  {
    title: "Cancel with a refund",
    text: "Full refund up to 2 days before pickup, half refund up to 1 day before. The deposit always comes back.",
  },
  {
    title: "If something breaks",
    text: "Either of you can report it within 48 hours of return, with photos. GearLoop decides how much of the deposit the owner keeps.",
  },
  {
    title: "Pay safely",
    text: "You pay through Razorpay by UPI or card, and only after the owner says yes. GearLoop never sees your card details.",
  },
  {
    title: "Spot something odd?",
    text: "Use Report this listing on any item page. Don't pay or share your number outside GearLoop.",
  },
];

export default function HomePage() {
  const popular = items.filter((item) => item.popular);
  const { suggestions, areaCounts } = searchOptions();

  const tiles: CategoryTile[] = categories.flatMap((c) => {
    const inCategory = items.filter((item) => item.category === c.slug);
    const fromRate = lowestDayRate(inCategory);
    return fromRate === null ? [] : [{ slug: c.slug, name: c.name, fromRate, imageId: inCategory[0].id }];
  });

  // Newest written reviews first, each linked to the item it is about.
  const reviews: ReviewCard[] = items
    .flatMap((item) => item.reviews.map((r) => ({ ...r, itemId: item.id, itemTitle: item.title })))
    .toSorted((a, b) => b.date.localeCompare(a.date))
    .slice(0, 4);
  const reviewTotal = items.reduce((sum, item) => sum + item.reviewCount, 0);
  const averageRating = items.reduce((sum, item) => sum + item.rating * item.reviewCount, 0) / reviewTotal;

  return (
    <>
      <Hero
        suggestions={suggestions}
        categories={categories}
        areas={areaCounts}
        city={CITY}
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
            className="group -my-3 inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-action hover:underline"
          >
            See everything
            <ArrowIcon className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </div>
        {/* A swipeable row on phones, like the category tiles; a grid from tablet up. */}
        <RevealGroup className="-mx-5 mt-6 flex snap-x gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {popular.map((item, index) => (
            <RevealItem key={item.id} className="grid w-[72%] shrink-0 snap-start sm:w-auto">
              {/* The section title already says these are popular. */}
              <ItemCard item={item} eager={index < 4} hidePopular />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section aria-labelledby="reviews" className="border-t border-rule bg-card">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id="reviews" className="type-semi text-3xl font-extrabold">
              What renters say
            </h2>
            <p className="text-sm text-ink-soft">
              <strong className="text-ink">{averageRating.toFixed(1)} ★</strong> average from {reviewTotal} reviews
            </p>
          </div>
          <RenterReviews reviews={reviews} />
        </div>
      </section>

      <section aria-labelledby="safety" className="mx-auto max-w-6xl px-5 py-14">
        <h2 id="safety" className="type-semi text-3xl font-extrabold">
          Safe on both sides
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">What protects you before, during and after a rental.</p>
        <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {safeguards.map((s) => (
            <li key={s.title} className="flex gap-3 border-t border-rule pt-4">
              <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-ok-wash text-ok">
                <CheckIcon className="size-4" strokeWidth={3} />
              </span>
              <div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
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
