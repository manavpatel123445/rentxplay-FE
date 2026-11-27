import { Button } from "@/components/ui/button";

const blank =
  "border-0 border-b-[3px] border-ink bg-transparent px-1 text-ink placeholder:text-ink/40 focus:border-action focus:outline-none";

/**
 * S01 hero: the search is a rental tag you fill in.
 * A plain GET form to /search, so it works before JavaScript loads.
 */
export function HeroSearch() {
  return (
    <div className="relative">
      {/* String running from the page edge to the tag's hole. */}
      <svg
        aria-hidden
        className="absolute -left-24 top-1/2 hidden h-28 w-28 -translate-y-1/2 text-ink lg:block"
        viewBox="0 0 112 112"
      >
        <path d="M0 18 C 40 0, 64 70, 104 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <form action="/search" method="get" role="search" className="tag-h tag-swing relative bg-tag py-8 pl-14 pr-6 md:py-10 md:pl-20 md:pr-10">
        <span className="tag-hole left-5 top-1/2 -translate-y-1/2 md:left-7" aria-hidden />

        <p className="type-condensed flex flex-wrap items-baseline gap-x-4 text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1]">
          <label htmlFor="hero-q">I need a</label>
          <input
            id="hero-q"
            name="q"
            placeholder="PS5"
            autoComplete="off"
            className={`${blank} w-full max-w-[9ch] font-extrabold [field-sizing:content] min-w-[4ch]`}
          />
        </p>

        <div className="mt-6 flex flex-wrap items-end gap-x-3 gap-y-4 text-xl font-semibold md:text-2xl">
          <label htmlFor="hero-from">from</label>
          <input id="hero-from" name="from" type="date" className={`${blank} h-11 text-lg md:text-xl`} />
          <label htmlFor="hero-to">to</label>
          <input id="hero-to" name="to" type="date" className={`${blank} h-11 text-lg md:text-xl`} />
          <Button type="submit" size="lg" className="w-full sm:ml-auto sm:w-auto">
            Find it nearby
          </Button>
        </div>
      </form>
    </div>
  );
}
