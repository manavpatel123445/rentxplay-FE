# GearLoop — System Architecture (HLD)

Nov 27, 2026 · @Yudiz

GearLoop is one Node.js + TypeScript API (a modular monolith) serving a Next.js web app and a Flutter app, backed by PostgreSQL on Supabase, Redis for cache and jobs, S3 for photos and Razorpay in test mode for payments.

## Architecture

&#91;embedded content: system architecture · 2 clients, API + worker, 3 data stores, 2 outside services\]

Photos skip the API: it hands the client a pre-signed S3 URL and the client uploads straight to S3. Razorpay calls back into the API with a signed webhook when a payment succeeds.

## Components

The API is one deployable split into modules by feature, so each module could become its own service later without a rewrite.

| Component | Responsibility |
| --- | --- |
| Web app | All renter, owner and admin screens; server-rendered pages for search and product SEO |
| Mobile app | Renter flows and push notifications, calling the same REST API |
| API: auth module | Sign-up, login, OTP, JWT access + refresh tokens, roles |
| API: listings module | Create and edit items, photos (pre-signed S3 URLs), availability, search |
| API: bookings module | Requests, approval, status changes, the no-double-booking rule |
| API: payments module | Razorpay orders, webhook handling, deposit refunds, idempotency keys |
| API: chat + notifications | Socket.io rooms per booking; puts email and push jobs on the queue |
| Job worker | Runs queued and scheduled jobs: expire unpaid bookings after 30 min, return reminders, late fees, auto-refunds |
| PostgreSQL | Source of truth for users, items, bookings, payments, reviews |
| Redis | Cache for search and product pages, OTP codes, rate-limit counters, BullMQ queue, Socket.io adapter |
| S3 + CloudFront | Stores photos; CloudFront serves them fast and cached |

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Web | Next.js 16 + TypeScript + Tailwind | Server rendering for search pages, one language with the API, already set up in GearLoop-FE |
| Mobile | Flutter | Existing skill; one codebase for Android and iOS |
| API | Node.js + Express + TypeScript | Shared types with the web app; large job market; simple to explain |
| ORM | Prisma | Type-safe queries and migrations; raw SQL where needed (exclusion constraint, PostGIS) |
| Database | PostgreSQL + PostGIS on Supabase | Exclusion constraint stops double bookings; transactions for payments; geo search; free hosting |
| Cache + queue | Redis + BullMQ | One tool for cache, OTP, rate limits and background jobs |
| Real-time | Socket.io | Chat and live booking status with rooms and reconnects built in |
| Files | AWS S3 + CloudFront | Pre-signed uploads keep large files off the API |
| Payments | Razorpay test mode | Indian payment methods (UPI, cards); test keys only for the demo |
| Validation | Zod | Same schemas validate requests on the API and forms on the web |
| Testing | Jest + Supertest, Playwright | API and booking logic tests; end-to-end checks of key screens |
| DevOps | Docker, GitHub Actions | Same image runs locally and in production; tests run on every pull request |

## Booking and payment flow

&#91;embedded content: booking to payment · 5 participants, 10 messages\]

The browser's "payment done" redirect is only a hint; the booking turns PAID when the signed webhook arrives, so a closed tab or a faked redirect cannot mark it paid.

## Deployment setup

The portfolio deployment uses free or near-free tiers; the AWS column is the production-style setup to learn later.

| Part | Local | Portfolio (live demo) | Production-style (AWS) |
| --- | --- | --- | --- |
| Web | `next dev` | Vercel | S3 + CloudFront or Amplify |
| API + worker | Docker Compose | Render or Railway (2 services from one image) | ECS Fargate behind a load balancer |
| PostgreSQL | Postgres + PostGIS in Docker | Supabase free tier | RDS PostgreSQL |
| Redis | Redis in Docker | Upstash or Render Redis | ElastiCache |
| Photos | MinIO or a dev S3 bucket | S3 + CloudFront | S3 + CloudFront |
| Secrets | `.env` (not committed) | Host environment variables | Secrets Manager |

**CI/CD (GitHub Actions)**

1. On every pull request: install, lint, type-check, run tests against Postgres and Redis service containers.
2. On merge to `main`: build the Docker image, run Prisma migrations, deploy API and worker; Vercel deploys the web app.
3. After deploy: hit `/health` and roll back to the previous image if it fails.

## Scaling, security and reliability

| Concern | Approach |
| --- | --- |
| More traffic | API is stateless (JWT, sessions in Redis), so add instances behind a load balancer; Socket.io uses the Redis adapter to work across instances |
| Slow reads | Cache search and product pages in Redis (short TTL, cleared when a listing changes); indexes on category, status and a GiST index on location |
| Double bookings | PostgreSQL exclusion constraint on date ranges plus transactions; the database is the final guard |
| Payment correctness | Verify webhook signatures; store each event id once (idempotency); compute amounts on the server |
| Failed jobs | BullMQ retries 3 times with backoff, then moves the job to a failed list we can inspect |
| Auth | bcrypt passwords, 15-minute access tokens, rotating refresh tokens, rate-limited login and OTP |
| Data access | Supabase Row Level Security on with no policies, so only the API reaches the data; no DB keys in clients |
| Monitoring | Structured logs (Pino), Sentry for errors, `/health` checks, uptime alerts |

## Open questions

- [ ] Express or NestJS for the API (Express assumed here)?
- [ ] Render or Railway for the API and worker?
- [ ] Resend or AWS SES for email?
- [ ] Should the worker run as its own service from day one, or inside the API process for the MVP?
