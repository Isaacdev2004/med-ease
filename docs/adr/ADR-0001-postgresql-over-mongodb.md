# ADR-0001: PostgreSQL as Primary Database

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Backend Lead

## Context

Med-ease requires ACID transactions, relational integrity across 221+ entities, multi-tenant isolation, audit trails, and HIPAA-grade compliance. Clinical, billing, and IAM data have complex FK relationships derived from frozen frontend types.

## Decision

Use **PostgreSQL 16** as the sole primary transactional database. Organize tables into PostgreSQL schemas by bounded context (`core`, `clinical`, `operations`, etc.).

## Consequences

**Positive:** Mature RLS, JSONB, partitioning, strong consistency, excellent Prisma support, healthcare industry standard.  
**Negative:** Horizontal write scaling requires read replicas / sharding strategy later.  
**Neutral:** Requires DBA discipline for migrations and index management.

## Alternatives considered

| Alternative            | Rejected because                                                              |
| ---------------------- | ----------------------------------------------------------------------------- |
| MongoDB                | Weak relational integrity for billing/clinical FKs; harder RLS/audit patterns |
| MySQL                  | Adequate but weaker JSON/partitioning/RLS story vs PostgreSQL                 |
| Supabase Postgres only | Clinical data must remain self-managed for HIPAA control (see ADR-0009)       |
