# ADR-0010: FHIR-First Interchange Architecture

**Status:** Accepted  
**Date:** 2026-07-15  
**Deciders:** Principal Architect, Interoperability

## Context

Healthcare platform must integrate with EHRs, labs, payers, and SMART apps. Internal schema optimized for Med-ease UX; external world speaks FHIR R4/R4B.

## Decision

**FHIR-first at boundaries, normalized storage internally.**

- Map entities to FHIR resources at API/integration layer (see [Canonical Entity Registry](../canonical-entity-registry.md))
- Store `fhir_resource_id` and `fhir_identifiers` on clinical entities
- FHIR gateway module in Phase 08.8 — not primary storage format

## Consequences

**Positive:** Standards compliance; SMART on FHIR path; partner integration clarity.  
**Negative:** Mapping layer maintenance; not all UI fields have FHIR equivalents.  
**Neutral:** HL7 v2 and DICOMweb remain separate adapters.

## Alternatives considered

| Alternative          | Rejected because                                   |
| -------------------- | -------------------------------------------------- |
| FHIR as only storage | Poor query performance; awkward billing/ops models |
| Proprietary API only | Blocks hospital integrations and certification     |
| C-CDA only           | Insufficient for modern app ecosystem              |
