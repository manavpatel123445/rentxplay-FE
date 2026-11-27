"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Log in and sign up have their own switch, so the header's copies of those links step aside there. */
export function HideOnAuthPages({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) return null;
  return children;
}
