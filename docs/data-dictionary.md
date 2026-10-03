# Data Dictionary

**Med-ease Enterprise Healthcare Platform**  
**Version:** 1.0 (Architecture Freeze)  
**Related:** [Canonical Entity Registry](./canonical-entity-registry.md) · [08.2 Enterprise Data Model](./08.2-enterprise-data-model.md)

Column definitions for every physical table. Types are PostgreSQL unless noted.

---

## Standard audit columns (all mutable business tables)

Applied to every table unless marked **append-only** or **catalog**.

| Column        | Type        | Nullable | Default | Constraints                | Description                                  |
| ------------- | ----------- | -------- | ------- | -------------------------- | -------------------------------------------- |
| `tenant_id`   | UUID        | NO       | —       | FK → `core.tenants(id)`    | Tenant isolation key                         |
| `facility_id` | UUID        | YES      | NULL    | FK → `core.facilities(id)` | Facility scope; NULL for tenant-wide records |
| `created_by`  | UUID        | NO       | —       | FK → `core.users(id)`      | User who created the row                     |
| `updated_by`  | UUID        | YES      | NULL    | FK → `core.users(id)`      | Last modifier                                |
| `created_at`  | TIMESTAMPTZ | NO       | `now()` | —                          | UTC creation timestamp                       |
| `updated_at`  | TIMESTAMPTZ | NO       | `now()` | —                          | UTC last update (trigger)                    |
| `deleted_at`  | TIMESTAMPTZ | YES      | NULL    | —                          | Soft delete; NULL = active                   |
| `version`     | INT         | NO       | `1`     | CHECK ≥ 1                  | Optimistic lock counter                      |

---

## Schema: `core`

### `core.tenants`

| Column              | Type              | Nullable | Default             | Constraints      | Description                                     |
| ------------------- | ----------------- | -------- | ------------------- | ---------------- | ----------------------------------------------- |
| `id`                | UUID              | NO       | `gen_random_uuid()` | PK               | Tenant identifier                               |
| `name`              | VARCHAR(255)      | NO       | —                   | —                | Display name                                    |
| `slug`              | VARCHAR(100)      | NO       | —                   | UNIQUE (partial) | URL-safe identifier                             |
| `status`            | tenant_status     | NO       | `active`            | ENUM             | active, suspended, provisioning, decommissioned |
| `region`            | VARCHAR(50)       | NO       | —                   | —                | Data residency region                           |
| `subscription_tier` | subscription_tier | NO       | `starter`           | ENUM             | starter, professional, enterprise               |
| `created_by`        | UUID              | NO       | —                   | FK → users       | Provisioning admin                              |
| `updated_by`        | UUID              | YES      | NULL                | FK → users       |                                                 |
| `created_at`        | TIMESTAMPTZ       | NO       | `now()`             | —                |                                                 |
| `updated_at`        | TIMESTAMPTZ       | NO       | `now()`             | —                |                                                 |
| `deleted_at`        | TIMESTAMPTZ       | YES      | NULL                | —                |                                                 |
| `version`           | INT               | NO       | `1`                 | —                |                                                 |

_Note: `tenant_id` on self = NULL or self-reference omitted (root entity)._

### `core.organizations`

| Column           | Type         | Nullable | Default | Constraints        | Description                                          |
| ---------------- | ------------ | -------- | ------- | ------------------ | ---------------------------------------------------- |
| `id`             | UUID         | NO       | —       | PK                 | Organization ID                                      |
| `tenant_id`      | UUID         | NO       | —       | FK → tenants       |                                                      |
| `name`           | VARCHAR(255) | NO       | —       | —                  |                                                      |
| `type`           | org_type     | NO       | —       | ENUM               | hospital_network, clinic_group, pharmacy_chain, etc. |
| `parent_id`      | UUID         | YES      | NULL    | FK → organizations | Hierarchy                                            |
| `facility_count` | INT          | NO       | `0`     | —                  | Denormalized count                                   |
| + audit columns  |              |          |         |                    |                                                      |

### `core.hospitals`

| Column          | Type         | Nullable | Default | Constraints             | Description   |
| --------------- | ------------ | -------- | ------- | ----------------------- | ------------- |
| `id`            | UUID         | NO       | —       | PK                      | hospitalId    |
| `tenant_id`     | UUID         | NO       | —       | FK → tenants            |               |
| `name`          | VARCHAR(255) | NO       | —       | —                       |               |
| `code`          | VARCHAR(50)  | NO       | —       | UNIQUE(tenant_id, code) | Hospital code |
| `bed_capacity`  | INT          | NO       | `0`     | —                       |               |
| + audit columns |              |          |         |                         |               |

