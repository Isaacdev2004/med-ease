-- E3-04: Clinical beds / bed board
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/beds.sql

CREATE TYPE "clinical"."bed_status" AS ENUM (
  'available',
  'occupied',
  'reserved',
  'cleaning',
  'maintenance',
  'blocked'
);

CREATE TYPE "clinical"."bed_assignment_status" AS ENUM (
  'assigned',
  'released',
  'transferred'
);

CREATE TABLE "clinical"."beds" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "ward" TEXT NOT NULL,
    "room_label" TEXT NOT NULL,
    "bed_type" TEXT NOT NULL DEFAULT 'standard',
    "status" "clinical"."bed_status" NOT NULL DEFAULT 'available',
    "patient_id" UUID,
    "patient_name" TEXT,
    "reserved_until" TIMESTAMPTZ(3),
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "beds_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "beds_tenant_id_facility_id_label_key"
  ON "clinical"."beds"("tenant_id", "facility_id", "label");
CREATE INDEX "beds_tenant_id_facility_id_status_idx"
  ON "clinical"."beds"("tenant_id", "facility_id", "status");
CREATE INDEX "beds_tenant_id_ward_status_idx"
  ON "clinical"."beds"("tenant_id", "ward", "status");
CREATE INDEX "beds_tenant_id_patient_id_idx"
  ON "clinical"."beds"("tenant_id", "patient_id");

CREATE TABLE "clinical"."bed_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "bed_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "status" "clinical"."bed_assignment_status" NOT NULL DEFAULT 'assigned',
    "assigned_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "released_at" TIMESTAMPTZ(3),
    "assigned_by" UUID NOT NULL,
    "released_by" UUID,
    "notes" TEXT,

    CONSTRAINT "bed_assignments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "bed_assignments_tenant_id_bed_id_assigned_at_idx"
  ON "clinical"."bed_assignments"("tenant_id", "bed_id", "assigned_at" DESC);
CREATE INDEX "bed_assignments_tenant_id_patient_id_status_idx"
  ON "clinical"."bed_assignments"("tenant_id", "patient_id", "status");

ALTER TABLE "clinical"."bed_assignments"
  ADD CONSTRAINT "bed_assignments_bed_id_fkey"
  FOREIGN KEY ("bed_id") REFERENCES "clinical"."beds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clinical"."bed_assignments"
  ADD CONSTRAINT "bed_assignments_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical"."beds" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."beds" FORCE ROW LEVEL SECURITY;
CREATE POLICY beds_tenant_isolation ON "clinical"."beds"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."bed_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."bed_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY bed_assignments_tenant_isolation ON "clinical"."bed_assignments"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
