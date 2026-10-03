# ADR-0006: PostgreSQL RLS for Tenant Isolation

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Security

## Context

Multi-tenant healthcare platform: cross-tenant PHI leakage is catastrophic. Application-level filters alone are insufficient (bug = breach).

## Decision

Enforce **Row-Level Security (RLS)** on all tenant-scoped tables. Set session variables per request (`app.tenant_id`, `app.facility_id`, `app.user_id`) via NestJS middleware. Application queries still include tenant filters (defense in depth).

## Consequences

**Positive:** Database-enforced isolation; HIPAA audit confidence; catches application bugs.  
**Negative:** Prisma requires session setup per transaction; policy testing overhead.  
**Neutral:** Platform admins use explicit role bypass in policies.

## Alternatives considered

| Alternative              | Rejected because                      |
| ------------------------ | ------------------------------------- |
| Application-only scoping | Single missed WHERE clause leaks data |
| Separate DB per tenant   | Operational cost at 500+ tenants      |
| Schema-per-tenant        | Migration nightmare at scale          |
