-- E3-05: Clinical admissions / transfers
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/admissions.sql

CREATE TYPE "clinical"."admission_status" AS ENUM (
  'requested',
  'triaged',
  'bed_assigned',
  'admitted',
  'cancelled',
  'discharged'
);

CREATE TYPE "clinical"."admission_priority" AS ENUM (
  'routine',
  'urgent',
  'emergency'
);

CREATE TYPE "clinical"."transfer_status" AS ENUM (
  'requested',
  'approved',
  'in_transit',
  'completed',
  'cancelled'
);

CREATE TABLE "clinical"."admissions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "patient_mrn" TEXT NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "bed_id" UUID,
    "bed_label" TEXT,
    "status" "clinical"."admission_status" NOT NULL DEFAULT 'requested',
    "priority" "clinical"."admission_priority" NOT NULL DEFAULT 'routine',
    "reason" TEXT,
    "requested_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triaged_at" TIMESTAMPTZ(3),
    "admitted_at" TIMESTAMPTZ(3),
    "discharged_at" TIMESTAMPTZ(3),
    "cancelled_at" TIMESTAMPTZ(3),
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "admissions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "admissions_tenant_id_facility_id_status_idx"
  ON "clinical"."admissions"("tenant_id", "facility_id", "status");
CREATE INDEX "admissions_tenant_id_patient_id_status_idx"
  ON "clinical"."admissions"("tenant_id", "patient_id", "status");
CREATE INDEX "admissions_tenant_id_status_requested_at_idx"
  ON "clinical"."admissions"("tenant_id", "status", "requested_at" DESC);

ALTER TABLE "clinical"."admissions"
  ADD CONSTRAINT "admissions_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "clinical"."admissions"
  ADD CONSTRAINT "admissions_bed_id_fkey"
  FOREIGN KEY ("bed_id") REFERENCES "clinical"."beds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "clinical"."patient_transfers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "admission_id" UUID,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "from_facility_id" UUID NOT NULL,
    "from_facility_name" TEXT NOT NULL,
    "from_ward" TEXT NOT NULL,
    "from_bed_id" UUID,
    "to_facility_id" UUID NOT NULL,
    "to_facility_name" TEXT NOT NULL,
    "to_ward" TEXT NOT NULL,
    "to_bed_id" UUID,
    "to_bed_label" TEXT,
    "status" "clinical"."transfer_status" NOT NULL DEFAULT 'requested',
    "reason" TEXT,
    "requested_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved_at" TIMESTAMPTZ(3),
    "started_at" TIMESTAMPTZ(3),
    "completed_at" TIMESTAMPTZ(3),
    "cancelled_at" TIMESTAMPTZ(3),
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "patient_transfers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_transfers_tenant_id_status_requested_at_idx"
  ON "clinical"."patient_transfers"("tenant_id", "status", "requested_at" DESC);
CREATE INDEX "patient_transfers_tenant_id_patient_id_status_idx"
  ON "clinical"."patient_transfers"("tenant_id", "patient_id", "status");
CREATE INDEX "patient_transfers_tenant_id_admission_id_idx"
  ON "clinical"."patient_transfers"("tenant_id", "admission_id");

ALTER TABLE "clinical"."patient_transfers"
  ADD CONSTRAINT "patient_transfers_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "clinical"."patient_transfers"
  ADD CONSTRAINT "patient_transfers_admission_id_fkey"
  FOREIGN KEY ("admission_id") REFERENCES "clinical"."admissions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clinical"."admissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."admissions" FORCE ROW LEVEL SECURITY;
CREATE POLICY admissions_tenant_isolation ON "clinical"."admissions"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."patient_transfers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."patient_transfers" FORCE ROW LEVEL SECURITY;
CREATE POLICY patient_transfers_tenant_isolation ON "clinical"."patient_transfers"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
