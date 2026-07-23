# Implementation Backlog

**Med-ease Enterprise Healthcare Platform**  
**Phase:** 08.3+ Implementation  
**Tracking:** Update [API Coverage Matrix](./api-coverage-matrix.md) when epics complete  
**Governance:** Structural changes require [ADR](./adr/README.md)

Epics map to the [Backend Roadmap](./08.1-backend-foundation-architecture.md#backend-roadmap) but are **actionable engineering work units** for sprints.

---

## Epic 1 — Platform Bootstrap

**Goal:** Runnable backend infrastructure locally and in CI.  
**Phase:** 08.3 (part 1)  
**Blocked by:** Nothing — start here

| ID    | Story                            | Acceptance criteria                                                                       | Status |
| ----- | -------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| E1-01 | Supabase + managed services      | Supabase Postgres, Storage buckets, managed Redis; health probes green                    | ✅     |
| E1-02 | Monorepo `apps/api` NestJS shell | App boots, ConfigModule validates env, `/api/healthz` returns 200, Swagger at `/api/docs` | ✅     |
| E1-03 | Prisma multi-schema bootstrap    | Foundation schemas, enums, RLS helpers; `prisma validate` passes                          | ✅     |
| E1-04 | Shared packages scaffold         | `@medease/config`, `@medease/logger`, `@medease/prisma`, `@medease/uuid`                  | ✅     |
| E1-05 | Worker production framework      | Envelope, middleware, DLQ, scheduler, metrics, lifecycle hooks                            | ✅     |
| E1-06 | CI pipeline stage                | Verify, security (audit, gitleaks, license, SBOM), smoke, artifacts                       | ✅     |
| E1-07 | Observability & monitoring       | OpenTelemetry, Prometheus, Grafana, Loki, Tempo, alerting, `/api/platform/info`           | ✅     |

---

## Epic 2 — Security & IAM

**Goal:** Auth, tenancy, audit — first domain module.  
**Phase:** 08.3 (part 2)  
**Blocked by:** Epic 1

| ID      | Story                                 | Acceptance criteria                                                                                                            | Status |
| ------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| E2-01   | JWT + refresh token flow              | Access 15m, rotating refresh, httpOnly cookie                                                                                  | 🟡     |
| E2-02   | Supabase Auth integration             | Login replaces `demo-auth-service.ts` adapter                                                                                  | ⬜     |
| E2-03   | Multi-tenancy middleware              | AsyncLocalStorage context, tenant resolver, Prisma session vars, BullMQ propagation                                            | ✅     |
| E2-04   | PostgreSQL RLS policies               | `core` + identity auth tables enforce tenant isolation                                                                         | ✅     |
| E2-05   | RBAC guards                           | `@RequirePermission()` matches frontend strings                                                                                | ✅     |
| E2-06   | IAM module — full repository contract | All methods in [contract matrix](./repository-contract-matrix.md#iam-iamrepository--38-methods--phase-083-first-domain-module) | ✅     |
| E2-07   | Audit & security events pipeline      | Domain events → BullMQ → audit persistence; no direct DB writes from services                                                  | ✅     |
| E2-07.5 | Domain event bus                      | `DomainEventBus` + `AuditHandler`; services publish domain events only                                                         | ✅     |
| E2-08   | Frontend IAM repository adapter       | HTTP adapter via `RepositoryTransport`; mock preserved for contract tests                                                      | ✅     |
| E2-09   | Repository contract + E2E tests       | Shared contract suite (mock + HTTP), Supabase E2E auth→audit, OpenAPI regen gate                                               | ✅     |
| E2-10   | Enterprise IAM features               | MFA, OAuth, OIDC, SAML, device trust, risk engine                                                                              | ⬜     |

---

## Epic 3 — Shared Platform Services

**Goal:** Infrastructure all domain modules reuse.  
**Phase:** 08.4

| ID    | Story                       | Acceptance criteria                                                  | Status |
| ----- | --------------------------- | -------------------------------------------------------------------- | ------ |
| E3-01 | Redis cache abstraction     | `@medease/cache` with tenant-scoped keys                             | ⬜     |
| E3-02 | BullMQ queue registry       | Named queues + outbox poller                                         | ⬜     |
| E3-03 | Supabase document storage   | Upload/download SDK via `@medease/storage`; bucket per tenant prefix | ⬜     |
| E3-04 | OpenSearch indexing service | Index document/provider content                                      | ⬜     |
| E3-05 | WebSocket gateway           | Redis adapter; auth on connect                                       | ⬜     |
| E3-06 | Email/SMS/push abstractions | Mailpit in dev; provider interface                                   | ⬜     |
| E3-07 | Notifications module        | Fan-out from domain events                                           | ⬜     |
| E3-08 | Observability               | Pino JSON logs, OTEL traces, `/ready` probe                          | ⬜     |

---

## Epic 4 — Core Clinical APIs

**Goal:** PHR, scheduling, meds, labs, imaging, monitoring, telehealth.  
**Phase:** 08.5  
**Blocked by:** Epic 2 DoD

| Module                | Repository                    | Priority | Status |
| --------------------- | ----------------------------- | -------- | ------ |
| Patient Records (PHR) | `patientRecordRepository`     | P0       | ⬜     |
| Appointments          | `appointmentRepository`       | P0       | ⬜     |
| Medications           | `medicationRepository`        | P0       | ⬜     |
| Care Plans            | `carePlanRepository`          | P1       | ⬜     |
| Laboratory            | `laboratoryRepository`        | P1       | ⬜     |
| Radiology             | `radiologyRepository`         | P1       | ⬜     |
| Patient Monitoring    | `patientMonitoringRepository` | P1       | ⬜     |
| Telemedicine          | `telemedicineRepository`      | P2       | ⬜     |

Each module: Prisma models → NestJS module → OpenAPI → tests → frontend HTTP adapter → coverage matrix ✅

---

## Epic 5 — Enterprise Operations APIs

**Phase:** 08.6

| Module      | Repository              | Status |
| ----------- | ----------------------- | ------ |
| Billing     | `billingRepository`     | ⬜     |
| Inventory   | `inventoryRepository`   | ⬜     |
| Procurement | `procurementRepository` | ⬜     |
| Workforce   | `workforceRepository`   | ⬜     |
| Facilities  | `facilitiesRepository`  | ⬜     |
| Finance     | `financeRepository`     | ⬜     |
| Quality     | `qualityRepository`     | ⬜     |

---

## Epic 6 — Intelligence & Population Health APIs

**Phase:** 08.7

| Module            | Repository                   | Status |
| ----------------- | ---------------------------- | ------ |
| Population Health | `populationHealthRepository` | ⬜     |
| CDSS              | `cdssRepository`             | ⬜     |
| Interoperability  | `interoperabilityRepository` | ⬜     |
| Research          | `researchRepository`         | ⬜     |
| Public Health     | `publicHealthRepository`     | ⬜     |
| AI Intelligence   | `aiIntelligenceRepository`   | ⬜     |
| Executive         | `executiveRepository`        | ⬜     |

---

## Epic 7 — Platform Services APIs

**Phase:** 08.8

| Module          | Repository                | Status |
| --------------- | ------------------------- | ------ |
| Documents       | `documentRepository`      | ⬜     |
| Workflows       | `workflowRepository`      | ⬜     |
| Messaging       | `messagingRepository`     | ⬜     |
| Reporting       | `reportingRepository`     | ⬜     |
| API Platform    | `apiPlatformRepository`   | ⬜     |
| Platform Admin  | `platformAdminRepository` | ⬜     |
| Medical Library | (service)                 | ⬜     |
| Directory       | (service)                 | ⬜     |

---

## Epic 8 — Quality & Production Readiness

**Phase:** 08.9 – 08.10

| ID    | Story                                         | Status |
| ----- | --------------------------------------------- | ------ |
| E8-01 | Contract test suite (all modules)             | ⬜     |
| E8-02 | Load tests (k6) — auth, PHR, appointments     | ⬜     |
| E8-03 | Security regression (OWASP ZAP staging)       | ⬜     |
| E8-04 | HIPAA control review checklist                | ⬜     |
| E8-05 | Staging deployment pipeline                   | ⬜     |
| E8-06 | Production deployment + runbooks              | ⬜     |
| E8-07 | Frontend repository cutover (all modules)     | ⬜     |
| E8-08 | Deprecate Express `artifacts/api-server` stub | ⬜     |

---

## Sprint guidance

| Sprint focus  | Epics                                      |
| ------------- | ------------------------------------------ |
| Sprint 1–2    | Epic 1                                     |
| Sprint 3–4    | Epic 2                                     |
| Sprint 5–6    | Epic 3                                     |
| Sprint 7+     | Epics 4–7 (one module at a time, DoD each) |
| Final sprints | Epic 8                                     |

---

## Definition of done (every story)

See [Backend Definition of Done](./backend-definition-of-done.md). No story closes without tests and coverage matrix update.

---

_Backlog is implementation-driven. Update this file when stories complete; do not expand architecture docs unless ADR-required._
