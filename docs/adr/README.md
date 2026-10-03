# Architectural Decision Records (ADR)

**Med-ease Enterprise Healthcare Platform**  
**Process owner:** Principal Architect  
**Status:** Active — required for all structural changes post-freeze

---

## Purpose

ADRs document **why** significant technical decisions were made. They support onboarding, audits, and change control after the [Architecture Freeze Gate](../08.2-architecture-freeze-gate.md).

Every major decision gets an ADR. Implementation details that do not affect architecture do not require one.

---

## When to write an ADR

| Requires ADR                               | Does not require ADR                             |
| ------------------------------------------ | ------------------------------------------------ |
| Database, ORM, or schema layout change     | Bug fix within existing patterns                 |
| New infrastructure service                 | Cache TTL tuning                                 |
| Authentication or tenancy model change     | Endpoint implementation matching frozen contract |
| Replacing a core library (queue, search)   | Test additions                                   |
| Breaking API or repository contract change | Refactor with no behavioral change               |

---

## ADR format

Each file: `docs/adr/ADR-NNNN-short-title.md`

```markdown
# ADR-NNNN: Title

**Status:** Accepted | Proposed | Superseded by ADR-XXXX
**Date:** YYYY-MM-DD
**Deciders:** roles or names

## Context

What problem or constraint drove the decision?

## Decision

What we chose.

## Consequences

Positive, negative, and neutral outcomes.

## Alternatives considered

What we rejected and why.
```

---

## Index

| ADR                                                          | Title                                        | Status   |
| ------------------------------------------------------------ | -------------------------------------------- | -------- |
| [ADR-0001](./ADR-0001-postgresql-over-mongodb.md)            | PostgreSQL as primary database               | Accepted |
| [ADR-0002](./ADR-0002-prisma-over-typeorm.md)                | Prisma as ORM                                | Accepted |
| [ADR-0003](./ADR-0003-repository-pattern.md)                 | Repository pattern (frontend contract)       | Accepted |
| [ADR-0004](./ADR-0004-nestjs-framework.md)                   | NestJS as API framework                      | Accepted |
| [ADR-0005](./ADR-0005-uuid-v7-primary-keys.md)               | UUID v7 for primary keys                     | Accepted |
| [ADR-0006](./ADR-0006-postgresql-rls-tenancy.md)             | PostgreSQL RLS for tenant isolation          | Accepted |
| [ADR-0007](./ADR-0007-bullmq-job-queues.md)                  | BullMQ for async jobs                        | Accepted |
| [ADR-0008](./ADR-0008-redis-platform-cache.md)               | Redis for cache, sessions, queues            | Accepted |
| [ADR-0009](./ADR-0009-supabase-auth-only.md)                 | Supabase Auth only (not clinical data store) | Accepted |
| [ADR-0010](./ADR-0010-fhir-first-interchange.md)             | FHIR-first interchange architecture          | Accepted |
| [ADR-0011](./ADR-0011-react-query-repository-abstraction.md) | React Query + frozen repository layer        | Accepted |
| [ADR-0012](./ADR-0012-offline-first-queues.md)               | Offline-first client queues                  | Accepted |

---

## Lifecycle

1. **Proposed** — draft PR with ADR in `docs/adr/`
2. **Accepted** — merged after architect review (and security review if applicable)
3. **Superseded** — link to replacing ADR; do not delete history

Post-freeze structural changes **must** reference a new or updated ADR per [change control](../08.2-architecture-freeze-gate.md#post-freeze-change-control).

---

## Related documents

- [08.1 Backend Foundation](../08.1-backend-foundation-architecture.md)
- [08.2 Enterprise Data Model](../08.2-enterprise-data-model.md)
- [Implementation Backlog](../implementation-backlog.md)
