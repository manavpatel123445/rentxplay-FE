import { areas, categoryName, items } from "@/lib/mock-data";
import type { Suggestion } from "./hero-search";

/** What the search bar lists: items to suggest and areas with their item counts. Shared by home and /search. */
export function searchOptions() {
  // Popular items first, so suggestions and the hero open on something people rent a lot.
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
  const areaCounts = areas.map((name) => ({ name, count: items.filter((item) => item.area === name).length }));
  return { suggestions, areaCounts };
}