### `core.facilities`

| Column             | Type            | Nullable | Default  | Constraints        | Description                                         |
| ------------------ | --------------- | -------- | -------- | ------------------ | --------------------------------------------------- |
| `id`               | UUID            | NO       | —        | PK                 | facilityId                                          |
| `tenant_id`        | UUID            | NO       | —        | FK → tenants       |                                                     |
| `organization_id`  | UUID            | YES      | NULL     | FK → organizations |                                                     |
| `hospital_id`      | UUID            | YES      | NULL     | FK → hospitals     |                                                     |
| `name`             | VARCHAR(255)    | NO       | —        | —                  |                                                     |
| `code`             | VARCHAR(50)     | YES      | NULL     | —                  |                                                     |
| `facility_type`    | facility_type   | NO       | —        | ENUM               | hospital, clinic, pharmacy, lab, imaging, transport |
| `timezone`         | VARCHAR(50)     | NO       | `UTC`    | —                  | IANA timezone                                       |
| `locale`           | VARCHAR(10)     | NO       | `fr-FR`  | —                  |                                                     |
| `enabled_modules`  | JSONB           | NO       | `'[]'`   | —                  | Module flags array                                  |
| `address`          | JSONB           | YES      | NULL     | —                  | Structured address                                  |
| `status`           | facility_status | NO       | `active` | ENUM               |                                                     |
| `fhir_identifiers` | JSONB           | NO       | `'[]'`   | —                  | FHIR Identifier[]                                   |
| + audit columns    |                 |          |          |                    |                                                     |

### `core.departments`

| Column             | Type         | Nullable | Default | Constraints               | Description  |
| ------------------ | ------------ | -------- | ------- | ------------------------- | ------------ |
| `id`               | UUID         | NO       | —       | PK                        | departmentId |
| `tenant_id`        | UUID         | NO       | —       | FK                        |              |
| `facility_id`      | UUID         | NO       | —       | FK → facilities           |              |
| `name`             | VARCHAR(255) | NO       | —       | —                         |              |
| `code`             | VARCHAR(50)  | YES      | NULL    | —                         |              |
| `specialty`        | VARCHAR(100) | YES      | NULL    | —                         |              |
| `head_employee_id` | UUID         | YES      | NULL    | FK → operations.employees |              |
| + audit columns    |              |          |         |                           |              |

### `core.users`

| Column             | Type         | Nullable | Default   | Constraints                      | Description                       |
| ------------------ | ------------ | -------- | --------- | -------------------------------- | --------------------------------- |
| `id`               | UUID         | NO       | —         | PK                               | userId                            |
| `tenant_id`        | UUID         | NO       | —         | FK → tenants                     |                                   |
| `organization_id`  | UUID         | NO       | —         | FK → organizations               |                                   |
| `facility_id`      | UUID         | YES      | NULL      | FK → facilities                  | Primary facility                  |
| `supabase_auth_id` | UUID         | YES      | NULL      | UNIQUE                           | Supabase auth.users link          |
| `email`            | VARCHAR(255) | NO       | —         | UNIQUE(tenant_id, email) partial |                                   |
| `display_name`     | VARCHAR(255) | NO       | —         | —                                |                                   |
| `status`           | user_status  | NO       | `pending` | ENUM                             | active, inactive, locked, pending |
| `mfa_enabled`      | BOOLEAN      | NO       | `false`   | —                                |                                   |
| `last_login_at`    | TIMESTAMPTZ  | YES      | NULL      | —                                |                                   |
| + audit columns    |              |          |           |                                  |                                   |

### `core.patients`

