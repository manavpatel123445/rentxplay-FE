"use client";

import { motion, useAnimate, useReducedMotion } from "motion/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef } from "react";
import { formatINR } from "@/lib/format";
import { useAuthPreview } from "./auth-preview";

export type PegItem = { id: string; title: string; dayPrice: number };

/**
 * Where each hanging item sits. The tag hangs right of centre, which leaves the top-left free for
 * one item on wide screens (on narrower ones it would touch the tag).
 */
const spots = [
  { className: "left-[5%] top-[6%] hidden xl:block", rotate: -5 },
  { className: "left-[7%] bottom-[8%]", rotate: 4 },
  { className: "right-[7%] bottom-[12%]", rotate: -3 },
];

/**
 * The right half of log in and sign up: a gear-shop pegboard. Real items hang on pegs with their
 * prices; in the middle hangs the renter's own yellow tag, which fills in as they type.
 * Decorative (the form holds the same information), so it is hidden from screen readers.
 */
export function Pegboard({ items }: { items: PegItem[] }) {
  const patternId = useId();
  return (
    <div aria-hidden className="relative hidden overflow-hidden rounded-[32px] bg-plate lg:block">
      <svg className="absolute inset-0 size-full">
        <defs>
          <pattern id={patternId} width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="3" fill="var(--color-rule)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {items.slice(0, spots.length).map((item, index) => (
        <HangingItem key={item.id} item={item} {...spots[index]} />
      ))}

      <div className="absolute top-[8%] left-[57%] -translate-x-1/2">
        <OwnTag />
      </div>
    </div>
  );
}

function Peg() {
  return <span className="mx-auto block size-3.5 rounded-full border-[3px] border-ink-soft bg-card" />;
}

function HangingItem({ item, className, rotate }: { item: PegItem; className: string; rotate: number }) {
  return (
    <div className={`absolute w-36 ${className}`}>
      <Peg />
      <span className="mx-auto block h-5 w-0.5 bg-ink-soft" />
      <div style={{ rotate: `${rotate}deg` }} className="origin-top rounded-2xl border border-rule bg-card p-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-plate">
          <Image src={`/items/${item.id}.svg`} alt="" fill unoptimized sizes="144px" className="object-cover" />
        </div>
        <p className="mt-2 truncate px-1 text-xs font-semibold">{item.title}</p>
        <p className="px-1 pb-0.5 text-xs text-ink-soft">{formatINR(item.dayPrice)} a day</p>
      </div>
    </div>
  );
}

/** The person's tag. Swings in once, then nudges each time what they type changes it. */
function OwnTag() {
  const pathname = usePathname();
  const { email } = useAuthPreview();
  const signup = pathname.startsWith("/signup");
  const written = email.trim();

  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const first = useRef(true);

  useEffect(() => {
    if (reduce) return;
    if (first.current) {
      first.current = false;
      animate(scope.current, { rotate: [-8, 5, -2.5, 1, 0] }, { duration: 1.6, ease: "easeOut", delay: 0.15 });
    } else {
      animate(scope.current, { rotate: [0, -1.6, 0.8, 0] }, { duration: 0.5, ease: "easeOut" });
    }
  }, [written, signup, reduce, animate, scope]);

  return (
    <div className="flex flex-col items-center">
      <Peg />
      <span className="block h-16 w-0.5 bg-ink" />
      <motion.div ref={scope} className="-mt-[23px] origin-[50%_23px]">
        <div className="relative w-[300px] bg-tag px-8 pt-14 tag-v">
          <span className="tag-hole top-4 left-1/2 -translate-x-1/2" />
          <p className="text-sm font-semibold text-ink/60">Renter in Ahmedabad</p>
          <p className="type-condensed mt-2 min-h-[2.75rem] border-b-2 border-ink pt-2 pb-1 text-xl leading-tight font-extrabold [overflow-wrap:anywhere]">
            {written || <span className="text-ink/30">you@example.com</span>}
          </p>
          <p className="-mx-8 mt-8 border-t-2 border-dashed border-ink/25 px-8 py-5 text-sm font-medium">
            {signup ? "Your deposit comes back after every rental." : "Nothing is charged until the owner says yes."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
