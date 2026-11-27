import type { NextConfig } from "next";

/**
 * Security headers for every response.
 *
 * The CSP leaves out script-src/style-src on purpose: a strict script policy needs a per-request
 * nonce, which forces every page to render dynamically (see the Next.js CSP guide) and would undo
 * static and partial prerendering. Add one through `proxy.ts` once the app has auth or payments
 * pages that need it. When Razorpay Checkout lands, allow its hosts in `form-action` and `frame-src`.
 */
// No default-src either: it is the fallback for script-src and would block Next.js's inline scripts.
const contentSecurityPolicy = [
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Stops other sites from framing GearLoop (clickjacking); older browsers read this one.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Location stays available to GearLoop itself for nearby search (PRD FR-12).
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), payment=(self)" },
  // Browsers ignore this over plain http, so it is safe in local dev.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
