# GearLoop — Product Requirements (PRD)

Nov 27, 2026 · @Yudiz

GearLoop is a peer-to-peer rental marketplace where people list electronics they own (cameras, PS5s, phones, laptops, drones) and others nearby rent them by the day. The MVP lets owners list items and renters search, book dates without double bookings, and pay rent plus a refundable deposit in test mode.

## Goals

GearLoop must let a renter find and book a nearby gadget in under 3 minutes, and must never confirm two bookings for the same item on overlapping dates.

**Product goals**

- Owners earn from gadgets they rarely use, with a deposit protecting them against damage.
- Renters get an item for a day or a week at a fraction of the buying price.
- Both sides trust each other through verification, ratings and pickup/return photos.

**Portfolio goals (why this project exists)**

- Show full-stack skills end to end: Next.js web, Flutter mobile, Node.js + TypeScript API, PostgreSQL.
- Solve real backend problems interviewers ask about: concurrent bookings, payments with webhooks and idempotency, geo search, queues and real-time chat.
- Deploy it live with Docker and CI/CD, using test payments and demo data only.

**Success criteria for the MVP**

| Measure | Target |
| --- | --- |
| Search to booking request | Under 3 minutes for a new renter |
| Double bookings under concurrent requests | 0 (enforced by the database) |
| API p95 response time | Under 300 ms for search and product pages |
| Unpaid approved bookings auto-expired | 100% after 30 minutes |
| Test coverage of booking and payment logic | At least 80% |

## Competitor research

The two sites studied split into a company-owned model (SharePal) and a true peer-to-peer model (Hygglo); GearLoop follows Hygglo's model and borrows SharePal's pricing and trust features.

