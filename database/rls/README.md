# PostgreSQL Row-Level Security Policies

Source-of-truth SQL for tenant isolation policies. Applied via Prisma migrations (`database/prisma/migrations/`).

## Session context

Application code sets per-transaction context via:

- `platform.set_request_context(...)` — authenticated tenant requests (E2-03)
- `platform.set_system_request_context()` — login, seed, migrations (E2-04)

Policies use `platform.tenant_matches(tenant_id)` or `platform.tenant_row_matches(id)` helpers.

## Policy layout

| Schema | Table | Isolation |
|--------|-------|-----------|
| `core` | `tenants` | `id = current_tenant_id()` |
| `core` | `organizations` | `tenant_id` |
| `identity` | `users` | `tenant_id` |
| `identity` | `user_sessions` | `tenant_id` |
| `identity` | `login_attempts` | system requests only |
| `audit` | `security_events` | `tenant_id` or system |
| `clinical` | `patients` | `tenant_id` |
| `clinical` | `patient_identifiers` | `tenant_id` |
| `clinical` | `patient_contacts` | `tenant_id` |
| `clinical` | `patient_addresses` | `tenant_id` |
| `clinical` | `patient_emergency_contacts` | `tenant_id` |
| `clinical` | `patient_allergies` | `tenant_id` |
| `clinical` | `patient_preferences` | `tenant_id` |

## Adding policies for new tables

1. Add a file under the schema folder (e.g. `clinical/patients.sql`).
2. Include it in the next migration.
3. Enable `FORCE ROW LEVEL SECURITY` so the application role cannot bypass policies.
