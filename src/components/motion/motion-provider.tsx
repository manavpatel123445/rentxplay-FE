"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/** For people who ask for reduced motion, Motion drops movement and keeps plain fades. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
