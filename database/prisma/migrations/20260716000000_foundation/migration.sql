-- Med-Ease foundation migration (E1-03)
-- Schemas, extensions, enums, RLS helpers, platform seed registry.
-- No IAM / domain business tables.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostgreSQL schemas (E1-03 bounded contexts)
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS clinical;
CREATE SCHEMA IF NOT EXISTS operations;
CREATE SCHEMA IF NOT EXISTS intelligence;
CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;

COMMENT ON SCHEMA core IS 'Shared kernel: tenancy, patients, providers, facilities';
COMMENT ON SCHEMA identity IS 'IAM: users, roles, sessions (Epic 2)';
COMMENT ON SCHEMA clinical IS 'Clinical care bounded context';
COMMENT ON SCHEMA operations IS 'Hospital operations bounded context';
COMMENT ON SCHEMA intelligence IS 'Analytics and AI bounded context';
COMMENT ON SCHEMA platform IS 'Platform services: documents, workflows, messaging';
COMMENT ON SCHEMA audit IS 'Append-only audit and security events';
COMMENT ON SCHEMA integration IS 'FHIR, HL7, interoperability adapters';

-- ─── RLS request-context helpers (Document 08.2 §8.2) ───────────────────────

CREATE OR REPLACE FUNCTION platform.set_request_context(
  p_tenant_id UUID,
  p_facility_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_role TEXT DEFAULT NULL,
  p_break_glass_patient_id UUID DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('app.tenant_id', COALESCE(p_tenant_id::text, ''), true);
  PERFORM set_config('app.facility_id', COALESCE(p_facility_id::text, ''), true);
  PERFORM set_config('app.user_id', COALESCE(p_user_id::text, ''), true);
  PERFORM set_config('app.role', COALESCE(p_role, ''), true);
  PERFORM set_config(
    'app.break_glass_patient_id',
    COALESCE(p_break_glass_patient_id::text, ''),
    true
  );
END;
$$;

CREATE OR REPLACE FUNCTION platform.clear_request_context()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('app.tenant_id', '', true);
  PERFORM set_config('app.facility_id', '', true);
  PERFORM set_config('app.user_id', '', true);
  PERFORM set_config('app.role', '', true);
  PERFORM set_config('app.break_glass_patient_id', '', true);
END;
$$;

CREATE OR REPLACE FUNCTION platform.current_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.tenant_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION platform.current_facility_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('app.facility_id', true), '')::uuid;
$$;

CREATE OR REPLACE FUNCTION platform.is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('app.role', true) = 'platform_admin';
$$;

-- ─── Enums (managed by Prisma — created below via Prisma migrate) ───────────
-- Prisma will emit CREATE TYPE statements for enums defined in enums.prisma.

-- CreateEnum
CREATE TYPE "core"."tenant_status" AS ENUM ('active', 'suspended', 'provisioning', 'decommissioned');
CREATE TYPE "core"."subscription_tier" AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE "identity"."user_status" AS ENUM ('active', 'inactive', 'locked', 'pending');
CREATE TYPE "core"."facility_type" AS ENUM ('hospital', 'clinic', 'pharmacy', 'lab', 'imaging', 'transport');
CREATE TYPE "core"."facility_status" AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE "core"."gender" AS ENUM ('male', 'female', 'other', 'unknown');
CREATE TYPE "clinical"."appointment_status" AS ENUM ('scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE "clinical"."prescription_status" AS ENUM ('active', 'completed', 'cancelled', 'on_hold');
CREATE TYPE "operations"."invoice_status" AS ENUM ('draft', 'issued', 'paid', 'overdue', 'cancelled');
CREATE TYPE "operations"."claim_status" AS ENUM ('draft', 'submitted', 'accepted', 'rejected', 'paid');
CREATE TYPE "platform"."workflow_status" AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE "platform"."document_status" AS ENUM ('draft', 'published', 'archived', 'under_review');
CREATE TYPE "audit"."audit_action" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'BREAK_GLASS');
CREATE TYPE "platform"."entity_type" AS ENUM ('patient', 'appointment', 'encounter', 'prescription', 'lab_order', 'radiology_study', 'care_plan', 'invoice', 'document', 'workflow_instance', 'employee', 'purchase_order');

-- CreateTable
CREATE TABLE "platform"."seed_runs" (
    "id" UUID NOT NULL,
    "batch_name" VARCHAR(120) NOT NULL,
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checksum" VARCHAR(64),

    CONSTRAINT "seed_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seed_runs_batch_name_idx" ON "platform"."seed_runs"("batch_name");
