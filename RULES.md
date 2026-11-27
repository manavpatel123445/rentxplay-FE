# GearLoop frontend — rules for agents

Read this before changing anything. These rules keep the app from breaking and keep the design consistent.

## 1. Before you write code
- This is **Next.js 16 + React 19 + Tailwind 4**. APIs differ from older versions. Read the guide in `node_modules/next/dist/docs/` before using a Next.js API you are not sure about (see `AGENTS.md`).
- Read a file before editing it. Other agents and the user may have changed it.
- Change only what the task asks. No drive-by refactors, renames or new dependencies without asking.

## 2. Next.js rules (Cache Components is ON)
- Any component that reads `params`, `searchParams`, `cookies()` or `headers()` must sit inside `<Suspense fallback={…}>`. Otherwise the dev overlay shows a blocking-route error.
- Client components that call `useSearchParams()` must also be inside `<Suspense>`.
- Dynamic routes (`/items/[id]`) keep `generateStaticParams` returning at least one param.
- Use the global `PageProps<"/route">` and `LayoutProps<"/route">` types. No imports needed.
- Add `"use client"` only to components that need state, effects or browser APIs. Pages stay server components.
- Never put secrets in client code or in `NEXT_PUBLIC_` variables.

## 3. Business rules (from the PRD — do not change silently)
- All money maths lives in `src/lib/pricing.ts`. Never calculate prices inside components.
- Rental days = return date minus pickup date. Minimum 1.
- Tiered rate: 1 day, 3+ days, 7+ days. Service fee 10% of rent. Delivery fee only when delivery is chosen. Deposit is separate and refundable.
- Booked dates can never be selected. Use `overlapsUnavailable()`.
- If a rule must change, update `pricing.ts`, say so in your summary, and flag that the PRD needs updating.

## 4. Data
- Until the API exists, all data comes from `src/lib/mock-data.ts`. Demo data only: fictional names, no real phone numbers, addresses or ID documents.
- Types live in `src/lib/types.ts`. Update the type first, then the data, then the UI.
- Product images are SVGs in `public/items/<item-id>.svg`. Every item needs one.

## 5. Design system (do not break the look)
- Use the colour tokens in `src/app/globals.css` only. No raw hex values in components.
  - `action` (Google blue) = buttons and links
  - `tag` (Google yellow) = the rental tag, the one loud element per page
  - `booked` (Google red) = booked dates and errors only
  - `ok` (Google green) = available, deposit returned
  - `ink`, `ink-soft`, `rule`, `paper`, `card`, `plate` = text and surfaces
- Font: Google Sans Flex via `--font-gsans`. Use `.type-condensed` for prices and big headings.
- Shapes: `.tag-v` / `.tag-h` with `.tag-hole`, `.tag-outline`, `.perforated`. Reuse them; do not invent new card styles.
- Avoid: card shadows, gradient washes, ALL-CAPS labels, "A · B · C" meta strings, emoji in UI, one accented word in a headline.
- Motion: only the hero tag swing. Respect `prefers-reduced-motion`.

## 6. Quality floor (every change)
- Works on mobile (375px) and desktop. The bottom tab bar must not cover content.
- Every input has a label. Buttons say what they do ("Request booking", not "Submit").
- Visible keyboard focus. Images have `alt` text.
- Handle loading, empty and error states. Error text says what went wrong and how to fix it.

## 7. Copy
- Plain, active, sentence case. Write for the renter or owner, not the system.
- Use the same words everywhere: "Request booking", "deposit", "pickup", "delivery", "owner".

## 8. Checks before you say "done"
Run these and fix every error:
```bash
npm run lint
npx tsc --noEmit
npm run build
```
- Open the changed pages in the browser on desktop and mobile and check the console has no errors.
- Report honestly what you checked and what you did not.

## 9. Git
- Never commit, push, reset, stash or switch branches unless the user asks.
- Never commit `.env*` files or secrets.
- Commit messages use Conventional Commits: `feat(search): …`, `fix(booking): …`.
