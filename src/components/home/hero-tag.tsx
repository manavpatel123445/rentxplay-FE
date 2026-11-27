"use client";

import {
  animate as animateValue,
  motion,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Suggestion } from "@/components/search/hero-search";
import { formatINR } from "@/lib/format";

/** Turning edge-on: eases in, so the tag speeds up as it turns away. */
const TURN_AWAY = { duration: 0.26, ease: [0.55, 0, 1, 0.45] } as const;
/** Turning back: a soft spring, so the tag overshoots a touch and settles like a card on a string. */
const TURN_BACK = {
  rotateY: { type: "spring", stiffness: 160, damping: 15, mass: 0.9 },
  rotateZ: { duration: 1.1, ease: "easeOut" },
  scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
} as const;

const content: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } } };
const picture: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  shown: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } },
};
const line: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

/** Starts loading the next product picture while the tag is turned away, so it never turns back blank. */
function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    const done = () => resolve();
    img.onload = done;
    img.onerror = done;
    img.src = src;
    setTimeout(done, 350);
  });
}

/**
 * The page's one loud element: a kite-yellow rental tag hanging on a string.
 * To show the next item it turns on its string: away until edge-on, swaps while nobody can see
 * the face, then turns back and settles. On phones it lies sideways, so it turns on its left hole.
 * With reduced motion it simply shows the new item.
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
  const [shown, setShown] = useState(item);
  const [turned, setTurned] = useState(false);
  /** The price shown before the last turn, so the new one can count up or down from it. */
  const [fromPrice, setFromPrice] = useState(item.dayPrice);
  const current = reduce ? item : shown;

  // First appearance: one swing on the string.
  useEffect(() => {
    if (reduce) return;
    animate(scope.current, { rotateZ: [0, -6, 3.5, -1.5, 0.5, 0] }, { duration: 1.5, ease: "easeOut" });
  }, [reduce, animate, scope]);

  // A new item: turn away, swap, turn back.
  useEffect(() => {
    if (reduce || item.id === shown.id) return;
    const previousPrice = shown.dayPrice;
    let cancelled = false;
    (async () => {
      const ready = preload(`/items/${item.id}.svg`);
      await animate(scope.current, { rotateY: 90, rotateZ: -2, scale: 0.97 }, TURN_AWAY);
      await ready;
      if (cancelled) return;
      setFromPrice(previousPrice);
      setShown(item);
      setTurned(true);
      await animate(scope.current, { rotateY: [-90, 0], rotateZ: [2, -1, 0], scale: [0.97, 1] }, TURN_BACK);
    })();
    return () => {
      cancelled = true;
    };
  }, [item, shown, reduce, animate, scope]);

  return (
    <div
      className="relative mx-auto w-full max-w-md [perspective:1100px] lg:mt-16 lg:max-w-none"
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
          href={`/items/${current.id}`}
          className="group relative block bg-tag py-4 pr-4 pl-12 tag-h lg:px-6 lg:pt-12 lg:pb-6 lg:tag-v"
        >
          <span
            aria-hidden
            className="tag-hole top-1/2 left-4 -translate-y-1/2 lg:top-4 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-0"
          />
          {/* Keyed by item, so each new item plays its entrance; the very first one is already in place. */}
          <motion.div
            key={current.id}
            variants={content}
            initial={turned ? "hidden" : false}
            animate="shown"
            className="flex items-center gap-4 lg:block"
          >
            <motion.span
              variants={picture}
              className="relative block size-20 shrink-0 overflow-hidden rounded-2xl bg-card lg:aspect-[4/3] lg:size-auto lg:w-full"
            >
              <Image
                src={`/items/${current.id}.svg`}
                alt=""
                fill
                unoptimized
                loading={eager || turned ? "eager" : "lazy"}
                fetchPriority={eager && !turned ? "high" : "auto"}
                sizes="(min-width: 1024px) 320px, 80px"
                className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
            </motion.span>
            <span className="block min-w-0 flex-1 lg:mt-4">
              <motion.span variants={line} className="block text-xs font-semibold text-ink/70">
                {current.popular ? "Popular" : "Ready to rent"} in {current.area}
              </motion.span>
              <motion.span
                variants={line}
                className="block truncate text-lg leading-tight font-bold group-hover:underline lg:whitespace-normal lg:text-xl"
              >
                {current.title}
              </motion.span>
              <motion.span variants={line} className="mt-2 block border-t-2 border-dashed border-ink/25 pt-2 lg:mt-4 lg:pt-3">
                <CountingPrice from={fromPrice} value={current.dayPrice} className="type-condensed text-2xl font-extrabold lg:text-3xl" />
                <span className="text-sm"> a day</span>
                <span className="block text-xs text-ink/70">
                  {formatINR(current.weekRate)} a day when you rent for 7 days or more
                </span>
              </motion.span>
            </span>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

/** A rupee amount that counts from the previous item's price to this one's (or jumps, with reduced motion). */
function CountingPrice({ from, value, className }: { from: number; value: number; className?: string }) {
  const reduce = useReducedMotion();
  const amount = useMotionValue(reduce ? value : from);
  const text = useTransform(amount, (v) => formatINR(Math.round(v)));

  useEffect(() => {
    if (reduce) {
      amount.set(value);
      return;
    }
    const controls = animateValue(amount, value, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, reduce, amount]);

  return <motion.span className={className}>{text}</motion.span>;
}
