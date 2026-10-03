# ADR-0007: BullMQ for Job Queues

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Backend Lead

## Context

Platform needs async work: notifications, search indexing, HL7/FHIR integration, reports, outbox delivery, retries, and dead-letter queues.

## Decision

Use **BullMQ** with Redis backend. Run workers in `apps/worker` (separate process). Implement transactional outbox pattern for domain events.

## Consequences

**Positive:** NestJS integration, retries, DLQ, priority queues, observability hooks.  
**Negative:** Redis becomes hard dependency.  
**Neutral:** Queue names standardized per module (see 08.1 event architecture).

## Alternatives considered

| Alternative              | Rejected because                             |
| ------------------------ | -------------------------------------------- |
| AWS SQS                  | Cloud lock-in; local dev friction            |
| RabbitMQ                 | Extra infrastructure; Redis already required |
| PostgreSQL LISTEN/NOTIFY | No retry/DLQ semantics at scale              |
