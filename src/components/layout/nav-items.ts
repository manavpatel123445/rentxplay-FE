/** The four tabs from the navigation map (User Flows doc). */
export const navItems = [
  { href: "/", label: "Explore" },
  { href: "/bookings", label: "Bookings" },
  { href: "/lend", label: "Lend" },
  { href: "/account", label: "Account" },
] as const;

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/search") || pathname.startsWith("/items");
  return pathname.startsWith(href);
}
