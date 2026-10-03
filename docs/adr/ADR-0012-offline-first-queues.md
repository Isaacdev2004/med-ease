# ADR-0012: Offline-First Client Queues

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect

## Context

Many frontend modules implement `offline-sync.ts` — in-memory action queues flushed when online. Clinical workflows (dose logging, vitals, task completion) must survive connectivity loss.

## Decision

Preserve **offline-first queue pattern** on the frontend. Backend must support:

- Idempotent mutations (`Idempotency-Key` header)
- Optimistic concurrency (`version` column → 409 Conflict)
- Sync endpoints that accept batched queued actions where modules define them

Backend BullMQ handles server-side async; client offline queues remain a frontend concern with API contract support.

## Consequences

**Positive:** Rural/clinical reliability; aligns with existing module code.  
**Negative:** Server must handle duplicate submissions gracefully.  
**Neutral:** Conflict resolution UI stays on frontend.

## Alternatives considered

| Alternative            | Rejected because                          |
| ---------------------- | ----------------------------------------- |
| Online-only            | Unacceptable for bedside and field use    |
| Service Worker DB sync | Not yet implemented; queue pattern exists |
| Remove offline queues  | Breaks frozen frontend module design      |
