import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-rule disabled:text-ink-soft";

const variants: Record<Variant, string> = {
  primary: "bg-action text-white hover:bg-action-dark",
  secondary: "border-2 border-ink text-ink hover:bg-ink hover:text-paper",
  ghost: "text-action hover:underline underline-offset-4",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

type Style = { variant?: Variant; size?: Size };

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & Style) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & Style) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
