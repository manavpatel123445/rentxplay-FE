"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const list: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.18 } } };
const step: Variants = { hidden: { opacity: 0, y: 16 }, shown: { opacity: 1, y: 0 } };
const badge: Variants = {
  hidden: { scale: 0.4 },
  shown: { scale: 1, transition: { type: "spring", stiffness: 420, damping: 14 } },
};

/** "How a rental loops back": steps pop in one by one, then the return path draws from step 3 back to step 1. */
export function LoopSteps({ steps }: { steps: { title: string; text: string }[] }) {
  const reduce = useReducedMotion();
  return (
    <>
      <motion.ol
        className="mt-8 grid gap-8 md:grid-cols-3 md:gap-10"
        variants={list}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      >
        {steps.map((s, index) => (
          <motion.li key={s.title} variants={step} className="relative">
            <motion.span
              aria-hidden
              variants={badge}
              className="type-condensed grid size-11 place-items-center rounded-full bg-tag text-xl font-extrabold text-ink"
            >
              {index + 1}
            </motion.span>
            <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
            <p className="mt-1 text-paper/75">{s.text}</p>
          </motion.li>
        ))}
      </motion.ol>

      {/* The return path: from the last step back to the first. */}
      <motion.div
        aria-hidden
        initial={reduce ? false : { clipPath: "inset(0 0 0 100%)" }}
        whileInView={{ clipPath: "inset(0 0 0 0%)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.6, ease: "easeInOut" }}
        className="relative mx-[16.66%] mt-6 hidden h-10 rounded-b-[2.5rem] border-2 border-t-0 border-dashed border-tag md:block"
      >
        <span className="absolute -top-2 -left-[7px] size-0 border-x-[6px] border-b-[9px] border-x-transparent border-b-tag" />
      </motion.div>
    </>
  );
}
