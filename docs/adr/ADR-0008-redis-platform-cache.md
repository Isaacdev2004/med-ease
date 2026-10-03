# ADR-0008: Redis for Cache, Sessions, and Queues

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect

## Context

Platform needs sub-millisecond cache, JWT refresh token/session storage, rate limiting counters, and BullMQ backend.

## Decision

Deploy **Redis 7** as shared infrastructure for: L2 cache, session store, rate limits, BullMQ, and optional WebSocket pub/sub adapter.

## Consequences

**Positive:** Single ops component; proven at healthcare scale; BullMQ co-location.  
**Negative:** Memory planning; persistence config for session durability.  
**Neutral:** Cache invalidation via domain events.

## Alternatives considered

| Alternative       | Rejected because                         |
| ----------------- | ---------------------------------------- |
| In-memory only    | Breaks multi-instance API deployments    |
| Memcached         | No queue structures; limited data types  |
| Database sessions | Load on PostgreSQL for high auth traffic |
