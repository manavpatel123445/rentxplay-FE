"use client";

import { AnimatePresence, motion, useAnimate, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { Suggestion } from "@/components/search/hero-search";
import { formatINR } from "@/lib/format";

/**
 * The page's one loud element: a kite-yellow rental tag hanging on a string.
 * It swings each time it shows a new item. On phones it lies sideways (hole on the left).
 */
export function HeroTag({
  item,
  eager,
  onHoverChange,
}: {
  item: Suggestion;
  eager?: boolean;
  onHoverChange: (hovering: boolean) => void;
}) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    animate(
      scope.current,
      { rotate: [0, -6, 3.5, -1.5, 0.5, 0] },
      { duration: 1.5, ease: "easeOut" },
    );
  }, [item.id, reduce, animate, scope]);

  return (
    <div
      className="relative mx-auto w-full max-w-md lg:mt-16 lg:max-w-none"
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
    >
      {/* The string, ending in the tag's hole. Desktop only: on phones the tag lies on the page. */}
      <svg
        aria-hidden
        viewBox="0 0 40 103"
        className="absolute -top-20 left-1/2 z-10 hidden h-[103px] w-10 -translate-x-1/2 text-ink lg:block"
      >
        <path d="M30 0 C 6 38, 34 66, 20 96" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>

      <motion.div ref={scope} className="origin-[23px_50%] lg:origin-[50%_23px]">
        <Link
          href={`/items/${item.id}`}
          className="group relative block bg-tag py-4 pr-4 pl-12 tag-h lg:px-6 lg:pt-12 lg:pb-6 lg:tag-v"
        >
          <span
            aria-hidden
            className="tag-hole top-1/2 left-4 -translate-y-1/2 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0"
          />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex items-center gap-4 lg:block"
            >
              <span className="relative block size-20 shrink-0 overflow-hidden rounded-2xl bg-card lg:aspect-[4/3] lg:size-auto lg:w-full">
                <Image
                  src={`/items/${item.id}.svg`}
                  alt=""
                  fill
                  unoptimized
                  loading={eager ? "eager" : "lazy"}
                  fetchPriority={eager ? "high" : "auto"}
                  sizes="(min-width: 1024px) 320px, 80px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                />
              </span>
              <span className="block min-w-0 flex-1 lg:mt-4">
                <span className="block text-xs font-semibold text-ink/70">
                  {item.popular ? "Popular" : "Ready to rent"} in {item.area}
                </span>
                <span className="block truncate text-lg leading-tight font-bold group-hover:underline lg:whitespace-normal lg:text-xl">
                  {item.title}
                </span>
                <span className="mt-2 block border-t-2 border-dashed border-ink/25 pt-2 lg:mt-4 lg:pt-3">
                  <span className="type-condensed text-2xl font-extrabold lg:text-3xl">{formatINR(item.dayPrice)}</span>
                  <span className="text-sm"> a day</span>
                  <span className="block text-xs text-ink/70">
                    {formatINR(item.weekRate)} a day when you rent for 7 days or more
                  </span>
                </span>
              </span>
            </motion.div>
          </AnimatePresence>
        </Link>
      </motion.div>
    </div>
  );
}
