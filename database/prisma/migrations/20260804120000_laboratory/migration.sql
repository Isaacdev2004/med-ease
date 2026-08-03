-- E4-05: Laboratory orders / specimens / diagnostic reports
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/laboratory.sql

CREATE TYPE "clinical"."lab_order_status" AS ENUM (
  'draft', 'pending', 'scheduled', 'collected', 'in_progress', 'completed', 'cancelled', 'rejected'
);
CREATE TYPE "clinical"."lab_order_priority" AS ENUM ('routine', 'urgent', 'stat');
CREATE TYPE "clinical"."lab_collection_method" AS ENUM (
  'in_clinic', 'home_collection', 'external_lab', 'referral'
);
CREATE TYPE "clinical"."lab_result_status" AS ENUM (
  'pending', 'processing', 'verified', 'released', 'corrected', 'amended', 'cancelled', 'rejected'
);
CREATE TYPE "clinical"."lab_result_flag" AS ENUM (
  'normal', 'high', 'low', 'critical_high', 'critical_low', 'abnormal'
);
CREATE TYPE "clinical"."lab_specimen_status" AS ENUM (
  'pending', 'collected', 'in_transit', 'received', 'processing', 'rejected', 'lost', 'damaged', 'stored', 'recollected'
);
CREATE TYPE "clinical"."lab_category" AS ENUM (
  'hematology', 'biochemistry', 'microbiology', 'immunology', 'virology', 'pathology',
  'genetics', 'endocrinology', 'toxicology', 'urinalysis', 'coagulation', 'blood_bank',
  'covid', 'pregnancy', 'custom'
);

CREATE TABLE "clinical"."lab_orders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "order_number" TEXT NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "ordering_physician" TEXT NOT NULL,
    "ordering_physician_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT '',
    "laboratory_id" UUID NOT NULL,
    "laboratory_name" TEXT NOT NULL,
    "priority" "clinical"."lab_order_priority" NOT NULL DEFAULT 'routine',
    "status" "clinical"."lab_order_status" NOT NULL DEFAULT 'pending',
    "collection_method" "clinical"."lab_collection_method" NOT NULL DEFAULT 'in_clinic',
    "clinical_indication" TEXT NOT NULL DEFAULT '',
    "diagnosis" TEXT,
    "care_plan_id" UUID,
    "appointment_id" UUID,
    "test_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "test_names" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "is_recurring" BOOLEAN NOT NULL DEFAULT false,
    "is_standing" BOOLEAN NOT NULL DEFAULT false,
    "scheduled_at" TIMESTAMPTZ(3),
    "collected_at" TIMESTAMPTZ(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "lab_orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lab_orders_tenant_id_order_number_key"
  ON "clinical"."lab_orders"("tenant_id", "order_number");
CREATE INDEX "lab_orders_tenant_id_facility_id_status_idx"
  ON "clinical"."lab_orders"("tenant_id", "facility_id", "status");
CREATE INDEX "lab_orders_tenant_id_patient_id_status_idx"
  ON "clinical"."lab_orders"("tenant_id", "patient_id", "status");
CREATE INDEX "lab_orders_tenant_id_status_created_at_idx"
  ON "clinical"."lab_orders"("tenant_id", "status", "created_at" DESC);

ALTER TABLE "clinical"."lab_orders"
  ADD CONSTRAINT "lab_orders_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."lab_specimens" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "barcode" TEXT NOT NULL,
    "qr_code" TEXT NOT NULL,
    "specimen_type" TEXT NOT NULL,
    "status" "clinical"."lab_specimen_status" NOT NULL DEFAULT 'pending',
    "collected_by" TEXT,
    "collected_at" TIMESTAMPTZ(3),
    "received_at" TIMESTAMPTZ(3),
    "temperature" TEXT,
    "storage_location" TEXT,
    "rejection_reason" TEXT,
    "chain_of_custody" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "lab_specimens_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lab_specimens_tenant_id_order_id_idx"
  ON "clinical"."lab_specimens"("tenant_id", "order_id");
CREATE INDEX "lab_specimens_tenant_id_patient_id_status_idx"
  ON "clinical"."lab_specimens"("tenant_id", "patient_id", "status");

ALTER TABLE "clinical"."lab_specimens"
  ADD CONSTRAINT "lab_specimens_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "clinical"."lab_orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."lab_diagnostic_reports" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "report_number" TEXT NOT NULL,
    "status" "clinical"."lab_result_status" NOT NULL DEFAULT 'pending',
    "category" "clinical"."lab_category" NOT NULL DEFAULT 'custom',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "verified_by" TEXT,
    "approved_by" TEXT,
    "digital_signature" TEXT,
    "technologist_id" UUID,
    "technologist_name" TEXT,
    "released_at" TIMESTAMPTZ(3),
    "corrected_at" TIMESTAMPTZ(3),
    "comments" TEXT,
    "attachments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "lab_diagnostic_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "lab_diagnostic_reports_tenant_id_report_number_key"
  ON "clinical"."lab_diagnostic_reports"("tenant_id", "report_number");
CREATE INDEX "lab_diagnostic_reports_tenant_id_order_id_idx"
  ON "clinical"."lab_diagnostic_reports"("tenant_id", "order_id");
CREATE INDEX "lab_diagnostic_reports_tenant_id_patient_id_status_idx"
  ON "clinical"."lab_diagnostic_reports"("tenant_id", "patient_id", "status");
CREATE INDEX "lab_diagnostic_reports_tenant_id_status_created_at_idx"
  ON "clinical"."lab_diagnostic_reports"("tenant_id", "status", "created_at" DESC);

ALTER TABLE "clinical"."lab_diagnostic_reports"
  ADD CONSTRAINT "lab_diagnostic_reports_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "clinical"."lab_orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."lab_observations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "test_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "loinc_code" TEXT NOT NULL DEFAULT '',
    "category" "clinical"."lab_category" NOT NULL DEFAULT 'custom',
    "value" TEXT NOT NULL,
    "numeric_value" DOUBLE PRECISION,
    "unit" TEXT NOT NULL DEFAULT '',
    "reference_range" TEXT NOT NULL DEFAULT '',
    "flag" "clinical"."lab_result_flag" NOT NULL DEFAULT 'normal',
    "interpretation" TEXT,
    "patient_friendly_text" TEXT,
    "collected_at" TIMESTAMPTZ(3) NOT NULL,
    "resulted_at" TIMESTAMPTZ(3),
    CONSTRAINT "lab_observations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lab_observations_tenant_id_report_id_idx"
  ON "clinical"."lab_observations"("tenant_id", "report_id");
CREATE INDEX "lab_observations_tenant_id_order_id_idx"
  ON "clinical"."lab_observations"("tenant_id", "order_id");
CREATE INDEX "lab_observations_tenant_id_patient_id_flag_idx"
  ON "clinical"."lab_observations"("tenant_id", "patient_id", "flag");

ALTER TABLE "clinical"."lab_observations"
  ADD CONSTRAINT "lab_observations_report_id_fkey"
  FOREIGN KEY ("report_id") REFERENCES "clinical"."lab_diagnostic_reports"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "clinical"."lab_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."lab_orders" FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_orders_tenant_isolation ON "clinical"."lab_orders"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."lab_specimens" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."lab_specimens" FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_specimens_tenant_isolation ON "clinical"."lab_specimens"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."lab_diagnostic_reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."lab_diagnostic_reports" FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_diagnostic_reports_tenant_isolation ON "clinical"."lab_diagnostic_reports"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."lab_observations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."lab_observations" FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_observations_tenant_isolation ON "clinical"."lab_observations"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
