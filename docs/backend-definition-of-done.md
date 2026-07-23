# Backend Definition of Done

**Med-ease Enterprise Healthcare Platform**  
**Applies to:** Every backend module (Phases 08.3–08.8)  
**Prerequisite:** [Architecture Freeze Gate](./08.2-architecture-freeze-gate.md) approved

## Related governance

| Document                                                              | Purpose                                        |
| --------------------------------------------------------------------- | ---------------------------------------------- |
| [Module Certification Checklist](./module-certification-checklist.md) | P1–P8 merge gate — what must pass before merge |
| [Reference Module — IAM](./reference-module-iam.md)                   | Platform/security reference implementation     |
| [Reference Module — Patients](./reference-module-patients.md)         | Clinical reference implementation              |

The checklist defines the certification pipeline; this document defines the detailed engineering quality bar.

---

## Module completion criteria

A backend module is **done** only when **all** items below are satisfied.

### 1. Data layer

| #   | Criterion                                          | Verification                                            |
| --- | -------------------------------------------------- | ------------------------------------------------------- |
| 1.1 | Prisma models defined in correct schema file       | Schema review + `prisma validate`                       |
| 1.2 | Migration created and applied cleanly              | `prisma migrate dev` on fresh DB                        |
| 1.3 | RLS policies applied for tenant/facility scope     | Integration test with wrong tenant → empty/denied       |
| 1.4 | Indexes from data dictionary present               | `\d+ table` / migration SQL review                      |
| 1.5 | Seed data for dev environment                      | Seed script runs; IDs match deterministic UUID strategy |
| 1.6 | Soft delete + audit columns on all mutable tables  | Schema inspection                                       |
| 1.7 | Optimistic locking (`version`) on mutable entities | Update conflict test → 409                              |

### 2. Repository layer

| #   | Criterion                                                                                                   | Verification                           |
| --- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| 2.1 | NestJS repository implements all methods from [Repository Contract Matrix](./repository-contract-matrix.md) | Method count diff = 0                  |
| 2.2 | Method signatures match frontend repository return shapes                                                   | Contract test vs frontend `types.ts`   |
| 2.3 | Tenant scoping enforced on every query                                                                      | Unit test: cross-tenant access blocked |
| 2.4 | Facility scoping where applicable                                                                           | Unit test                              |
| 2.5 | Pagination envelope `{ items, total, page, pageSize }`                                                      | Response shape test                    |

### 3. Service layer

| #   | Criterion                                               | Verification           |
| --- | ------------------------------------------------------- | ---------------------- |
| 3.1 | Business rules in service, not controller or repository | Code review            |
| 3.2 | Transactions for multi-table mutations                  | Integration test       |
| 3.3 | Domain events emitted for side effects                  | Event spy / outbox row |
| 3.4 | RFC 7807 errors for business rule violations            | Supertest assertion    |

### 4. Controller / API layer

| #   | Criterion                                                          | Verification                                    |
| --- | ------------------------------------------------------------------ | ----------------------------------------------- |
| 4.1 | Controller implements all repository-equivalent endpoints          | OpenAPI path count                              |
| 4.2 | DTO validation (`class-validator`) on all inputs                   | Invalid payload → 400                           |
| 4.3 | `@RequirePermission()` matches frontend permission strings exactly | Permission matrix test                          |
| 4.4 | OpenAPI 3.1 spec updated in `lib/api-spec/openapi.yaml`            | Spec lint                                       |
| 4.5 | Orval codegen regenerated                                          | `pnpm --filter @workspace/api-spec run codegen` |
| 4.6 | Idempotency key support on mutating financial/clinical endpoints   | Header replay test                              |

### 5. Security & compliance

| #   | Criterion                                                 | Verification         |
| --- | --------------------------------------------------------- | -------------------- |
| 5.1 | RBAC enforced server-side                                 | Forbidden role → 403 |
| 5.2 | ABAC evaluated where module uses facility/time/IP context | Policy test          |
| 5.3 | Audit log written on PHI read (detail) and all mutations  | Audit table query    |
| 5.4 | No PHI in application logs                                | Log review           |
| 5.5 | Break-glass sessions audited if module touches PHI        | Audit event type     |

### 6. Testing

| #   | Criterion                                     | Verification              |
| --- | --------------------------------------------- | ------------------------- |
| 6.1 | Unit tests: services ≥ 80% coverage           | Vitest coverage report    |
| 6.2 | Integration tests: repository + DB            | Testcontainers PostgreSQL |
| 6.3 | Contract tests: API response ↔ frontend types | Automated diff            |
| 6.4 | E2E smoke: critical paths via Supertest       | CI green                  |

### 7. Observability & ops

| #   | Criterion                                             | Verification           |
| --- | ----------------------------------------------------- | ---------------------- |
| 7.1 | Structured logging with `traceId`, `tenantId`, no PHI | Log sample review      |
| 7.2 | Health check unaffected                               | `/api/healthz` green   |
| 7.3 | Performance: p95 read < 200ms on seed dataset         | k6 or benchmark script |

### 8. Frontend integration readiness

| #   | Criterion                                                                | Verification           |
| --- | ------------------------------------------------------------------------ | ---------------------- |
| 8.1 | HTTP repository adapter can call all endpoints                           | Manual or adapter test |
| 8.2 | Query keys unchanged; invalidation documented                            | Frontend team sign-off |
| 8.3 | [API Coverage Matrix](./api-coverage-matrix.md) updated to ✅ for module | Matrix PR              |

### 9. Documentation

| #   | Criterion                                     | Verification |
| --- | --------------------------------------------- | ------------ |
| 9.1 | Module README in `modules/<domain>/README.md` | File exists  |
| 9.2 | OpenAPI operation descriptions complete       | Spec review  |

---

## Phase 08.3 platform foundation DoD (additional)

Before any domain module (08.5+), the platform layer must satisfy:

- [ ] Supabase PostgreSQL connected (pooler + direct URLs)
- [ ] Prisma multi-schema bootstrap migrated
- [ ] NestJS 11 app boots with ConfigModule + validation
- [ ] Redis connected (cache + session)
- [ ] BullMQ worker process boots
- [ ] JWT auth + refresh token rotation
- [ ] Multi-tenancy middleware sets `app.tenant_id` / RLS context
- [ ] IAM repository fully implemented (first domain module)
- [ ] Global audit interceptor active
- [ ] RFC 7807 exception filter registered
- [ ] Pino logging + request ID middleware
- [ ] OpenTelemetry hooks (optional stub OK)
- [ ] `/api/healthz` + `/api/healthz/ready`

---

## Definition of NOT done

- Partial method implementation ("we'll add cancel later")
- Missing RLS on new tables
- Permission checks only in frontend
- Raw SQL without tenant filter
- Breaking changes to frozen repository method signatures
- Migrations that drop columns without ADR

---

## Sign-off template (per module)

```markdown
## Module: {name}

- [ ] All DoD criteria met
- [ ] Module certification checklist (P1–P8) satisfied — see [module-certification-checklist.md](./module-certification-checklist.md)
- PR: #{number}
- Contract matrix row updated
- API coverage matrix updated
- Reviewed by: {backend lead}
- Date: {YYYY-MM-DD}
```
