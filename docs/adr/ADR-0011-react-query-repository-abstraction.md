# ADR-0011: React Query Repository Abstraction

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect

## Context

Frontend uses React Query with centralized query keys (`services/api/query-keys.ts`), feature hooks, and service facades. Orval generates client from OpenAPI.

## Decision

Keep **React Query + service.ts + repository.ts** unchanged. Backend rollout swaps repository internals to HTTP only. Query keys and hook signatures remain frozen.

OpenAPI spec drives Orval codegen; contract tests verify response shapes match frontend `types.ts`.

## Consequences

**Positive:** Incremental backend migration portal-by-portal; cache invalidation unchanged.  
**Negative:** Two sources of truth until adapter swap complete (mock vs API).  
**Neutral:** Feature flags can gate API vs mock per module during cutover.

## Alternatives considered

| Alternative                | Rejected because                    |
| -------------------------- | ----------------------------------- |
| Replace React Query        | Rewrites entire frontend data layer |
| Direct fetch in components | Breaks established architecture     |
| GraphQL client             | No OpenAPI/Orval investment         |