| Column                | Type         | Nullable | Default | Constraints            | Description                   |
| --------------------- | ------------ | -------- | ------- | ---------------------- | ----------------------------- |
| `id`                  | UUID         | NO       | —       | PK                     | Patient ID / demographics.id  |
| `tenant_id`           | UUID         | NO       | —       | FK                     |                               |
| `user_id`             | UUID         | YES      | NULL    | FK → users             | Patient portal account        |
| `mrn`                 | VARCHAR(50)  | NO       | —       | UNIQUE(tenant_id, mrn) | Medical record number         |
| `national_id`         | BYTEA        | YES      | NULL    | —                      | Encrypted national ID         |
| `full_name`           | VARCHAR(255) | NO       | —       | —                      |                               |
| `date_of_birth`       | DATE         | NO       | —       | —                      |                               |
| `gender`              | gender       | YES      | NULL    | ENUM                   |                               |
| `phone`               | VARCHAR(30)  | YES      | NULL    | —                      |                               |
| `email`               | VARCHAR(255) | YES      | NULL    | —                      |                               |
| `address`             | JSONB        | YES      | NULL    | —                      |                               |
| `emergency_contact`   | JSONB        | YES      | NULL    | —                      |                               |
| `primary_facility_id` | UUID         | YES      | NULL    | FK → facilities        |                               |
| `primary_provider_id` | UUID         | YES      | NULL    | FK → providers         |                               |
| `fhir_identifiers`    | JSONB        | NO       | `'[]'`  | —                      | FHIR Patient identifiers      |
| `fhir_resource_id`    | UUID         | NO       | —       | —                      | Stable FHIR logical id (= id) |
| + audit columns       |              |          |         |                        |                               |

### `core.providers`

| Column           | Type         | Nullable | Default | Constraints               | Description             |
| ---------------- | ------------ | -------- | ------- | ------------------------- | ----------------------- |
| `id`             | UUID         | NO       | —       | PK                        | providerId              |
| `tenant_id`      | UUID         | NO       | —       | FK                        |                         |
| `user_id`        | UUID         | YES      | NULL    | FK → users                |                         |
| `employee_id`    | UUID         | YES      | NULL    | FK → operations.employees |                         |
| `display_name`   | VARCHAR(255) | NO       | —       | —                         |                         |
| `specialty`      | VARCHAR(100) | YES      | NULL    | —                         |                         |
| `license_number` | VARCHAR(50)  | YES      | NULL    | —                         |                         |
| `npi`            | VARCHAR(20)  | YES      | NULL    | —                         | US NPI; nullable for FR |
| `facility_ids`   | UUID[]       | NO       | `'{}'`  | —                         | Affiliated facilities   |
| + audit columns  |              |          |         |                           |                         |

### `core.permissions`

| Column        | Type         | Nullable | Default | Constraints | Description                      |
| ------------- | ------------ | -------- | ------- | ----------- | -------------------------------- |
| `id`          | UUID         | NO       | —       | PK          |                                  |
| `name`        | VARCHAR(100) | NO       | —       | UNIQUE      | Exact frontend permission string |
| `module`      | VARCHAR(50)  | NO       | —       | —           | Module grouping                  |
| `description` | TEXT         | YES      | NULL    | —           |                                  |
| `created_at`  | TIMESTAMPTZ  | NO       | `now()` | —           | Catalog — no soft delete         |

### `core.roles` / `core.role_permissions` / `core.user_roles`

