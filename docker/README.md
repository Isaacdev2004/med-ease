# Med-ease Local Infrastructure (E1-01)

Docker Compose stack for local development. Starts PostgreSQL, Redis, MinIO, OpenSearch, Mailpit, pgAdmin, API, and Worker with one command.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) 4.x+ (Windows/macOS) or Docker Engine 24+ (Linux)
- 8 GB+ RAM recommended (OpenSearch is memory-sensitive)

### Verify Docker before starting

```bash
docker info
```

If this returns a **500 Internal Server Error** or cannot connect to `dockerDesktopLinuxEngine`, Docker Desktop is not healthy. The compose stack will not start until the engine is fixed.

**Windows fix (most common):**

```powershell
# 1. Quit Docker Desktop from the system tray
# 2. Restart WSL
wsl --shutdown
# 3. Start Docker Desktop and wait for "Engine running"
docker info
pnpm docker:bootstrap
```

If problems persist: Docker Desktop → **Troubleshoot** → **Restart Docker Desktop**, or check for updates.

## Quick start

```bash
cd docker
cp .env.example .env
docker compose up -d
docker compose ps
```

From repository root:

```bash
pnpm docker:bootstrap
pnpm docker:ps
pnpm docker:verify
pnpm docker:observability   # E1-07 — Grafana, Prometheus, Loki, Tempo, OTel Collector
```

## Verify services

| Service | URL / Port | Credentials |
|---------|------------|-------------|
| API (liveness) | http://localhost:3000/api/healthz | — |
| API (readiness) | http://localhost:3000/api/healthz/ready | Checks PG, Redis, MinIO, OpenSearch |
| Swagger | http://localhost:3000/api/docs | OpenAPI UI |
| Worker | http://localhost:3001/healthz | — |
| Worker queues | http://localhost:3001/queues | Depth + DLQ stats |
| Worker metrics | http://localhost:3001/metrics | Prometheus format |
| API metrics | http://localhost:3000/api/metrics | Prometheus format |
| Platform info | http://localhost:3000/api/platform/info | Build + schema metadata |
| Grafana | http://localhost:3002 | `admin` / `medease_grafana_dev` |
| Prometheus | http://localhost:9090 | Metrics scrape UI |
| Loki | http://localhost:3100 | Log aggregation API |
| Tempo | http://localhost:3200 | Trace backend API |
| PostgreSQL | localhost:5432 | `medease` / `medease_dev_password` |
| Redis | localhost:6379 | — |
| MinIO API | http://localhost:9000 | `medease` / `medease_minio_dev` |
| MinIO Console | http://localhost:9001 | same as above |
| OpenSearch | http://localhost:9200 | security disabled (dev) |
| OpenSearch Dashboards | http://localhost:5601 | — |
| Mailpit UI | http://localhost:8025 | — |
| pgAdmin | http://localhost:5050 | `admin@medease.local` / `medease_pgadmin_dev` |

### pgAdmin — connect to PostgreSQL

1. Open http://localhost:5050
2. **Add New Server**
3. **General** → Name: `Med-ease Local`
4. **Connection** → Host: `postgres`, Port: `5432`, Username: `medease`, Password: `medease_dev_password`

> Use hostname `postgres` (Docker network), not `localhost`, from inside pgAdmin container.

## Health checks

All services define Docker healthchecks. API readiness fails until dependencies are up:

```bash
curl http://localhost:3000/api/healthz/ready
```

## Stop / reset

```bash
docker compose down          # stop containers
docker compose down -v       # stop and remove volumes (full reset)
```

## Layout

```
docker/
├── compose.yml           # Main stack
├── compose.override.yml  # Dev overrides (auto-merged)
├── compose.observability.yml  # E1-07 observability stack overlay
├── observability/        # Prometheus, Grafana, Loki, Tempo, OTel configs
├── .env.example          # Environment template
├── postgres/init/        # DB extensions + schemas
├── minio/init-buckets.sh # Bucket bootstrap
└── README.md
```

## Out of scope (E1-01)

- Prisma migrations
- IAM / authentication
- Domain modules

See [Implementation Backlog](../docs/implementation-backlog.md) — Epic 1.
