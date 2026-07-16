# Med-Ease

Healthcare management platform with multi-role dashboards for patients, professionals, facilities, pharmacies, transport providers, and administrators.

Built with React, Vite, TypeScript, Tailwind CSS, and shadcn/ui.

## Prerequisites

- **Node.js** 20+ (22 or 24 recommended)
- **pnpm** 10.x ([install](https://pnpm.io/installation))

npm is not supported for installation (enforced via preinstall script). Use pnpm.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start the frontend dev server (http://localhost:5173)
pnpm dev

# Optional: copy environment template
cp .env.example .env
```

## Local Infrastructure (E1-01)

Start the full backend development stack (PostgreSQL 16, Redis 7, MinIO, OpenSearch, Mailpit, pgAdmin, API, Worker):

```bash
# One command from repository root (creates docker/.env if missing)
pnpm docker:bootstrap

# Or manually from docker/
cd docker
cp .env.example .env
docker compose up -d
docker compose ps
```

Verify health after containers are up:

```bash
pnpm docker:verify
```

| Service | URL |
|---------|-----|
| API liveness | http://localhost:3000/api/healthz |
| API readiness | http://localhost:3000/api/healthz/ready |
| Swagger | http://localhost:3000/api/docs |
| Worker | http://localhost:3001/healthz |
| Mailpit UI | http://localhost:8025 |
| pgAdmin | http://localhost:5050 |
| MinIO Console | http://localhost:9001 |

See [docker/README.md](./docker/README.md) for credentials, pgAdmin setup, and reset instructions.

**Requirements:** Docker Desktop 4.x+ (or Docker Engine 24+), 8 GB+ RAM recommended for OpenSearch.

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the Med-Ease frontend dev server |
| `pnpm dev:api` | Start the NestJS API dev server (`@medease/api`) |
| `pnpm build` | Typecheck all packages, then build all artifacts |
| `pnpm build:web` | Build the frontend only |
| `pnpm typecheck` | Run TypeScript checks across the workspace |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting without writing |
| `pnpm docker:bootstrap` | Create `docker/.env` (if needed) and start the local stack |
| `pnpm docker:ps` | Show Docker Compose service status |
| `pnpm docker:verify` | Probe API, worker, OpenSearch, and Mailpit health |
| `pnpm docker:down` | Stop the local infrastructure stack |

### Backend API (`apps/api`)

NestJS 11 platform shell (E1-02). Health-only — no domain modules yet.

```bash
pnpm --filter @medease/api run dev
# GET http://localhost:3000/api/healthz
# GET http://localhost:3000/api/healthz/ready
# GET http://localhost:3000/api/docs
```

Shared platform packages live under `packages/` (`@medease/config`, `@medease/logger`, `@medease/types`, `@medease/constants`, `@medease/utils`).

### Database (E1-03 — Supabase)

```bash
cp database/.env.example database/.env   # paste Supabase connection string
pnpm prisma:generate
pnpm prisma:validate
pnpm prisma:migrate:deploy               # apply foundation migration
```

Use the **direct** Supabase connection (port 5432) for migrations, not the pooler URL.

### Package-specific commands

```bash
# Frontend
pnpm --filter @workspace/medease run dev
pnpm --filter @workspace/medease run build

# API server
pnpm --filter @workspace/api-server run dev

# Regenerate API client from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen

# Push database schema (requires DATABASE_URL)
pnpm --filter @workspace/db run push
```

## Project Structure

This is a **pnpm workspace monorepo** (not Turborepo or Nx).

```
Med-Ease/
├── apps/
│   ├── api/              # NestJS platform API (health + Swagger)
│   └── worker/           # BullMQ worker shell
├── packages/
│   ├── config/           # @medease/config — Zod-validated env
│   ├── logger/           # @medease/logger — Pino structured logging
│   ├── types/            # @medease/types — shared platform types
│   ├── constants/        # @medease/constants — API constants
│   └── utils/            # @medease/utils — shared utilities
├── artifacts/
│   ├── medease/          # Main React frontend application
│   ├── api-server/       # Legacy Express API stub (deprecated)
│   └── mockup-sandbox/   # Internal UI mockup preview tool
├── docker/               # Local infrastructure (Docker Compose)
├── lib/
│   ├── api-client-react/ # Generated React Query hooks (Orval)
│   ├── api-spec/         # OpenAPI spec + codegen config
│   ├── api-zod/          # Generated Zod schemas
│   └── db/               # Drizzle ORM schema + migrations
├── scripts/              # Workspace utility scripts
├── attached_assets/      # Static assets referenced by the frontend
├── package.json          # Workspace root
├── pnpm-workspace.yaml   # Workspace + dependency catalog
├── tsconfig.base.json    # Shared TypeScript config
└── eslint.config.js      # ESLint flat config
```

### Frontend (`artifacts/medease`)

The frontend follows the **mandatory folder structure** defined in Document 03.2.

```
src/
├── app/                        # Application bootstrap (no business logic)
│   ├── router/router.tsx
│   ├── providers/providers.tsx
│   ├── layouts/                # RootLayout, MarketingLayout, AuthLayout
│   ├── guards/AuthGuard.tsx
│   ├── error-boundaries/RouteErrorBoundary.tsx
│   ├── suspense/RouteSuspense.tsx
│   └── App.tsx
├── config/                     # Static configuration only
│   ├── routes.ts
│   ├── navigation/
│   ├── permissions/
│   ├── constants/
│   ├── env.ts
│   ├── feature-flags.ts
│   └── themes.ts
├── features/                   # Business modules (self-contained)
│   ├── patient/
│   │   ├── pages/Dashboard.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── validation/
│   │   ├── routes.tsx
│   │   └── index.ts            # Public barrel — never import deep internals
│   ├── professional/
│   ├── facility/
│   ├── pharmacy/
│   ├── transport/
│   ├── admin/
│   ├── auth/
│   └── marketing/
├── shared/                     # Cross-feature reusable code
│   ├── ui/                     # Design system (shadcn)
│   ├── layout/                 # PortalShell, PortalHeader, PortalSidebar, PageContainer
│   ├── medical/                # VitalsCard, MedicationCard
│   ├── forms/
│   ├── charts/
│   ├── hooks/
│   └── lib/
├── services/                   # API, storage, notifications (no UI)
│   └── api/query-client.ts
├── types/                      # Global shared TypeScript types
├── assets/                     # Static images, icons, fonts
├── styles/globals.css
└── main.tsx
```

**Import aliases (required):**

| Alias | Path |
|-------|------|
| `@/app/*` | Application layer |
| `@/shared/*` | Shared UI, layout, hooks |
| `@/features/*` | Feature modules (via `index.ts` barrels) |
| `@/services/*` | Service layer |
| `@/config/*` | Configuration |
| `@/types/*` | Global types |
| `@/assets/*` | Static assets |
| `@/styles/*` | Global styles |

**Naming conventions:**
- React components & pages: `PascalCase.tsx` (e.g. `Dashboard.tsx`)
- Hooks: `useAppointments.ts`
- Folders: `kebab-case`

### Layout hierarchy (Document 03.3)

```
RootLayout → Route Group Layout → Portal/Marketing/Auth Layout → Page → Section
```

| Layout | Routes | Purpose |
|--------|--------|---------|
| `RootLayout` | All | Skip link, global error boundary |
| `MarketingLayout` | `/` | Public nav, footer, theme toggle |
| `AuthLayout` | `/login`, `/register`, `/forgot-password` | Split-screen auth frame |
| `PortalLayout` | `/patient`, `/professional`, etc. | 72px header, 280px sidebar, breadcrumbs, ⌘K search |

Portal pages render **content only** inside `PageContainer` (max 1600px). Use `PageHeader` and `SectionLayout` for structured pages.
- Constants: `UPPER_SNAKE_CASE`

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5173` | Frontend dev/preview server port |
| `BASE_PATH` | No | `/` | Vite base path for deployment |
| `DATABASE_URL` | For API/DB | — | PostgreSQL connection string |

See `.env.example` for a template.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 7, TypeScript 5.9 |
| Styling | Tailwind CSS 4, shadcn/ui (New York) |
| Routing | wouter |
| State / Data | TanStack React Query |
| Theme | next-themes (light / dark / system) |
| API | Express 5, Zod validation |
| Database | PostgreSQL, Drizzle ORM |
| Codegen | Orval (OpenAPI → React Query hooks) |
| Package manager | pnpm workspaces with catalog |

## IDE Setup (Cursor / VS Code)

Recommended extensions are listed in `.vscode/settings.json`:

- ESLint
- Prettier
- Tailwind CSS IntelliSense

Format-on-save and ESLint auto-fix are enabled by default.

## Development Notes

- The frontend lives at `artifacts/medease`, not the repo root. Use `pnpm dev` from the workspace root.
- Shared libraries under `lib/` are consumed via workspace protocol (`workspace:*`).
- Dependency versions are centralized in `pnpm-workspace.yaml` under the `catalog` section.
- The `mockup-sandbox` artifact is an internal preview tool and is not required for normal development.

## License

MIT
