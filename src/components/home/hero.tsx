"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { HeroSearch, type Suggestion } from "@/components/search/hero-search";
import { CheckIcon } from "@/components/ui/icons";
import { HeroTag } from "./hero-tag";

// Long enough to read the tag after its ~1s turn.
const CYCLE_MS = 4000;

const promises = [
  "Nothing is charged until the owner says yes",
  "Your deposit comes back after you return the item",
  "See each owner's rating before you book",
];

/**
 * S01 hero. The search field's example and the yellow tag show the same item and change together,
 * so the page demonstrates a search before the renter types. Cycling stops while the renter is
 * using the search or pointing at the tag, and never runs for reduced motion.
 */
export function Hero({
  suggestions,
  categories,
  areas,
  city,
  areasLine,
}: {
  suggestions: Suggestion[];
  categories: { slug: string; name: string }[];
  areas: { name: string; count: number }[];
  city: string;
  areasLine: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const [onTag, setOnTag] = useState(false);
  const paused = searching || onTag || Boolean(reduce);

  useEffect(() => {
    if (paused || suggestions.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % suggestions.length), CYCLE_MS);
    return () => clearInterval(timer);
  }, [paused, suggestions.length]);

  const featured = suggestions[index];

  return (
    <section aria-labelledby="hero-title" className="mx-auto max-w-6xl px-5 pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
        <div
          onFocus={() => setSearching(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget instanceof Node ? event.relatedTarget : null)) setSearching(false);
          }}
        >
          <h1
            id="hero-title"
            className="type-condensed max-w-3xl text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] font-extrabold tracking-tight"
          >
            Rent gadgets from people near you
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">{areasLine}</p>

          <div className="mt-8">
            <HeroSearch
              suggestions={suggestions}
              categories={categories}
              areas={areas}
              city={city}
              example={featured.title}
            />
          </div>

          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-3 sm:gap-4">
            {promises.map((text) => (
              <li key={text} className="flex items-start gap-2">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ok-wash text-ok">
                  <CheckIcon className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-ink-soft">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <HeroTag item={featured} eager={index === 0} onHoverChange={setOnTag} />
      </div>
    </section>
  );
}