| Platform | Model | Features seen on the site | What GearLoop takes |
| --- | --- | --- | --- |
| [SharePal](https://sharepal.in/) (India) | Company owns the stock; delivers and picks up | Categories (photography, gaming, outdoor, entertainment); select rental dates to see price; "frequently rented together" add-ons; zero deposit; free delivery above ₹1,200; 12-point quality check; support 10 am–10 pm | Date-first pricing, add-on suggestions, a visible condition checklist |
| [SharePal FAQ](https://sharepal.in/faq) | — | Per-day price falls for longer rentals (GoPro: ₹1,299 for 1 day, ₹2,799 for 7 days); rental days exclude the delivery and return days; extensions apply to the whole order; profile verification (KYC) required; pay online or on delivery | Tiered pricing, a clear day-count rule, mandatory verification |
| [Hygglo](https://hygglo.com/uk) (UK and Nordics; fatllama.com now redirects here) | Peer-to-peer: people lend to people | Search by location and dates; prices shown as a per-day range; "Popular" badges; recently active items; reviews naming the lender and item; everyone verified; a guarantee protecting both sides; pickup and drop-off at times that suit both | Location + date search, two-sided reviews, verification badge, owner-set pickup times |

Rentkar and ShareGrid also appeared in search results but their sites were not opened, so their features are not listed here.

## User types and roles

One account can be both owner and renter; admin is a separate role.

| Role | Who | Can do | Cannot do |
| --- | --- | --- | --- |
| Guest | Not logged in | Browse and search listings, view product pages and reviews | Book, chat, list items |
| Renter | Verified user | Request bookings, pay rent + deposit, chat with owner, upload pickup/return photos, review owner, raise disputes | Approve bookings on others' items |
| Owner | Verified user who lists items | Create and edit listings, set price tiers, deposit and blocked dates, approve or reject requests, confirm return condition, review renter, see earnings | Book own items, change a booking's price after payment |
| Admin | Platform staff | Approve listings, review verification (mock KYC), resolve disputes and split deposits, block users, view platform dashboard | Read users' passwords or payment details |

## Functional requirements

16 of the 30 requirements are MVP; change a row's Phase to re-scope it.

| ID | Module | Requirement | Phase |
| --- | --- | --- | --- |
| FR-01 | Auth | Sign up and log in with email + password; JWT access token (15 min) and refresh token (30 days), refresh rotation | MVP |
| FR-02 | Auth | Phone OTP verification: OTP in Redis, 5-minute expiry, max 5 attempts, rate limited | MVP |
| FR-03 | Auth | Google sign-in&#32; | Phase 2 |
| FR-04 | Profile | Profile with photo, city, rating and verification badge | MVP |
| FR-05 | Verification | Mock KYC: user uploads a demo document, admin approves, badge shown; required before first booking or listing | Phase 2 |
| FR-06 | Listings | Create and edit a listing: title, category, brand/model, condition, description, specs (JSONB), 3–8 photos via S3 pre-signed upload, pickup area and instructions | MVP |
| FR-07 | Listings | Pricing: per-day price with 1-, 3- and 7-day tiers, deposit amount, minimum and maximum rental days | MVP |
| FR-08 | Listings | Availability calendar: owner blocks dates; booked and blocked days shown to renters | MVP |
| FR-09 | Listings | Moderation: new listings stay pending until an admin approves them | Phase 2 |
| FR-10 | Listings | AI helper: generate a description and suggest a price from the title and photos | Later |
| FR-11 | Search | Keyword, category, price range and available-dates filters; sort by price, rating, newest; cursor pagination | MVP |
| FR-12 | Search | Nearby search within a chosen radius (PostGIS) | Phase 2 |
| FR-13 | Search | Wishlist | Later |
| FR-14 | Booking | Booking request with dates and a price breakdown (rent, deposit, platform fee) shown before sending | MVP |
| FR-15 | Booking | No double booking: database exclusion constraint on overlapping active bookings | MVP |
| FR-16 | Booking | Owner approves or rejects within 24 hours, else the request expires | MVP |
| FR-17 | Booking | Cancellation by renter or owner, with refunds per the business rules | MVP |
| FR-18 | Booking | Extension request for extra days, if the dates are free | Phase 2 |
| FR-19 | Payments | Pay rent + deposit through Razorpay test mode within 30 minutes of approval | MVP |
| FR-20 | Payments | Webhooks with signature verification and idempotency keys | MVP |
| FR-21 | Payments | Deposit refund on completion; partial refund after a dispute | MVP |
| FR-22 | Payments | Owner earnings ledger: rent earned, platform fee, payout status | Phase 2 |
| FR-23 | Trust | Pickup and return photos, timestamped, from both sides | MVP |
| FR-24 | Trust | Two-sided reviews after completion (1–5 stars + text) | MVP |
| FR-25 | Trust | Disputes raised within 48 hours of return; admin decides the deposit split | Phase 2 |
| FR-26 | Communication | In-app chat per booking (Socket.io) | Phase 2 |
| FR-27 | Communication | Email and push notifications for request, approval, payment and expiry (BullMQ workers) | Phase 2 |
| FR-28 | Communication | Return reminders 24 hours and 2 hours before the end; late fee calculated automatically | Phase 2 |
| FR-29 | Admin | Dashboard: users, listings, bookings, revenue, open disputes | Phase 2 |
| FR-30 | Mobile | Flutter app for renter flows: log in, search, book, pay, chat, push notifications | Later |

## Business rules

These are starting defaults for the build; every number is a config value, not hard-coded.

| Rule | Default | Example |
| --- | --- | --- |
| Rental days | Return date minus pickup date; minimum 1 day, maximum 30 days | Pick up 5 Jun, return 8 Jun = 3 days |
| Tiered price | Owner sets a 1-day, 3-day and 7-day per-day rate; the booking uses the rate for its length | ₹500/day, ₹400/day for 3+ days, ₹300/day for 7+ days; 7 days = ₹2,100 |
| Service fee | Renter pays 10% of rent on top; owner receives rent minus 5% commission | Rent ₹2,100: renter pays ₹210 fee, owner gets ₹1,995 |
| Deposit | Owner sets it; held until return is confirmed; never used to pay rent | PS5 deposit ₹5,000 |
| Deposit refund | Within 24 hours of the owner confirming condition; automatic after 48 hours if the owner does not respond and no dispute is open | — |
| Request expiry | Owner must approve or reject within 24 hours | Request at 10:00 Mon expires 10:00 Tue |
| Payment window | Approved booking must be paid within 30 minutes, else it expires and the dates free up | — |
| Overlap check | Bookings in APPROVED, PAID or PICKED\_UP block their dates; REQUESTED bookings may overlap until one is approved | — |
| Renter cancels | More than 48 hours before pickup: full rent refund; 24–48 hours: 50%; under 24 hours: none; deposit always refunded | — |
| Owner cancels after payment | Renter gets a full refund; owner gets a strike; 3 strikes suspend their listings | — |
| Late return | 1.5 × the day rate for each extra day or part day, taken from the deposit | 1 day late at ₹500/day = ₹750 |
| Damage or missing parts | Either side opens a dispute within 48 hours of return with photos; admin decides how much deposit the owner keeps | — |
| Lead time | Pickup at least 2 hours after the booking is paid | — |

## Booking lifecycle

&#91;embedded content: booking statuses · 6 main steps, 4 side states\]

Only APPROVED, PAID and PICKED\_UP lock the item's dates; expiry, cancellation and refunds run as background jobs.

## MVP scope

The MVP is the web app plus API covering list, search, book, pay and return for one city, built in sprints 1–5.

**In the MVP**

- Email/password login with JWT refresh, phone OTP, profiles (FR-01, 02, 04)
- Listings with photos, tiered pricing, deposit and availability calendar (FR-06, 07, 08)
- Search with filters, sorting and pagination (FR-11)
- Booking request, owner approval, expiry, cancellation and the double-booking constraint (FR-14 to 17)
- Razorpay test-mode payment, webhooks, deposit refund (FR-19 to 21)
- Pickup/return photos and two-sided reviews (FR-23, 24)

**Not in the MVP**

- Google sign-in, mock KYC, listing moderation, nearby search, extensions, earnings ledger
- Chat, notifications and reminders, disputes, admin dashboard
- AI listing helper, wishlist, Flutter app
- Real money, real ID documents, delivery logistics, insurance, multiple cities

**Data rule:** the deployed demo uses Razorpay test keys and seeded demo users and items only.

## Non-functional requirements

| Area | Requirement |
| --- | --- |
| Security | Passwords hashed with bcrypt (cost 12); JWT secrets and keys only in backend env; Helmet, CORS allow-list, input validation with Zod on every endpoint |
| Security | Rate limits: login and OTP 5 per 15 minutes per IP/phone; general API 100 requests per minute per user |
| Security | Supabase: Row Level Security on every table with no policies, so only the backend reaches the data; no database keys in web or mobile apps |
| Payments | Webhook signatures verified; each payment event processed once (idempotency key stored); amounts computed on the server, never trusted from the client |
| Data integrity | Booking create, approve and pay run in database transactions; the exclusion constraint is the final guard against overlaps |
| Performance | p95 under 300 ms for search and product pages; indexes on (category, city), (product\_id, status) and a GiST index on location |
| Scalability | Stateless API servers so more can be added behind a load balancer; Redis for cache, OTPs and rate limits |
| Reliability | Background jobs (expiry, reminders, refunds) retried 3 times with backoff; failed jobs logged |
| Privacy | Phone numbers hidden until a booking is paid; exact address shared only for pickup; demo data only in the deployed app |
| Observability | Structured logs (Pino), error tracking (Sentry), a /health endpoint |
| Quality | Jest + Supertest tests for booking and payment logic, at least 80% coverage; CI runs lint and tests on every pull request |
| Accessibility | Web app meets WCAG 2.1 AA contrast and keyboard navigation |

## Open questions

- [ ] Which city do the demo listings cover first (Ahmedabad assumed) yas that we are going for the frist
- [ ] Final product name: is "GearLoop" free to use as a domain and repo name?
- [ ] Pickup only, or also owner delivery with a delivery fee?we are going have the delivery fee for the delivery fro that product
- [ ] Keep the 10% renter fee + 5% owner commission, or one fee?
- [ ] Should the deposit have a platform minimum (for example 20% of the item value)?
- [ ] Categories at launch: cameras, consoles, phones, laptops, drones, audio, or fewer?
- [ ] Express or NestJS for the API?

## Sources

- [SharePal home page](https://sharepal.in/)
- [SharePal PS5 product page](https://sharepal.in/bangalore/gaming-console/ps5-console/ps5-console-with-2-controller-on-rent)
- [SharePal FAQ](https://sharepal.in/faq)
- [Hygglo UK home page](https://hygglo.com/uk) (fatllama.com redirects here)
