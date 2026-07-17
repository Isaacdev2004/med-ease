# Module Certification Checklist

Every backend domain module must satisfy this checklist before merge. The architecture is **frozen** — if a module cannot fit this pipeline, open an architectural review (ADR) rather than introducing ad-hoc patterns.

**Reference implementations:**

| Module type         | Reference doc                                                  |
| ------------------- | -------------------------------------------------------------- |
| Platform / security | [reference-module-iam.md](./reference-module-iam.md)           |
| Clinical domains    | [reference-module-patients.md](./reference-module-patients.md) |

**Detailed criteria:** [backend-definition-of-done.md](./backend-definition-of-done.md)

---

## Certification phases

Complete all ten phases in order. Do not skip phases or merge partial work.

| Phase  | Layer                    | Requirement                                                                   | Verification                                                                |
| ------ | ------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **P1** | Database + RLS           | Prisma models, migration, RLS policies, seed data                             | `pnpm prisma:validate`, `pnpm prisma:migrate:deploy`, RLS integration tests |
| **P2** | Repository contract      | `@medease/<module>-contract` package with DTOs + repository interface         | Contract package typecheck                                                  |
| **P2** | Repository               | Backend repository extending `TenantAwareRepository`                          | Repository unit tests                                                       |
| **P3** | Service + events         | Business logic in service; side effects via `DomainEventBus.publish`          | Service unit tests; event spy assertions                                    |
| **P4** | Controller + permissions | `@RequirePermission` on every route; validated DTOs                           | Controller integration tests; 403 for denied roles                          |
| **P5** | OpenAPI + Orval          | Swagger export; generated clients in `lib/api-client-react` and `lib/api-zod` | `node scripts/ci/verify-openapi-regen.mjs` (zero drift)                     |
| **P6** | HTTP adapter             | `repository.ts` (HTTP), `repository.mock.ts`, DTO mappers, service facade     | Typecheck; feature wiring without hook/page changes                         |
| **P7** | Contract tests           | Shared suite in `__contract__/`; mock + HTTP runners                          | `pnpm --filter @workspace/medease run test:contract:mock`                   |
| **P8** | E2E certification        | Module scenarios in `scripts/ci/e2e-<module>.mjs`; wired into smoke job       | Platform Smoke CI job green                                                 |
| **P8** | Audit + queue            | Domain events → BullMQ → worker → audit tables                                | E2E audit assertions; queue drain check                                     |

---

## Implementation pipeline

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
E2E certification (Platform Smoke CI)
```

---

## CI gates (required before merge)

These run in [`.github/workflows/platform-ci.yml`](../.github/workflows/platform-ci.yml).

| Job            | Gate                               | Command                                                               |
| -------------- | ---------------------------------- | --------------------------------------------------------------------- |
| Verify         | Typecheck, lint, unit tests, build | `pnpm typecheck`, `pnpm build`, `node scripts/ci/verify-coverage.mjs` |
| Verify         | Mock repository contracts          | `pnpm --filter @workspace/medease run test:contract:mock`             |
| Verify         | OpenAPI drift                      | `node scripts/ci/verify-openapi-regen.mjs`                            |
| Platform Smoke | Migrations + seed + RLS            | `pnpm prisma:migrate:deploy`, seed, integration tests                 |
| Platform Smoke | Full vertical slice                | `node scripts/ci/run-smoke-ci.mjs`                                    |

The smoke pipeline validates:

```text
Migrations → Seed → API + Worker startup
    ↓
IAM E2E → Module E2E → HTTP contract tests → OpenAPI drift
```

---

## E2E scenarios (minimum per clinical module)

Each module E2E script must cover:

1. **Authentication** — login returns token; security event queued
2. **List / search** — pagination, filters, tenant isolation
3. **Create** — resource created; related records; CREATE audit persisted
4. **Conflict** — duplicate or invalid input → expected error; no spurious audit
5. **Update / status transitions** — business rules enforced; UPDATE audit
6. **Archive / soft delete** — hidden from default queries; audit emitted
7. **Read / view** — detail fetch; READ audit where applicable
8. **RLS isolation** — foreign tenant resource → 404 or 403
9. **Permission enforcement** — denied role → 403
10. **Audit verification** — `resource_type`, `actor_id`, `tenant_id`, `action`, `created_at`
11. **Queue drain** — BullMQ backlog clears after worker processing

See `scripts/ci/e2e-patients.mjs` as the template.

---

## Frontend adapter rules

- HTTP adapter lives in `artifacts/medease/src/services/<module>/`
- Feature services delegate to `<module>Service`; **do not** modify hooks, query keys, pages, or routing
- Mock and HTTP repositories must satisfy the same contract suite
- Align mock seed data with database seed UUIDs

---

## Do not

- Put business logic in repositories
- Call `AuditPublisher` directly from services (use `DomainEventBus`)
- Accept `tenantId` from untrusted callers in repositories (use request context)
- Merge without OpenAPI regeneration and zero drift
- Introduce new infrastructure unless the module exposes a genuinely missing platform capability

---

## Merge sign-off

```markdown
## Module: {name}

- [ ] P1–P8 complete per this checklist
- [ ] Reference doc updated (if module becomes a new reference)
- [ ] API coverage matrix row updated
- [ ] Platform Smoke CI green
- PR: #{number}
- Date: {YYYY-MM-DD}
```

---

## Suggested module sequence

After Patients is CI-certified:

1. Appointments
2. Encounters
3. Prescriptions
4. Clinical Documents
5. Orders / Lab
6. Scheduling
7. Remaining clinical modules

Each module reuses this checklist without architectural changes.
