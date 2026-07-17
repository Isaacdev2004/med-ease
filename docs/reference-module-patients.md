# Reference Module — Patients

Patients is the **canonical clinical reference module** for Med-Ease. Platform concerns remain IAM; every clinical domain (Appointments, Encounters, Prescriptions, etc.) should mirror this pipeline without deviation.

## Certification checklist

| Phase | Layer                    | Location                                                                                    | Status |
| ----- | ------------------------ | ------------------------------------------------------------------------------------------- | ------ |
| P1    | Prisma models + RLS      | `database/prisma/clinical.prisma`, `database/rls/clinical/patients.sql`                     | ✅     |
| P2    | Repository contract      | `packages/patients-contract/`                                                               | ✅     |
| P2    | Backend repository       | `apps/api/src/patients/patients.repository.ts`                                              | ✅     |
| P3    | Service + domain events  | `apps/api/src/patients/patients.service.ts`, `packages/events/src/events/patient.events.ts` | ✅     |
| P4    | Controller + permissions | `apps/api/src/patients/patients.controller.ts`                                              | ✅     |
| P5    | OpenAPI + Orval          | `lib/api-spec/openapi.yaml`, generated clients                                              | ✅     |
| P6    | Frontend HTTP adapter    | `artifacts/medease/src/services/patients/repository.ts`                                     | ✅     |
| P6    | Frontend mock adapter    | `artifacts/medease/src/services/patients/repository.mock.ts`                                | ✅     |
| P7    | Contract tests           | `artifacts/medease/src/services/patients/__contract__/`                                     | ✅     |
| P8    | E2E certification        | `scripts/ci/e2e-patients.mjs`                                                               | ✅     |

## Implementation pipeline (repeat for each clinical module)

```text
Prisma model
    ↓
Migration + RLS
    ↓
Repository contract (@medease/*-contract)
    ↓
Repository (extends TenantAwareRepository)
    ↓
Service (domain logic + DomainEventBus.publish)
    ↓
Controller (@RequirePermission + OpenAPI DTOs)
    ↓
openapi:export → Orval codegen
    ↓
Frontend repository.ts (httpTransport + Orval URLs)
    ↓
Frontend repository.mock.ts
    ↓
Contract tests (mock + HTTP)
    ↓
E2E certification (CI smoke job)
```

## Frontend adapter layout

```text
artifacts/medease/src/services/patients/
├── repository.ts          # HTTP — PatientsRepositoryContract
├── repository.mock.ts     # In-memory mock
├── dto-mappers.ts         # OpenAPI DTO → contract types
├── patients.service.ts    # Facade (always uses HTTP repository)
├── mock-data.ts
├── index.ts
└── __contract__/
    ├── repository.contract.ts
    ├── mock.contract.test.ts
    ├── http.contract.test.ts
    └── fixtures/patients.fixtures.ts
```

Professional portal consumes patients via `patientsService` through `professional.service.ts` — hooks, query keys, pages, and routing remain unchanged.

## CI gates

| Stage                   | Command                                                   |
| ----------------------- | --------------------------------------------------------- |
| Mock contract           | `pnpm --filter @workspace/medease run test:contract:mock` |
| OpenAPI drift           | `node scripts/ci/verify-openapi-regen.mjs`                |
| Platform + Patients E2E | `node scripts/ci/run-smoke-ci.mjs` (smoke CI job)         |
| HTTP contract           | Runs inside smoke job with `CONTRACT_TEST_API_URL`        |

## Demo credentials

| Email                    | Role           | Password |
| ------------------------ | -------------- | -------- |
| `admin@medease.health`   | platform_admin | `demo`   |
| `doctor@medease.health`  | physician      | `demo`   |
| `patient@medease.health` | patient        | `demo`   |

**Demo tenant:** `01930000-0000-7000-8000-000000000001`  
**Seeded patient (Sarah Jenkins):** `01930000-0000-7000-8000-000000000301` / MRN-10293

## E2E vertical slice certified

```text
HTTP repository / REST client
    ↓
NestJS PatientsController
    ↓
JWT + PermissionGuard + ABAC
    ↓
ALS tenant context
    ↓
Prisma + Postgres RLS
    ↓
DomainEventBus
    ↓
Audit handler → BullMQ (medease:audit)
    ↓
Worker → audit.audit_logs
```

## Do not

- Put business logic in repositories
- Call `AuditPublisher` directly from services (use `DomainEventBus`)
- Modify frontend hooks, pages, or routing when adding HTTP adapters
- Accept `tenantId` from untrusted callers in repositories (use request context)

## Certification

Every clinical module must satisfy [module-certification-checklist.md](./module-certification-checklist.md) before merge.  
Detailed engineering criteria: [backend-definition-of-done.md](./backend-definition-of-done.md).
