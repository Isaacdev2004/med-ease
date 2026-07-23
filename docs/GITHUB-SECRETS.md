# GitHub Actions Secrets

Platform CI connects directly to Supabase and managed Redis. Configure these repository secrets under **Settings → Secrets and variables → Actions**.

## Required secrets

| Secret                      | Description                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------- |
| `SUPABASE_DATABASE_URL`     | Session pooler URL (`?sslmode=require`) — used by API runtime, seed, and E2E tests |
| `SUPABASE_DIRECT_URL`       | Direct connection URL (`db.*.supabase.co:5432`) — used by `prisma migrate deploy`  |
| `SUPABASE_URL`              | Project URL, e.g. `https://fpoxkbfyfiltrcwnkcrk.supabase.co`                       |
| `SUPABASE_ANON_KEY`         | Supabase anon/public API key                                                       |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only)                                       |
| `REDIS_URL`                 | Managed Redis URL (e.g. Upstash `rediss://...`) for BullMQ audit queue             |

## Optional overrides

These are set in the workflow `env` block and can be overridden if needed:

| Variable                            | Default in CI                  |
| ----------------------------------- | ------------------------------ |
| `SUPABASE_STORAGE_BUCKET_DOCUMENTS` | `medease-documents`            |
| `SUPABASE_STORAGE_BUCKET_EXPORTS`   | `medease-exports`              |
| `JWT_SECRET`                        | CI-only dev secret (32+ chars) |

## Fork pull requests

Secrets are not available to workflows triggered from fork PRs. Platform Smoke will not run against Supabase on fork PRs unless using a different workflow design (e.g. `pull_request_target`, not recommended for untrusted forks).

## Manual Supabase setup (one-time)

1. Create Storage buckets: `medease-documents`, `medease-exports` (public or RLS as appropriate).
2. Ensure database user has privileges to create schemas (`core`, `identity`, `clinical`, etc.).
3. Run migrations once locally or let CI `prisma migrate deploy` apply them.
4. Optionally run seed: `pnpm --filter @medease/database run seed`

## Rotating credentials

After rotating Supabase database password or API keys, update all six secrets and any local `.env` / `database/.env` files.
