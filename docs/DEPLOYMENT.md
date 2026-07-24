# Production deployment — Vercel (frontend) + Render (API + worker)

Med-Ease uses **Supabase** for Postgres/Storage, **Upstash** (or similar) for Redis, **Vercel** for the React SPA, and **Render** for the NestJS API and BullMQ worker.

## Architecture

```text
Browser (Vercel SPA)
    → HTTPS + JWT Bearer
Render API (NestJS) ──→ Supabase Postgres + Storage
    └── enqueue ──→ Redis ──→ Render Worker (audit queues)
```

## Prerequisites

1. Supabase project with migrations applied (`pnpm prisma:migrate:deploy`)
2. Seed data for login users (`pnpm prisma:seed`) — e.g. `admin@medease.health` / `demo`
3. Redis URL (`rediss://...` from Upstash)
4. GitHub repo connected to Vercel and Render

## 1. Render — API service

Create a **Web Service** (or use `render.yaml` blueprint):

| Setting        | Value                                                                                                               |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| Root directory | repository root                                                                                                     |
| Build          | `pnpm install --frozen-lockfile && pnpm prisma:generate && pnpm build:libs && pnpm --filter @medease/api run build` |
| Pre-deploy     | `pnpm prisma:migrate:deploy`                                                                                        |
| Start          | `node apps/api/dist/main.js`                                                                                        |
| Health check   | `/api/healthz`                                                                                                      |

### Required environment variables (API)

Copy from local `.env` / `database/.env` and [GITHUB-SECRETS.md](./GITHUB-SECRETS.md):

| Variable                    | Notes                                               |
| --------------------------- | --------------------------------------------------- |
| `DATABASE_URL`              | Supabase session pooler                             |
| `DIRECT_URL`                | Direct or pooler URL for migrations                 |
| `SUPABASE_URL`              | Project URL                                         |
| `SUPABASE_ANON_KEY`         |                                                     |
| `SUPABASE_SERVICE_ROLE_KEY` |                                                     |
| `REDIS_URL`                 | `rediss://...`                                      |
| `JWT_SECRET`                | **Rotate** — min 32 chars, not the dev default      |
| `NODE_ENV`                  | `production`                                        |
| `AUTH_COOKIE_SECURE`        | `true`                                              |
| `CORS_ORIGIN`               | Your Vercel URL, e.g. `https://med-ease.vercel.app` |
| `OTEL_ENABLED`              | `false` (unless you have an OTLP collector)         |

## 2. Render — Worker service

Separate **Web Service**:

| Setting      | Value                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Build        | `pnpm install --frozen-lockfile && pnpm prisma:generate && pnpm build:libs && pnpm --filter @medease/worker run build` |
| Start        | `node apps/worker/dist/main.js`                                                                                        |
| Health check | `/healthz`                                                                                                             |

### Required environment variables (worker)

| Variable       | Notes                      |
| -------------- | -------------------------- |
| `REDIS_URL`    | Same as API                |
| `DATABASE_URL` | Same as API (audit writer) |
| `DIRECT_URL`   | Same as API                |
| `NODE_ENV`     | `production`               |

## 3. Vercel — Frontend

Connect the repo and set **Root Directory** to `artifacts/medease` (not `apps/api`).

Vercel reads `artifacts/medease/vercel.json`, which installs and builds from the monorepo root.

| Setting        | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| Root Directory | **`artifacts/medease`**                                                             |
| Framework      | Other (auto from `vercel.json`)                                                     |
| Install        | `cd ../.. && pnpm install --frozen-lockfile`                                        |
| Build          | `pnpm run vercel-build` (builds frontend workspace libs only — no Prisma)          |
| Output         | `dist` (inside `artifacts/medease`)                                                 |

Alternatively, leave Root Directory empty and use the repo-root `vercel.json` (`pnpm run vercel-build`).

### Required environment variables (Vercel)

| Variable            | Example                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | `https://medease-api.onrender.com` (Render API URL, **no** `/api` suffix) |

Do **not** set `VITE_AUTH_MODE=demo` in production.

## 4. Local full-stack dev

```powershell
# Terminal 1 — API
pnpm dev:api

# Terminal 2 — frontend (create artifacts/medease/.env.local from .env.example)
pnpm dev
```

Sign in with seeded credentials: `admin@medease.health` / `demo`

## 5. Post-deploy checklist

- [ ] `GET https://<api>/api/healthz` returns `{ "status": "ok" }`
- [ ] `GET https://<api>/api/healthz/ready` shows postgres + redis + storage ok
- [ ] Vercel app loads; login succeeds with seeded user
- [ ] Patient list/search works in UI
- [ ] GitHub Actions Platform CI still green

## Auth model (SPA)

The frontend uses **NestJS JWT auth** when `VITE_API_BASE_URL` is set:

- Login → `POST /api/auth/login` → access + refresh tokens in JSON
- Refresh → `POST /api/auth/refresh` with refresh token in body (cross-origin safe)
- API calls → `Authorization: Bearer <accessToken>`

Refresh tokens are stored in `sessionStorage` / `localStorage` (remember me), not cookies, so Vercel and Render can live on different domains.

## Troubleshooting

| Symptom                          | Fix                                                           |
| -------------------------------- | ------------------------------------------------------------- |
| CORS error in browser            | Set `CORS_ORIGIN` on Render to exact Vercel URL               |
| `build:libs` not found on Vercel | Set Root Directory to **`artifacts/medease`**, not `apps/api` |
| Prisma build fails on Vercel     | Frontend uses `build:web-libs` (contracts only), not full `build:libs` |
| Login works locally, not in prod | Check `VITE_API_BASE_URL` at **build** time on Vercel         |
| 401 on all API calls             | Confirm JWT_SECRET matches; re-login after deploy             |
| Worker audit lag                 | Verify worker service running and `REDIS_URL` shared with API |
