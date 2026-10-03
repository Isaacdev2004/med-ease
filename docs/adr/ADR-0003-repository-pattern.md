# ADR-0003: Repository Pattern (Frontend Contract)

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect

## Context

Frontend Phases 03–07 established `service.ts → repository.ts → mock database` across 29 modules. Hooks, query keys, and types are frozen.

## Decision

Preserve the **repository abstraction** on the frontend. Replace in-memory `repository.ts` implementations with **HTTP adapters** calling NestJS. Backend NestJS modules implement the same method contracts documented in the [Repository Contract Matrix](../repository-contract-matrix.md).

Do not expose Prisma or internal entities directly to the frontend.

## Consequences

**Positive:** Zero frontend refactor; contract tests enforce parity; incremental module cutover.  
**Negative:** DTO mapping layer required (frontend types ↔ Prisma models).  
**Neutral:** OpenAPI becomes the wire contract between layers.

## Alternatives considered

| Alternative                      | Rejected because                           |
| -------------------------------- | ------------------------------------------ |
| GraphQL replacing repositories   | Breaks frozen React Query + Orval pipeline |
| Direct Prisma from frontend      | Security and coupling catastrophe          |
| Redesign domain model on backend | Scope creep; frontend types are canonical  |
