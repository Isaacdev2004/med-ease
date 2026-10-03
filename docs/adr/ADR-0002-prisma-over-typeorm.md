# ADR-0002: Prisma as ORM

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Backend Lead

## Context

The monorepo had an empty Drizzle template in `lib/db`. Backend needs typed migrations, multi-schema support, and team velocity for ~340 tables.

## Decision

Use **Prisma ORM** with multi-file schema under `database/prisma/schemas/`. Deprecate Drizzle for backend persistence.

## Consequences

**Positive:** Migration tooling, generated types, multi-schema preview, strong TypeScript DX.  
**Negative:** Raw SQL/partitioning requires `$executeRaw`; RLS policies maintained as SQL files.  
**Neutral:** Team must learn Prisma middleware for tenant scoping and soft deletes.

## Alternatives considered

| Alternative  | Rejected because                                             |
| ------------ | ------------------------------------------------------------ |
| TypeORM      | Decorator-heavy; migration drift issues at scale             |
| Drizzle      | Already stubbed but less migration maturity for large schema |
| Raw SQL only | Unmaintainable for 340 tables                                |
