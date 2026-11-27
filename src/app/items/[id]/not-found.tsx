import { ItemCard } from "@/components/items/item-card";
import { ButtonLink } from "@/components/ui/button";
import { items } from "@/lib/mock-data";

/** S03 edge state: the listing was removed or paused. Offers popular items instead (screen-states table, docs/02). */
export default function ItemNotFound() {
  const popular = items.filter((item) => item.popular).slice(0, 4);
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-xl">
        <h1 className="type-condensed text-5xl font-extrabold">This item is no longer available</h1>
        <p className="mt-3 text-ink-soft">The owner may have removed or paused it. These are popular right now.</p>
        <ButtonLink href="/search" className="mt-6">
          Browse all items
        </ButtonLink>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {popular.map((item) => (
          <ItemCard key={item.id} item={item} hidePopular />
        ))}
      </div>
    </div>
  );
}
