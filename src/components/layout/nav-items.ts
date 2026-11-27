/** The four tabs from the navigation map (User Flows doc). */
export const navItems = [
  { href: "/", label: "Explore" },
  { href: "/bookings", label: "Bookings" },
  { href: "/lend", label: "Lend" },
  { href: "/account", label: "Account" },
] as const;

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/search") || pathname.startsWith("/items");
  // Log in and sign up are where the Account tab leads when nobody is logged in.
  if (href === "/account") return ["/account", "/login", "/signup"].some((p) => pathname.startsWith(p));
  return pathname.startsWith(href);
}

/** Desktop header links. Account lives in the header's account menu (or Log in) instead. */
export const headerItems = navItems.filter((item) => item.href !== "/account");
