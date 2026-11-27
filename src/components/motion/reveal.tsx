"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};

const child: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 26 } },
};

/** Fades its RevealItem children up one after another the first time they scroll into view. */
export function RevealGroup({
  children,
  className,
  list,
}: {
  children: ReactNode;
  className?: string;
  /** Render as a <ul> (children become <li>). */
  list?: boolean;
}) {
  const Tag = list ? motion.ul : motion.div;
  return (
    <Tag
      className={className}
      variants={group}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, list }: { children: ReactNode; className?: string; list?: boolean }) {
  const Tag = list ? motion.li : motion.div;
  return (
    <Tag className={className} variants={child}>
      {children}
    </Tag>
  );
}