See [08.2 § Shared Kernel](./08.2-enterprise-data-model.md#32-shared-kernel-table-definitions). Junction tables use composite PKs `(role_id, permission_id)` and `(user_id, role_id, facility_id)`.

---

## Schema: `clinical` (key tables)

### `clinical.appointments`

| Column             | Type               | Nullable | Default     | Constraints     | Description                 |
| ------------------ | ------------------ | -------- | ----------- | --------------- | --------------------------- |
| `id`               | UUID               | NO       | —           | PK              |                             |
| `tenant_id`        | UUID               | NO       | —           | FK              |                             |
| `facility_id`      | UUID               | NO       | —           | FK → facilities |                             |
| `patient_id`       | UUID               | NO       | —           | FK → patients   |                             |
| `provider_id`      | UUID               | NO       | —           | FK → providers  |                             |
| `scheduled_at`     | TIMESTAMPTZ        | NO       | —           | —               |                             |
| `duration_minutes` | INT                | NO       | `30`        | —               |                             |
| `status`           | appointment_status | NO       | `scheduled` | ENUM            |                             |
| `visit_type`       | VARCHAR(50)        | NO       | —           | —               | in_person, telehealth, etc. |
| `referral_id`      | UUID               | YES      | NULL        | —               |                             |
| `telehealth_link`  | TEXT               | YES      | NULL        | —               |                             |
| `notes`            | TEXT               | YES      | NULL        | —               |                             |
| `fhir_resource_id` | UUID               | NO       | —           | —               | FHIR Appointment id         |
| + audit columns    |                    |          |             |                 |                             |

**Indexes:** `(facility_id, scheduled_at)`, `(provider_id, scheduled_at)`, `(patient_id, scheduled_at DESC)`

### `clinical.prescriptions`

| Column                     | Type                | Nullable | Default  | Constraints             | Description       |
| -------------------------- | ------------------- | -------- | -------- | ----------------------- | ----------------- |
| `id`                       | UUID                | NO       | —        | PK                      |                   |
| `tenant_id`                | UUID                | NO       | —        | FK                      |                   |
| `facility_id`              | UUID                | YES      | NULL     | FK                      |                   |
| `patient_id`               | UUID                | NO       | —        | FK → patients           |                   |
| `prescribing_physician_id` | UUID                | NO       | —        | FK → providers          |                   |
| `dispensing_pharmacy_id`   | UUID                | YES      | NULL     | FK → facilities         |                   |
| `care_plan_id`             | UUID                | YES      | NULL     | FK → care_plans         |                   |
| `appointment_id`           | UUID                | YES      | NULL     | FK → appointments       |                   |
| `medication_catalog_id`    | UUID                | YES      | NULL     | FK → medication_catalog |                   |
| `status`                   | prescription_status | NO       | `active` | ENUM                    |                   |
| `dosage_instructions`      | TEXT                | NO       | —        | —                       |                   |
| `quantity`                 | INT                 | YES      | NULL     | —                       |                   |
| `refills_remaining`        | INT                 | NO       | `0`      | —                       |                   |
| `fhir_resource_id`         | UUID                | NO       | —        | —                       | MedicationRequest |
| + audit columns            |                     |          |          |                         |                   |

### `clinical.lab_orders`

| Column                  | Type             | Nullable | Default   | Constraints     | Description               |
| ----------------------- | ---------------- | -------- | --------- | --------------- | ------------------------- |
| `id`                    | UUID             | NO       | —         | PK              |                           |
| `tenant_id`             | UUID             | NO       | —         | FK              |                           |
| `facility_id`           | UUID             | NO       | —         | FK              |                           |
| `patient_id`            | UUID             | NO       | —         | FK              |                           |
| `ordering_physician_id` | UUID             | NO       | —         | FK → providers  |                           |
| `laboratory_id`         | UUID             | YES      | NULL      | FK → facilities |                           |
| `care_plan_id`          | UUID             | YES      | NULL      | FK              |                           |
| `appointment_id`        | UUID             | YES      | NULL      | FK              |                           |
| `status`                | lab_order_status | NO       | `ordered` | ENUM            |                           |
| `priority`              | VARCHAR(20)      | NO       | `routine` | —               |                           |
| `test_ids`              | UUID[]           | NO       | `'{}'`    | —               | lab_test_definitions refs |
| `ordered_at`            | TIMESTAMPTZ      | NO       | `now()`   | —               |                           |
| + audit columns         |                  |          |           |                 |                           |

### `clinical.observations` (partitioned)

| Column             | Type               | Nullable | Default | Constraints                     | Description            |
| ------------------ | ------------------ | -------- | ------- | ------------------------------- | ---------------------- |
| `id`               | UUID               | NO       | —       | PK (composite with recorded_at) |                        |
| `tenant_id`        | UUID               | NO       | —       | FK                              |                        |
| `facility_id`      | UUID               | YES      | NULL    | FK                              |                        |
| `patient_id`       | UUID               | NO       | —       | FK                              |                        |
| `device_id`        | UUID               | YES      | NULL    | FK → monitoring_devices         |                        |
| `care_plan_id`     | UUID               | YES      | NULL    | FK                              |                        |
| `code`             | VARCHAR(50)        | NO       | —       | —                               | LOINC or internal code |
| `value_quantity`   | NUMERIC(19,4)      | YES      | NULL    | —                               |                        |
| `value_unit`       | VARCHAR(30)        | YES      | NULL    | —                               |                        |
| `value_string`     | TEXT               | YES      | NULL    | —                               |                        |
| `status`           | observation_status | NO       | `final` | ENUM                            |                        |
| `recorded_at`      | TIMESTAMPTZ        | NO       | —       | PARTITION KEY                   |                        |
| `recorded_by`      | UUID               | YES      | NULL    | FK → users                      |                        |
| `fhir_resource_id` | UUID               | NO       | —       | —                               |                        |

_Append-only — no soft delete, no version column._

---

## Schema: `financial` (key tables)

### `financial.patient_invoices`

| Column                | Type           | Nullable | Default | Constraints             | Description |
| --------------------- | -------------- | -------- | ------- | ----------------------- | ----------- |
| `id`                  | UUID           | NO       | —       | PK                      | invoiceId   |
| `tenant_id`           | UUID           | NO       | —       | FK                      |             |
| `facility_id`         | UUID           | NO       | —       | FK                      |             |
| `patient_id`          | UUID           | NO       | —       | FK                      |             |
| `provider_id`         | UUID           | YES      | NULL    | FK                      |             |
| `appointment_id`      | UUID           | YES      | NULL    | FK                      |             |
| `encounter_id`        | UUID           | YES      | NULL    | FK → encounters         |             |
| `insurance_policy_id` | UUID           | YES      | NULL    | FK → insurance_policies |             |
| `status`              | invoice_status | NO       | `draft` | ENUM                    |             |
| `total_amount_cents`  | BIGINT         | NO       | `0`     | —                       |             |
| `currency_code`       | CHAR(3)        | NO       | `EUR`   | —                       |             |
| `issued_at`           | TIMESTAMPTZ    | YES      | NULL    | —                       |             |
| `due_at`              | TIMESTAMPTZ    | YES      | NULL    | —                       |             |
| + audit columns       |                |          |         |                         |             |

### `financial.invoice_line_items`

| Column             | Type          | Nullable | Default | Constraints                   | Description                        |
| ------------------ | ------------- | -------- | ------- | ----------------------------- | ---------------------------------- |
| `id`               | UUID          | NO       | —       | PK                            |                                    |
| `invoice_id`       | UUID          | NO       | —       | FK → patient_invoices CASCADE |                                    |
| `category`         | VARCHAR(50)   | NO       | —       | —                             | consultation, lab, radiology, etc. |
| `description`      | TEXT          | NO       | —       | —                             |                                    |
| `quantity`         | NUMERIC(10,2) | NO       | `1`     | —                             |                                    |
| `unit_price_cents` | BIGINT        | NO       | —       | —                             |                                    |
| `amount_cents`     | BIGINT        | NO       | —       | —                             |                                    |
| `created_at`       | TIMESTAMPTZ   | NO       | `now()` | —                             |                                    |

---

## Schema: `platform` (key tables)

### `platform.documents`

| Column                | Type            | Nullable | Default | Constraints           | Description      |
| --------------------- | --------------- | -------- | ------- | --------------------- | ---------------- |
| `id`                  | UUID            | NO       | —       | PK                    | documentId       |
| `tenant_id`           | UUID            | NO       | —       | FK                    |                  |
| `facility_id`         | UUID            | YES      | NULL    | FK                    |                  |
| `patient_id`          | UUID            | YES      | NULL    | FK → patients         |                  |
| `folder_id`           | UUID            | YES      | NULL    | FK → document_folders |                  |
| `title`               | VARCHAR(500)    | NO       | —       | —                     |                  |
| `module`              | VARCHAR(50)     | NO       | —       | —                     | Source module    |
| `mime_type`           | VARCHAR(100)    | NO       | —       | —                     |                  |
| `storage_key`         | VARCHAR(500)    | NO       | —       | —                     | MinIO object key |
| `size_bytes`          | BIGINT          | NO       | `0`     | —                     |                  |
| `status`              | document_status | NO       | `draft` | ENUM                  |                  |
| `retention_policy_id` | UUID            | YES      | NULL    | FK                    |                  |
| + audit columns       |                 |          |         |                       |                  |

### `platform.workflow_instances`

| Column          | Type                     | Nullable | Default   | Constraints               | Description        |
| --------------- | ------------------------ | -------- | --------- | ------------------------- | ------------------ |
| `id`            | UUID                     | NO       | —         | PK                        | instanceId         |
| `tenant_id`     | UUID                     | NO       | —         | FK                        |                    |
| `facility_id`   | UUID                     | YES      | NULL      | FK                        |                    |
| `workflow_id`   | UUID                     | NO       | —         | FK → workflow_definitions |                    |
| `module`        | VARCHAR(50)              | NO       | —         | —                         |                    |
| `status`        | workflow_instance_status | NO       | `running` | ENUM                      |                    |
| `started_by`    | UUID                     | NO       | —         | FK → users                |                    |
| `sla_status`    | VARCHAR(20)              | YES      | NULL      | —                         |                    |
| `context`       | JSONB                    | NO       | `'{}'`    | —                         | Workflow variables |
| + audit columns |                          |          |           |                           |                    |

---

## Schema: `audit` (append-only)

### `audit.audit_logs` (partitioned monthly)

| Column          | Type         | Nullable | Default | Constraints          | Description                                       |
| --------------- | ------------ | -------- | ------- | -------------------- | ------------------------------------------------- |
| `id`            | UUID         | NO       | —       | PK (with created_at) |                                                   |
| `tenant_id`     | UUID         | YES      | NULL    | —                    | NULL for platform events                          |
| `facility_id`   | UUID         | YES      | NULL    | —                    |                                                   |
| `actor_id`      | UUID         | NO       | —       | —                    | User who performed action                         |
| `action`        | audit_action | NO       | —       | ENUM                 | CREATE, READ, UPDATE, DELETE, EXPORT, BREAK_GLASS |
| `resource_type` | VARCHAR(50)  | NO       | —       | —                    | Table/entity name                                 |
| `resource_id`   | UUID         | YES      | NULL    | —                    |                                                   |
| `patient_id`    | UUID         | YES      | NULL    | —                    | Required for PHI access                           |
| `ip_address`    | INET         | YES      | NULL    | —                    |                                                   |
| `user_agent`    | TEXT         | YES      | NULL    | —                    |                                                   |
| `request_id`    | UUID         | YES      | NULL    | —                    | Correlation/trace ID                              |
| `metadata`      | JSONB        | NO       | `'{}'`  | —                    | Changed fields; no PHI values                     |
| `created_at`    | TIMESTAMPTZ  | NO       | `now()` | PARTITION KEY        | Immutable                                         |

---

## Remaining tables

All other tables in [Canonical Entity Registry](./canonical-entity-registry.md) follow these rules:

1. Include standard audit columns (unless append-only/catalog)
2. Include `tenant_id`; include `facility_id` when frontend type has `facilityId`
3. FK columns named `{entity}_id` referencing Shared Kernel or same-schema parent
4. Status fields as PostgreSQL ENUM matching frontend string unions
5. Money as `*_amount_cents BIGINT`
6. FHIR-ready tables include `fhir_resource_id UUID` and `fhir_identifiers JSONB`

### Column inference from frontend types

| Frontend field pattern            | DB column                     |
| --------------------------------- | ----------------------------- |
| `patientId: string`               | `patient_id UUID NOT NULL FK` |
| `scheduledAt: string`             | `scheduled_at TIMESTAMPTZ`    |
| `status: 'active' \| 'cancelled'` | `status` ENUM                 |
| `amount: number`                  | `amount_cents BIGINT`         |
| `metadata?: Record<...>`          | `metadata JSONB`              |
| `tags: string[]`                  | `tags TEXT[]`                 |

---

## Enum catalog (PostgreSQL types)

| Enum name                  | Values (from frontend)                                                       |
| -------------------------- | ---------------------------------------------------------------------------- |
| `tenant_status`            | active, suspended, provisioning, decommissioned                              |
| `user_status`              | active, inactive, locked, pending                                            |
| `facility_type`            | hospital, clinic, pharmacy, laboratory, imaging, transport, nursing_home     |
| `appointment_status`       | scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show |
| `prescription_status`      | active, completed, cancelled, on_hold                                        |
| `lab_order_status`         | ordered, collected, in_progress, completed, cancelled                        |
| `invoice_status`           | draft, issued, paid, overdue, cancelled                                      |
| `claim_status`             | draft, submitted, accepted, rejected, paid                                   |
| `workflow_instance_status` | running, paused, completed, cancelled, failed                                |
| `document_status`          | draft, published, archived, under_review                                     |
| `audit_action`             | CREATE, READ, UPDATE, DELETE, EXPORT, BREAK_GLASS, LOGIN, LOGOUT             |

_Full enum list generated during Prisma schema implementation from all `types.ts` string unions._

---

## Maintenance

- Update this dictionary when adding columns (post-freeze: additive only)
- Cross-reference entity registry for new tables
- Version header increments on approved schema changes

_For complete per-table columns of all 221 entities, run generated docs from Prisma schema post-08.2 implementation (`pnpm run docs:db`). This document defines conventions + full Shared Kernel + pattern for all bounded contexts._
