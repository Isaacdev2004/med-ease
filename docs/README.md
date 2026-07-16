# Backend Documentation Index

**Med-ease Enterprise Healthcare Platform**

---

```
✅ ENTERPRISE ARCHITECTURE COMPLETE
✅ BACKEND FOUNDATION APPROVED — 2026-07-15

====================================
 IMPLEMENTATION PHASE — 08.3 ACTIVE
====================================
```

**Live status:** [PROJECT-STATUS.md](./PROJECT-STATUS.md)  
**Engineering backlog:** [implementation-backlog.md](./implementation-backlog.md)  
**Progress tracker:** [api-coverage-matrix.md](./api-coverage-matrix.md)  

---

## Frozen architecture (reference only — do not expand)

| Document | Purpose |
|----------|---------|
| [08.1 Backend Foundation](./08.1-backend-foundation-architecture.md) | NestJS, infra, security, events, API standards |
| [08.2 Enterprise Data Model](./08.2-enterprise-data-model.md) | Schemas, ERDs, tenancy, partitioning |
| [Architecture Freeze Gate](./08.2-architecture-freeze-gate.md) | ✅ Approved baseline |
| [Canonical Entity Registry](./canonical-entity-registry.md) | 221 entities |
| [Data Dictionary](./data-dictionary.md) | Column definitions |
| [Repository Contract Matrix](./repository-contract-matrix.md) | Frontend → backend mapping |

## Governance (living)

| Document | Purpose |
|----------|---------|
| [Module Certification Checklist](./module-certification-checklist.md) | P1–P8 merge gate for every domain module |
| [Backend Definition of Done](./backend-definition-of-done.md) | Detailed engineering completion criteria |
| [Reference Module — IAM](./reference-module-iam.md) | Platform/security reference implementation |
| [Reference Module — Patients](./reference-module-patients.md) | Clinical reference implementation |
| [ADR Index](./adr/README.md) | Architectural decisions ADR-0001–0012 |
| [Implementation Backlog](./implementation-backlog.md) | Epics 1–8, sprint stories |
| [API Coverage Matrix](./api-coverage-matrix.md) | Per-module implementation status |

## Core principle

> Frontend types are canonical. The backend conforms to the frontend contract — not the reverse.

## Implementation rule

**No new architecture documents** unless implementation discovers a genuine gap → write an ADR, update affected registry/matrix only.

Success = implemented modules, passing tests, deployed services.
