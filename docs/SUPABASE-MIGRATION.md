# Supabase Infrastructure Migration Summary

**Date:** 2026-07-23  
**Scope:** Infrastructure only — no API contract, module, or DTO changes.

## What changed

- Removed all Docker artifacts (Compose stack, Dockerfiles, bootstrap scripts).
- PostgreSQL is now **Supabase-only** via Prisma (`DATABASE_URL` + `DIRECT_URL`).
- Object storage moved from MinIO to **Supabase Storage** via `@medease/storage`.
- Optional **Supabase Realtime** adapter added in `@medease/realtime`.
- GitHub Actions no longer uses Docker services or container builds.
- Platform Smoke runs against Supabase using repository secrets.

## Files removed

- `docker/` (entire directory — compose, observability, postgres init, scripts)
- `apps/api/Dockerfile`
- `apps/worker/Dockerfile`

## Files modified (high level)

- `.github/workflows/platform-ci.yml` — Supabase secrets, removed `docker` job and GHA service containers
- `database/prisma/schema.prisma` — added `directUrl`
- `database/load-env.ts` — Supabase env loading; `DIRECT_URL` fallback; CI env precedence
- `database/.env.example`, `.env.example` — Supabase-only variables
- `packages/config/` — Supabase config replaces MinIO; optional OpenSearch
- `packages/storage/` — new Supabase Storage abstraction (CommonJS build for Nest runtime)
- `packages/realtime/` — new optional Realtime adapter (CommonJS build)
- `apps/api/package.json` — `@medease/storage`; restored `@medease/types`
- `apps/api/src/health/` — Supabase Storage health check
- `scripts/ci/e2e-db.mjs` — SSL for Supabase pg connections
- `package.json` — removed `docker:*` scripts
- `README.md` — Supabase-first documentation
- `docs/GITHUB-SECRETS.md` — CI secret setup
- `docs/implementation-backlog.md`, `docs/backend-definition-of-done.md` — Supabase references
- `.gitignore` — removed `docker/.env`

## Manual steps in Supabase

1. **Database:** Ensure project `fpoxkbfyfiltrcwnkcrk` is active.
2. **Connection strings:** Configure pooler + direct URLs in local env and GitHub secrets.
3. **Storage:** Create buckets `medease-documents` and `medease-exports`.
4. **Migrations:** Run `pnpm prisma:migrate:deploy` (uses `DIRECT_URL`).
5. **Seed (optional):** `pnpm --filter @medease/database run seed`
6. **Redis:** Provision Upstash (or other managed Redis) and set `REDIS_URL`.
7. **GitHub secrets:** See [GITHUB-SECRETS.md](./GITHUB-SECRETS.md).

## Acceptance checklist

```bash
pnpm install
pnpm prisma:validate
pnpm prisma:generate
pnpm prisma:migrate:deploy   # requires database/.env
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
node scripts/ci/verify-openapi-regen.mjs
node scripts/ci/run-smoke-ci.mjs   # requires full .env + built API/worker
```

## Notes

- **Redis** is not replaced by Supabase; BullMQ still requires a managed Redis URL.
- **OpenSearch** is optional; omit `OPENSEARCH_URL` to skip the readiness check.
- **Authentication** remains JWT + NestJS; Supabase Auth integration (E2-02) is unchanged.
