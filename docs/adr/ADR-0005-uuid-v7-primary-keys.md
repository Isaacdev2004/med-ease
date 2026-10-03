# ADR-0005: UUID v7 for Primary Keys

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect

## Context

Multi-tenant distributed system needs globally unique IDs without coordination. Frontend uses string UUIDs. B-tree index performance matters at millions of rows.

## Decision

Generate **UUID v7** (time-ordered) in application layer for primary keys. Use deterministic UUID v5 for seed data to match frontend mock IDs. Database default `gen_random_uuid()` (v4) allowed only in seeds/migrations fallback.

Human-readable codes (MRN, order numbers) live in separate unique columns—not as PKs.

## Consequences

**Positive:** Better insert locality than v4; safe merging across tenants; no sequence hotspots.  
**Negative:** Requires `@medease/uuid` helper; v7 library must be maintained.  
**Neutral:** FHIR logical ids map 1:1 to internal UUIDs.

## Alternatives considered

| Alternative   | Rejected because                                      |
| ------------- | ----------------------------------------------------- |
| Serial BIGINT | Tenant merge and distributed write conflicts          |
| UUID v4 only  | Random inserts fragment B-tree indexes                |
| ULID strings  | Less ecosystem tooling than UUID in PostgreSQL/Prisma |
