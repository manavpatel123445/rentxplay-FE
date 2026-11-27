# 0001: PostgreSQL on Supabase, used only as a database

Status: Accepted · 2026-11-27

## Context
Bookings and payments must never overlap or double-charge. Search needs "near me". We need free hosting for a portfolio demo, and the project must show backend skills (auth, uploads, APIs).

## Decision
Use PostgreSQL with PostGIS, hosted on Supabase, accessed only by our own API through Prisma. Do not use Supabase Auth, Storage, Realtime or its auto-generated REST API. Enable Row Level Security with no policies so only the API's database role reads data.

## Options considered
- MongoDB: flexible, but no exclusion constraints or `daterange`; relational booking data fits poorly.
- MySQL: fine, but weaker geo support and no exclusion constraints.
- Full Supabase (auth, storage, realtime): fastest, but skips the backend work the project exists to show.

## Consequences
Double bookings are blocked by an exclusion constraint on date ranges. Free tier pauses after about a week idle; restore it before demos. Two connection strings: pooled for the app, direct for migrations.
