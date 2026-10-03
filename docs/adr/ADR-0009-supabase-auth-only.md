# ADR-0009: Supabase Auth Only

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Security

## Context

Frontend has `demo-auth-service.ts` and stub `supabase-auth-service.ts`. Platform needs OAuth2/OIDC, MFA, and SMART on FHIR readiness. Clinical PHI must stay in controlled PostgreSQL.

## Decision

Use **Supabase Auth** for identity provider only (credentials, OAuth, magic links). Store Med-ease user profiles, roles, and tenancy in **self-managed PostgreSQL** (`core.users`). Do not store clinical records in Supabase tables.

## Consequences

**Positive:** Fast auth implementation; OAuth/SMART ready; HIPAA boundary clear.  
**Negative:** Two systems to sync (supabase_auth_id link).  
**Neutral:** JWT issued by NestJS after Supabase validation.

## Alternatives considered

| Alternative           | Rejected because                                 |
| --------------------- | ------------------------------------------------ |
| Supabase for all data | Less control for HIPAA BAA and RLS customization |
| Auth0                 | Cost at scale; Supabase already in stack         |
| Custom auth only      | Slower MFA/OAuth/SMART delivery                  |
