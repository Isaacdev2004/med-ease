# Reference Module — IAM

IAM is the **canonical reference implementation** for every backend domain module in Med-Ease. New modules (Patients, Appointments, Billing, etc.) should mirror this shape without deviation.

## Checklist

| Layer                    | Location                                                | Status |
| ------------------------ | ------------------------------------------------------- | ------ |
| Prisma models            | `database/prisma/iam.prisma`                            | ✅     |
| Migration                | `database/prisma/migrations/*_e2_06_iam`                | ✅     |
| Repository contract      | `packages/iam-contract/src/iam-repository.contract.ts`  | ✅     |
| Backend repository       | `apps/api/src/iam/iam.repository.ts`                    | ✅     |
| Service                  | `apps/api/src/iam/iam.service.ts`                       | ✅     |
| Controller + OpenAPI     | `apps/api/src/iam/iam.controller.ts`                    | ✅     |
| Domain events            | `packages/events/src/events/user.events.ts`             | ✅     |
| Audit handler            | `packages/events/src/handlers/audit.handler.ts`         | ✅     |
| Frontend mock repository | `artifacts/medease/src/services/iam/repository.mock.ts` | ✅     |
| Frontend HTTP adapter    | `artifacts/medease/src/services/iam/repository.ts`      | ✅     |
| DTO mappers              | `artifacts/medease/src/services/iam/dto-mappers.ts`     | ✅     |
| Contract tests           | `artifacts/medease/src/services/iam/__contract__/`      | ✅     |
| RLS                      | tenant-scoped queries via `TenantAwareRepository`       | ✅     |
| Permissions              | `@RequirePermission` on controller routes               | ✅     |

## Shared repository helpers (`@medease/prisma`)

Extract once, reuse in every module:

| Helper              | File                                      |
| ------------------- | ----------------------------------------- |
| Pagination          | `helpers/pagination.ts`                   |
| Contract pagination | `helpers/contract-pagination.ts`          |
| Search              | `helpers/search.ts`                       |
| Export              | `helpers/export.ts`                       |
| Prisma errors       | `helpers/repository-errors.ts`            |
| Tenant scope        | `repositories/tenant-aware.repository.ts` |

## Implementation pipeline (repeat for each module)

```text
Prisma model
    ↓
Migration + RLS
    ↓
Repository (extends TenantAwareRepository)
    ↓
Service (domain logic + DomainEventBus.publish)
    ↓
Controller (@RequirePermission + OpenAPI)
    ↓
openapi:export → Orval codegen
    ↓
Frontend HTTP repository adapter
    ↓
repository.mock.ts + __contract__ tests
    ↓
CI: mock contract (fast) + HTTP contract + E2E (slow)
```

## Do not

- Put business logic in repositories
- Call `AuditPublisher` directly from services (use `DomainEventBus`)
- Modify frontend hooks, pages, or services when adding HTTP adapters
- Accept `tenantId` from untrusted callers in repositories (use request context)

## Clinical reference module

**Patients** — certified clinical reference module (`docs/reference-module-patients.md`). Appointments, Encounters, Prescriptions, and other clinical domains must follow the same pipeline and certification gates.

## Certification

Every module must satisfy [module-certification-checklist.md](./module-certification-checklist.md) before merge.  
Detailed engineering criteria: [backend-definition-of-done.md](./backend-definition-of-done.md).
