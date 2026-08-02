-- E3-03: Clinical medications / virtual pill organizer
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/medications.sql

-- Extend existing prescription_status enum
ALTER TYPE "clinical"."prescription_status" ADD VALUE IF NOT EXISTS 'draft';
ALTER TYPE "clinical"."prescription_status" ADD VALUE IF NOT EXISTS 'expired';
ALTER TYPE "clinical"."prescription_status" ADD VALUE IF NOT EXISTS 'renewed';
ALTER TYPE "clinical"."prescription_status" ADD VALUE IF NOT EXISTS 'pending';

CREATE TYPE "clinical"."medication_status" AS ENUM ('active', 'completed', 'paused', 'cancelled', 'future');
CREATE TYPE "clinical"."medication_route" AS ENUM ('oral', 'topical', 'injection', 'inhalation', 'sublingual', 'other');
CREATE TYPE "clinical"."schedule_slot" AS ENUM ('morning', 'afternoon', 'evening', 'night', 'custom', 'prn');
CREATE TYPE "clinical"."scheduled_dose_status" AS ENUM ('pending', 'taken', 'missed', 'late', 'skipped');
CREATE TYPE "clinical"."dose_log_status" AS ENUM ('taken', 'skipped', 'late', 'partial', 'vomited', 'rescheduled');
CREATE TYPE "clinical"."refill_request_status" AS ENUM ('pending', 'approved', 'rejected', 'dispensed', 'partial');

CREATE TABLE "clinical"."prescriptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "prescription_number" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "generic_name" TEXT NOT NULL,
    "brand_name" TEXT,
    "strength" TEXT NOT NULL,
    "medication_class" TEXT NOT NULL DEFAULT '',
    "medication_type" TEXT NOT NULL DEFAULT '',
    "manufacturer" TEXT,
    "controlled_substance" BOOLEAN NOT NULL DEFAULT false,
    "dose" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "route" "clinical"."medication_route" NOT NULL DEFAULT 'oral',
    "duration_days" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "validity_days" INTEGER NOT NULL DEFAULT 90,
    "expires_at" TIMESTAMPTZ(3) NOT NULL,
    "status" "clinical"."prescription_status" NOT NULL DEFAULT 'active',
    "refill_count" INTEGER NOT NULL DEFAULT 0,
    "refills_remaining" INTEGER NOT NULL DEFAULT 0,
    "prescribing_physician" TEXT NOT NULL,
    "prescribing_physician_id" UUID NOT NULL,
    "dispensing_pharmacy" TEXT,
    "dispensing_pharmacy_id" UUID,
    "instructions" TEXT NOT NULL DEFAULT '',
    "warnings" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contraindications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "care_plan_id" UUID,
    "diagnosis_code" TEXT,
    "appointment_id" UUID,
    "facility_id" UUID,
    "fhir_resource_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "prescriptions_tenant_id_prescription_number_key"
  ON "clinical"."prescriptions"("tenant_id", "prescription_number");
CREATE INDEX "prescriptions_tenant_id_patient_id_status_idx"
  ON "clinical"."prescriptions"("tenant_id", "patient_id", "status");
CREATE INDEX "prescriptions_tenant_id_status_idx"
  ON "clinical"."prescriptions"("tenant_id", "status");

ALTER TABLE "clinical"."prescriptions"
  ADD CONSTRAINT "prescriptions_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."patient_medications" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "prescription_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "generic_name" TEXT NOT NULL,
    "brand_name" TEXT,
    "strength" TEXT NOT NULL,
    "medication_class" TEXT NOT NULL DEFAULT '',
    "medication_type" TEXT NOT NULL DEFAULT '',
    "manufacturer" TEXT,
    "controlled_substance" BOOLEAN NOT NULL DEFAULT false,
    "status" "clinical"."medication_status" NOT NULL DEFAULT 'active',
    "dose" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "route" "clinical"."medication_route" NOT NULL DEFAULT 'oral',
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "remaining_days" INTEGER,
    "instructions" TEXT NOT NULL DEFAULT '',
    "warnings" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contraindications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "side_effects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "storage" TEXT,
    "prescribing_physician" TEXT NOT NULL,
    "dispensing_pharmacy" TEXT,
    "refill_count" INTEGER NOT NULL DEFAULT 0,
    "refills_remaining" INTEGER NOT NULL DEFAULT 0,
    "adherence_percent" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "condition" TEXT,
    "care_plan_id" UUID,
    "library_medication_id" UUID,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "patient_medications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_medications_tenant_id_patient_id_status_idx"
  ON "clinical"."patient_medications"("tenant_id", "patient_id", "status");
CREATE INDEX "patient_medications_tenant_id_prescription_id_idx"
  ON "clinical"."patient_medications"("tenant_id", "prescription_id");

