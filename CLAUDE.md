@AGENTS.md

# GearLoop web (GearLoop-FE)

Peer-to-peer gadget rental marketplace (cameras, consoles, drones…) launching in Ahmedabad. This repo (`/Users/yudizsolutionsltd/GearLoop-FE`) is the **main frontend for the whole project** — all web UI work happens here, not in HeartMirror-FE (an unrelated Flutter app). The API (Node.js + Express + TypeScript, PostgreSQL on Supabase) does not exist yet — all data comes from `src/lib/mock-data.ts`.

Read before larger changes: `docs/01-PRD.md` (requirements, business rules), `docs/02-user-flows-and-wireframes.md` (screens S01–S23), `docs/03-system-architecture-HLD.md`, `docs/GLOSSARY.md`, `docs/adr/`.

## Commands

```bash
npm run dev      # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build    # also validates Cache Components rules
```

Run lint + `tsc` before saying a change is done; run `build` after touching routes, `params`, `searchParams` or caching.

## Stack and Next.js 16 rules

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS 4 (tokens in `src/app/globals.css` `@theme`, no `tailwind.config`).
- `cacheComponents` and `partialPrefetching` are on. Any component that awaits `params`, `searchParams`, `cookies()` or `headers()` must sit inside `<Suspense>` with a skeleton fallback (see `src/app/search/page.tsx`, `src/app/items/[id]/page.tsx`).
- Dynamic routes need `generateStaticParams` returning at least one param.
- `PageProps<'/route'>` and `LayoutProps<'/route'>` are global types — no import.
- Check `node_modules/next/dist/docs/` before using an API you are unsure of; this Next.js differs from older versions.

## Layout

```
src/app/            routes (Home, /search, /items/[id], placeholder tabs)
src/components/ui/  generic pieces (Button, Badge)
src/components/<feature>/  feature components (items, search, layout)
src/lib/            types, mock data, pricing rules, formatting
docs/               PRD, flows, HLD, glossary, ADRs
```

- Server Components by default; add `"use client"` only for state or browser APIs (e.g. `booking-panel.tsx`, `nav-links.tsx`).
- Import with `@/…`. Join classes with `cn()` from `src/lib/cn.ts`.

## Business rules live in one place

`src/lib/pricing.ts` mirrors the PRD: rental days = return − pickup, tier rate (1 / 3+ / 7+ days), 10% service fee, delivery fee, refundable deposit. Never compute prices inside components; change the rule there and in the PRD together. The API will become the source of truth — keep these functions pure so they can move.

## Design system

The motif is a **rental tag**. Keep it consistent:
- Colours only from tokens: `ink`, `ink-soft`, `action`, `paper`, `card`, `rule`, `tag` (kite yellow — the one loud element per page), `booked`, `ok`, `plate`. No raw hex in components.
- Font: Google Sans Flex only (variable `opsz`, `wdth`, `ROND`, set in `src/app/layout.tsx`); `.type-condensed` / `.type-semi` for display type and prices.
- Shapes: `.tag-v` / `.tag-h` + `.tag-hole`, `.perforated` dividers. Buttons are pill-shaped.
- Avoid: gradient washes, card drop shadows, "A · B · C" meta strings, all-caps labels, motion beyond the hero tag swing (respect `prefers-reduced-motion`).
- Every screen needs visible focus, loading, empty and error states (see the screen-states table in docs/02).

## Copy

Plain, active, sentence case. Prices as `formatINR()` (₹1,200). Name actions by what happens ("Request booking", "Pay ₹6,420").

## Data and safety

Demo data only: fictional owners, Razorpay **test** mode, no real ID documents. Never commit `.env*` or keys. Commit only when asked; Conventional Commits (`feat(search): …`).
