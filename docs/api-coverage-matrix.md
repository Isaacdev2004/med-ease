# API Coverage Matrix

**Med-ease Enterprise Healthcare Platform**  
**Purpose:** Backend implementation progress tracker  
**Updated:** At each module PR merge  
**Legend:** ✅ Complete · 🔄 In progress · ⬜ Not started · — N/A

---

## Status columns

| Column         | Meaning                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| **Repository** | Frontend mock repository exists (frozen)                                 |
| **Prisma**     | Models + migration in `database/prisma/`                                 |
| **RLS**        | Row-level security policies applied                                      |
| **NestJS**     | Module + service + repository implemented                                |
| **API**        | OpenAPI spec + controllers deployed                                      |
| **Tests**      | Unit + integration + contract tests pass                                 |
| **Adapter**    | Frontend HTTP repository adapter swapped                                 |
| **DoD**        | [Backend Definition of Done](./backend-definition-of-done.md) signed off |

---

## Phase 08.3 — Platform foundation

| Component                     | Prisma | NestJS | API | Tests | DoD | Notes                   |
| ----------------------------- | ------ | ------ | --- | ----- | --- | ----------------------- |
| PostgreSQL (Supabase)         | ⬜     | —      | —   | ⬜    | ⬜  |                         |
| Prisma multi-schema bootstrap | ⬜     | ⬜     | —   | ⬜    | ⬜  |                         |
| NestJS app shell              | —      | ⬜     | ⬜  | ⬜    | ⬜  | Config, guards, filters |
| Redis                         | —      | ⬜     | —   | ⬜    | ⬜  |                         |
| BullMQ                        | —      | ⬜     | —   | ⬜    | ⬜  |                         |
| JWT + refresh tokens          | ⬜     | ⬜     | ⬜  | ⬜    | ⬜  |                         |
| Multi-tenancy middleware      | ⬜     | ⬜     | ⬜  | ⬜    | ⬜  |                         |
| Global audit interceptor      | ⬜     | ⬜     | ⬜  | ⬜    | ⬜  |                         |
| Health checks                 | —      | ⬜     | ⬜  | ⬜    | ⬜  | `/healthz`, `/ready`    |
| Observability (Pino, OTEL)    | —      | ⬜     | —   | ⬜    | ⬜  |                         |

---

## Phase 08.3 — IAM (first domain module)

| Module | Repository | Prisma | RLS | NestJS | API | Tests | Adapter | DoD |
| ------ | ---------- | ------ | --- | ------ | --- | ----- | ------- | --- |
| IAM    | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Auth   | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |

---

## Phase 08.5 — Core clinical

| Module                | Repository | Prisma | RLS | NestJS | API | Tests | Adapter | DoD |
| --------------------- | ---------- | ------ | --- | ------ | --- | ----- | ------- | --- |
| Patient Records (PHR) | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Appointments          | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Care Plans            | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Medications           | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Laboratory            | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Radiology             | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Patient Monitoring    | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Telemedicine          | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |

---

## Phase 08.6 — Enterprise operations

| Module      | Repository | Prisma | RLS | NestJS | API | Tests | Adapter | DoD |
| ----------- | ---------- | ------ | --- | ------ | --- | ----- | ------- | --- |
| Billing     | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Inventory   | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Procurement | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Workforce   | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Facilities  | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Finance     | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Quality     | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |

---

## Phase 08.7 — Intelligence

| Module            | Repository | Prisma | RLS | NestJS | API | Tests | Adapter | DoD |
| ----------------- | ---------- | ------ | --- | ------ | --- | ----- | ------- | --- |
| Population Health | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| CDSS              | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Interoperability  | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Research          | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Public Health     | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| AI Intelligence   | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Executive         | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |

---

## Phase 08.8 — Platform services

| Module          | Repository | Prisma | RLS | NestJS | API | Tests | Adapter | DoD |
| --------------- | ---------- | ------ | --- | ------ | --- | ----- | ------- | --- |
| Documents       | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Workflows       | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Messaging       | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Reporting       | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| API Platform    | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Platform Admin  | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Medical Library | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Directory       | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |
| Notifications   | ✅         | ⬜     | ⬜  | ⬜     | ⬜  | ⬜    | ⬜      | ⬜  |

---

## Summary dashboard

| Phase               | Modules   | Prisma   | API      | Adapter  | DoD      |
| ------------------- | --------- | -------- | -------- | -------- | -------- |
| 08.3 Platform + IAM | 2 + infra | 0/2      | 0/2      | 0/2      | 0/2      |
| 08.5 Clinical       | 8         | 0/8      | 0/8      | 0/8      | 0/8      |
| 08.6 Operations     | 7         | 0/7      | 0/7      | 0/7      | 0/7      |
| 08.7 Intelligence   | 7         | 0/7      | 0/7      | 0/7      | 0/7      |
| 08.8 Platform       | 9         | 0/9      | 0/9      | 0/9      | 0/9      |
| **Total**           | **33**    | **0/33** | **0/33** | **0/33** | **0/33** |

---

## Update protocol

1. Open PR for module implementation
2. Update this matrix in same PR
3. Set columns to 🔄 during review
4. Set to ✅ when [DoD](./backend-definition-of-done.md) signed off
5. Platform architect reviews summary dashboard weekly

---

_Last manual update: Architecture freeze gate (pre-08.3)_
