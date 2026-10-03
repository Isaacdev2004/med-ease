# ADR-0004: NestJS as API Framework

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Backend Lead

## Context

`artifacts/api-server` is an Express 5 health-check stub. Enterprise backend needs modular DI, guards, interceptors, queues, schedulers, and WebSockets.

## Decision

Adopt **NestJS 11** in `apps/api` as the primary API application. Supersede the Express stub after platform foundation is complete.

## Consequences

**Positive:** Enterprise patterns (guards, pipes, modules), BullMQ/WS integration, large ecosystem.  
**Negative:** Learning curve; more boilerplate than raw Express.  
**Neutral:** Express stub remains until NestJS cutover in Phase 08.10.

## Alternatives considered

| Alternative         | Rejected because                                  |
| ------------------- | ------------------------------------------------- |
| Extend Express stub | No DI/module system; does not scale to 29 domains |
| Fastify standalone  | Less opinionated structure for large teams        |
| tRPC                | Breaks OpenAPI/Orval frontend codegen             |
