# 0003: Pricing rules in one pure module

Status: Accepted · 2026-11-27

## Context
Rental days, tier rates, service fee, delivery fee and deposit appear on search cards, the product page, checkout and booking detail. Scattered maths would drift from the PRD.

## Decision
All price maths lives in `src/lib/pricing.ts` as pure functions (`rentalDays`, `dayRate`, `quote`, `overlapsUnavailable`). Components only display a `Quote`.

## Options considered
- Compute in each component: quicker at first, inconsistent later.

## Consequences
The UI can show live totals before the API exists. When the API ships, the server's quote is the one charged; the client copy is for display and must match the PRD business rules.
