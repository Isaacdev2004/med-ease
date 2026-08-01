-- E3-02: Clinical appointments domain
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/appointments.sql

CREATE TABLE "clinical"."appointments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "scheduled_at" TIMESTAMPTZ(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "status" "clinical"."appointment_status" NOT NULL DEFAULT 'scheduled',
    "visit_type" TEXT NOT NULL,
    "referral_id" UUID,
    "telehealth_link" TEXT,
    "notes" TEXT,
    "fhir_resource_id" UUID NOT NULL,
    "specialty" TEXT,
    "department" TEXT,
    "room" TEXT,
    "reason" TEXT,
    "insurance" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'routine',
    "check_in_status" TEXT NOT NULL DEFAULT 'not_checked_in',
    "queue_position" INTEGER,
    "follow_up_required" BOOLEAN NOT NULL DEFAULT false,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurring_pattern" TEXT,
    "patient_full_name" TEXT NOT NULL,
    "patient_mrn" TEXT NOT NULL,
    "provider_full_name" TEXT NOT NULL,
    "provider_specialty" TEXT,
    "provider_department" TEXT,
    "facility_name" TEXT NOT NULL,
    "facility_address" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "appointments_tenant_id_facility_id_scheduled_at_idx"
  ON "clinical"."appointments"("tenant_id", "facility_id", "scheduled_at");
CREATE INDEX "appointments_tenant_id_provider_id_scheduled_at_idx"
  ON "clinical"."appointments"("tenant_id", "provider_id", "scheduled_at");
CREATE INDEX "appointments_tenant_id_patient_id_scheduled_at_idx"
  ON "clinical"."appointments"("tenant_id", "patient_id", "scheduled_at" DESC);

ALTER TABLE "clinical"."appointments"
  ADD CONSTRAINT "appointments_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical"."appointments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."appointments" FORCE ROW LEVEL SECURITY;

CREATE POLICY appointments_tenant_isolation ON "clinical"."appointments"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