ALTER TABLE "clinical"."patient_medications"
  ADD CONSTRAINT "patient_medications_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "clinical"."patient_medications"
  ADD CONSTRAINT "patient_medications_prescription_id_fkey"
  FOREIGN KEY ("prescription_id") REFERENCES "clinical"."prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."medication_doses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "medication_name" TEXT NOT NULL,
    "scheduled_at" TIMESTAMPTZ(3) NOT NULL,
    "slot" "clinical"."schedule_slot" NOT NULL DEFAULT 'morning',
    "dose" TEXT NOT NULL,
    "status" "clinical"."scheduled_dose_status" NOT NULL DEFAULT 'pending',
    "instructions" TEXT,

    CONSTRAINT "medication_doses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "medication_doses_tenant_id_patient_id_scheduled_at_idx"
  ON "clinical"."medication_doses"("tenant_id", "patient_id", "scheduled_at");
CREATE INDEX "medication_doses_tenant_id_medication_id_scheduled_at_idx"
  ON "clinical"."medication_doses"("tenant_id", "medication_id", "scheduled_at");

ALTER TABLE "clinical"."medication_doses"
  ADD CONSTRAINT "medication_doses_medication_id_fkey"
  FOREIGN KEY ("medication_id") REFERENCES "clinical"."patient_medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."dose_logs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "scheduled_dose_id" UUID,
    "status" "clinical"."dose_log_status" NOT NULL,
    "logged_at" TIMESTAMPTZ(3) NOT NULL,
    "notes" TEXT,
    "symptoms" TEXT,
    "side_effects" TEXT,
    "mood" TEXT,
    "pain_score" INTEGER,
    "blood_sugar" DOUBLE PRECISION,
    "blood_pressure" TEXT,
    "temperature" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,

    CONSTRAINT "dose_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "dose_logs_tenant_id_patient_id_logged_at_idx"
  ON "clinical"."dose_logs"("tenant_id", "patient_id", "logged_at" DESC);
CREATE INDEX "dose_logs_tenant_id_medication_id_logged_at_idx"
  ON "clinical"."dose_logs"("tenant_id", "medication_id", "logged_at" DESC);

ALTER TABLE "clinical"."dose_logs"
  ADD CONSTRAINT "dose_logs_medication_id_fkey"
  FOREIGN KEY ("medication_id") REFERENCES "clinical"."patient_medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clinical"."dose_logs"
  ADD CONSTRAINT "dose_logs_scheduled_dose_id_fkey"
  FOREIGN KEY ("scheduled_dose_id") REFERENCES "clinical"."medication_doses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "clinical"."medication_reminders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'in_app',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "due_at" TIMESTAMPTZ(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "medication_reminders_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "medication_reminders_tenant_id_patient_id_due_at_idx"
  ON "clinical"."medication_reminders"("tenant_id", "patient_id", "due_at");
CREATE INDEX "medication_reminders_tenant_id_active_due_at_idx"
  ON "clinical"."medication_reminders"("tenant_id", "active", "due_at");

ALTER TABLE "clinical"."medication_reminders"
  ADD CONSTRAINT "medication_reminders_medication_id_fkey"
  FOREIGN KEY ("medication_id") REFERENCES "clinical"."patient_medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."refill_requests" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "prescription_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "medication_name" TEXT NOT NULL,
    "pharmacy_id" UUID NOT NULL,
    "pharmacy_name" TEXT NOT NULL,
    "status" "clinical"."refill_request_status" NOT NULL DEFAULT 'pending',
    "remaining_tablets" INTEGER,
    "days_left" INTEGER,
    "requested_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expected_date" DATE,
    "auto_refill" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refill_requests_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "refill_requests_tenant_id_patient_id_status_idx"
  ON "clinical"."refill_requests"("tenant_id", "patient_id", "status");
CREATE INDEX "refill_requests_tenant_id_prescription_id_idx"
  ON "clinical"."refill_requests"("tenant_id", "prescription_id");

ALTER TABLE "clinical"."refill_requests"
  ADD CONSTRAINT "refill_requests_prescription_id_fkey"
  FOREIGN KEY ("prescription_id") REFERENCES "clinical"."prescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "clinical"."refill_requests"
  ADD CONSTRAINT "refill_requests_medication_id_fkey"
  FOREIGN KEY ("medication_id") REFERENCES "clinical"."patient_medications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- RLS
ALTER TABLE "clinical"."prescriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."prescriptions" FORCE ROW LEVEL SECURITY;
CREATE POLICY prescriptions_tenant_isolation ON "clinical"."prescriptions"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."patient_medications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."patient_medications" FORCE ROW LEVEL SECURITY;
CREATE POLICY patient_medications_tenant_isolation ON "clinical"."patient_medications"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."medication_doses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."medication_doses" FORCE ROW LEVEL SECURITY;
CREATE POLICY medication_doses_tenant_isolation ON "clinical"."medication_doses"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."dose_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."dose_logs" FORCE ROW LEVEL SECURITY;
CREATE POLICY dose_logs_tenant_isolation ON "clinical"."dose_logs"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."medication_reminders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."medication_reminders" FORCE ROW LEVEL SECURITY;
CREATE POLICY medication_reminders_tenant_isolation ON "clinical"."medication_reminders"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."refill_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."refill_requests" FORCE ROW LEVEL SECURITY;
CREATE POLICY refill_requests_tenant_isolation ON "clinical"."refill_requests"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
