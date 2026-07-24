# Med-Ease

Healthcare management platform with multi-role dashboards for patients, professionals, facilities, pharmacies, transport providers, and administrators.

Built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

## Prerequisites

- **Node.js** 20+ (22 or 24 recommended)
- **pnpm** 10.x ([install](https://pnpm.io/installation))
- **Supabase project** ([supabase.com](https://supabase.com)) — PostgreSQL, Storage, optional Realtime
- **Managed Redis** (e.g. [Upstash](https://upstash.com)) — required for BullMQ audit queues

npm is not supported for installation (enforced via preinstall script). Use pnpm.

## Quick Start

```bash
# Install dependencies
pnpm install

# Configure environment (see .env.example and database/.env.example)
cp .env.example .env
cp database/.env.example database/.env

# Generate Prisma client and apply migrations
pnpm prisma:generate
pnpm prisma:migrate:deploy

# Start the frontend dev server (http://localhost:5173)
pnpm dev

# Start the NestJS API (http://localhost:3000)
pnpm dev:api

# Wire frontend to API (one-time)
cp artifacts/medease/.env.example artifacts/medease/.env.local
```

Sign in at http://localhost:5173 with seeded user `admin@medease.health` / `demo`.

## Production deployment

Deploy the **frontend to Vercel** and **API + worker to Render**. See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Supabase Setup

Project URL: `https://fpoxkbfyfiltrcwnkcrk.supabase.co`

1. Copy connection strings from **Supabase Dashboard → Project Settings → Database**.
2. Paste into `database/.env`:
   - `DATABASE_URL` — session pooler (runtime queries, seed)
   - `DIRECT_URL` — direct connection (migrations only)
3. Copy API keys into root `.env`:
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Create Storage buckets in **Supabase Dashboard → Storage**:
   - `medease-documents`
   - `medease-exports`
5. Enable Realtime on tables if using `@medease/realtime` (optional).

See [docs/GITHUB-SECRETS.md](./docs/GITHUB-SECRETS.md) for CI secret configuration.

## Scripts

| Script                       | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `pnpm dev`                   | Start the Med-Ease frontend dev server           |
| `pnpm dev:api`               | Start the NestJS API (`dev:stable` on Windows)   |
| `pnpm build`                 | Typecheck all packages, then build all artifacts |
| `pnpm build:web`             | Build the frontend only                          |
| `pnpm typecheck`             | Run TypeScript checks across the workspace       |
| `pnpm lint`                  | Run ESLint                                       |
| `pnpm format`                | Format code with Prettier                        |
| `pnpm format:check`          | Check formatting without writing                 |
| `pnpm prisma:generate`       | Generate Prisma client                           |
| `pnpm prisma:validate`       | Validate Prisma schema                           |
| `pnpm prisma:migrate:deploy` | Apply migrations to Supabase                     |
| `pnpm ci:smoke`              | Run Platform Smoke locally (API + worker + E2E)  |

### Backend API (`apps/api`)

NestJS 11 platform API with IAM, Patients, health probes, and Swagger.

```bash
pnpm --filter @medease/api run dev:stable
# GET http://localhost:3000/api/healthz
# GET http://localhost:3000/api/healthz/ready
# GET http://localhost:3000/api/docs
```

Shared platform packages live under `packages/` (`@medease/config`, `@medease/logger`, `@medease/storage`, `@medease/realtime`, etc.).

### Database (Prisma + Supabase)

```bash
cp database/.env.example database/.env   # Supabase connection strings
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:migrate:deploy
pnpm --filter @medease/database run seed
```

Use the **direct** Supabase connection for `DIRECT_URL` when running migrations.

## Project Structure

This is a **pnpm workspace monorepo**.

```
Med-Ease/
├── apps/
│   ├── api/              # NestJS platform API
│   └── worker/           # BullMQ worker
├── packages/
│   ├── config/           # @medease/config — Zod-validated env
│   ├── storage/          # @medease/storage — Supabase Storage abstraction
│   ├── realtime/         # @medease/realtime — optional Supabase Realtime adapter
│   ├── logger/           # @medease/logger — Pino structured logging
│   └── ...
├── database/             # Prisma schema, migrations, seed
├── artifacts/medease/    # Main React frontend application
├── scripts/ci/           # Platform Smoke, E2E, OpenAPI verification
└── .github/workflows/    # Platform CI (Supabase-backed)
```

## Environment Variables

| Variable                    | Required | Description                             |
| --------------------------- | -------- | --------------------------------------- |
| `DATABASE_URL`              | Yes      | Supabase pooler URL (runtime)           |
| `DIRECT_URL`                | Yes      | Supabase direct URL (migrations)        |
| `SUPABASE_URL`              | Yes      | Supabase project URL                    |
| `SUPABASE_ANON_KEY`         | Yes      | Supabase anon key                       |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes      | Supabase service role key (server-side) |
| `REDIS_URL`                 | Yes      | Managed Redis URL (BullMQ)              |
| `JWT_SECRET`                | Yes      | Min 32 characters                       |
| `OPENSEARCH_URL`            | No       | Optional search backend                 |

See `.env.example` for the full template.

## Tech Stack

| Layer           | Technology                       |
| --------------- | -------------------------------- |
| Frontend        | React 19, Vite 7, TypeScript 5.9 |
| Backend         | NestJS 11, Prisma, PostgreSQL    |
| Database        | Supabase (PostgreSQL)            |
| Storage         | Supabase Storage                 |
| Queues          | BullMQ + managed Redis           |
| Package manager | pnpm workspaces with catalog     |

## License

MIT
