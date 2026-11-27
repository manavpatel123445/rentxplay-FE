# 0002: Next.js web app in its own repo

Status: Accepted · 2026-11-27

## Context
The plan first suggested a monorepo (api, web, mobile). Work started on the frontend first, in its own folder.

## Decision
Keep the web app in `GearLoop-FE` (Next.js 16, TypeScript, Tailwind 4). The API and Flutter app get their own repos. Shared contracts are the REST API and the docs in `docs/`.

## Options considered
- Monorepo with workspaces: shared types, but more tooling before any screen exists.

## Consequences
Types such as `Item` are duplicated until the API publishes an OpenAPI spec; generate client types from it then. Pricing logic in `src/lib/pricing.ts` must be kept in step with the API.
