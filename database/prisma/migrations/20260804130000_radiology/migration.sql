-- E4-06: Radiology orders / studies / reports / devices
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/radiology.sql

CREATE TYPE "clinical"."imaging_study_status" AS ENUM (
  'scheduled', 'in_progress', 'completed', 'pending_interpretation',
  'preliminary', 'final', 'amended', 'cancelled'
);
CREATE TYPE "clinical"."imaging_study_priority" AS ENUM ('routine', 'urgent', 'stat');
CREATE TYPE "clinical"."imaging_body_part" AS ENUM (
  'head', 'neck', 'chest', 'abdomen', 'pelvis', 'spine',
  'upper_extremity', 'lower_extremity', 'whole_body', 'breast', 'dental', 'cardiac'
);
CREATE TYPE "clinical"."imaging_category" AS ENUM (
  'diagnostic', 'screening', 'interventional', 'emergency', 'follow_up', 'research'
);
CREATE TYPE "clinical"."imaging_report_status" AS ENUM (
  'draft', 'preliminary', 'final', 'amended', 'cancelled'
);
CREATE TYPE "clinical"."imaging_billing_status" AS ENUM (
  'pending', 'submitted', 'paid', 'denied'
);
CREATE TYPE "clinical"."imaging_device_status" AS ENUM (
  'online', 'offline', 'maintenance'
);

CREATE TABLE "clinical"."radiology_studies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "accession_number" TEXT NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "ordering_physician" TEXT NOT NULL,
    "ordering_physician_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "radiologist_id" UUID,
    "radiologist_name" TEXT,
    "modality" TEXT NOT NULL,
    "body_part" "clinical"."imaging_body_part" NOT NULL,
    "category" "clinical"."imaging_category" NOT NULL DEFAULT 'diagnostic',
    "status" "clinical"."imaging_study_status" NOT NULL DEFAULT 'scheduled',
    "priority" "clinical"."imaging_study_priority" NOT NULL DEFAULT 'routine',
    "study_date" TIMESTAMPTZ(3) NOT NULL,
    "reason" TEXT NOT NULL DEFAULT '',
    "clinical_indication" TEXT NOT NULL DEFAULT '',
    "protocol" TEXT NOT NULL DEFAULT '',
    "contrast" JSONB NOT NULL DEFAULT '{"used":false}',
    "patient_position" JSONB NOT NULL DEFAULT '{"code":"HFS","description":"Head first supine"}',
    "image_count" INTEGER NOT NULL DEFAULT 0,
    "series_count" INTEGER NOT NULL DEFAULT 0,
    "series" JSONB NOT NULL DEFAULT '[]',
    "radiation_dose_msv" DOUBLE PRECISION,
    "device_id" TEXT NOT NULL DEFAULT '',
    "device_name" TEXT NOT NULL DEFAULT '',
    "is_emergency" BOOLEAN NOT NULL DEFAULT false,
    "billing_status" "clinical"."imaging_billing_status" NOT NULL DEFAULT 'pending',
    "is_critical" BOOLEAN NOT NULL DEFAULT false,
    "care_plan_id" UUID,
    "appointment_id" UUID,
    "comparison_study_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "radiology_studies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "radiology_studies_tenant_id_accession_number_key"
  ON "clinical"."radiology_studies"("tenant_id", "accession_number");
CREATE INDEX "radiology_studies_tenant_id_patient_id_status_idx"
  ON "clinical"."radiology_studies"("tenant_id", "patient_id", "status");
CREATE INDEX "radiology_studies_tenant_id_facility_id_status_idx"
  ON "clinical"."radiology_studies"("tenant_id", "facility_id", "status");
CREATE INDEX "radiology_studies_tenant_id_status_study_date_idx"
  ON "clinical"."radiology_studies"("tenant_id", "status", "study_date" DESC);
CREATE INDEX "radiology_studies_tenant_id_is_critical_idx"
  ON "clinical"."radiology_studies"("tenant_id", "is_critical");

ALTER TABLE "clinical"."radiology_studies"
  ADD CONSTRAINT "radiology_studies_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."radiology_orders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "order_number" TEXT NOT NULL,
    "study_id" UUID,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "ordering_physician" TEXT NOT NULL,
    "ordering_physician_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "body_part" "clinical"."imaging_body_part" NOT NULL,
    "priority" "clinical"."imaging_study_priority" NOT NULL DEFAULT 'routine',
    "status" "clinical"."imaging_study_status" NOT NULL DEFAULT 'scheduled',
    "clinical_indication" TEXT NOT NULL DEFAULT '',
    "reason" TEXT NOT NULL DEFAULT '',
    "care_plan_id" UUID,
    "appointment_id" UUID,
    "scheduled_at" TIMESTAMPTZ(3),
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "radiology_orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "radiology_orders_tenant_id_order_number_key"
  ON "clinical"."radiology_orders"("tenant_id", "order_number");
CREATE INDEX "radiology_orders_tenant_id_patient_id_status_idx"
  ON "clinical"."radiology_orders"("tenant_id", "patient_id", "status");
CREATE INDEX "radiology_orders_tenant_id_facility_id_status_idx"
  ON "clinical"."radiology_orders"("tenant_id", "facility_id", "status");
CREATE INDEX "radiology_orders_tenant_id_status_created_at_idx"
  ON "clinical"."radiology_orders"("tenant_id", "status", "created_at" DESC);

ALTER TABLE "clinical"."radiology_orders"
  ADD CONSTRAINT "radiology_orders_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical"."radiology_orders"
  ADD CONSTRAINT "radiology_orders_study_id_fkey"
  FOREIGN KEY ("study_id") REFERENCES "clinical"."radiology_studies"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "clinical"."radiology_reports" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "study_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "accession_number" TEXT NOT NULL,
    "status" "clinical"."imaging_report_status" NOT NULL DEFAULT 'draft',
    "modality" TEXT NOT NULL,
    "body_part" "clinical"."imaging_body_part" NOT NULL,
    "title" TEXT NOT NULL,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "impression" JSONB NOT NULL DEFAULT '{"summary":"","critical":false}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "measurements" JSONB NOT NULL DEFAULT '[]',
    "radiologist_id" TEXT NOT NULL DEFAULT '',
    "radiologist_name" TEXT NOT NULL DEFAULT '',
    "signed_at" TIMESTAMPTZ(3),
    "is_critical" BOOLEAN NOT NULL DEFAULT false,
    "is_unread" BOOLEAN NOT NULL DEFAULT true,
    "attachments" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "radiology_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "radiology_reports_study_id_key"
  ON "clinical"."radiology_reports"("study_id");
CREATE INDEX "radiology_reports_tenant_id_patient_id_status_idx"
  ON "clinical"."radiology_reports"("tenant_id", "patient_id", "status");
CREATE INDEX "radiology_reports_tenant_id_status_created_at_idx"
  ON "clinical"."radiology_reports"("tenant_id", "status", "created_at" DESC);
CREATE INDEX "radiology_reports_tenant_id_is_critical_idx"
  ON "clinical"."radiology_reports"("tenant_id", "is_critical");

ALTER TABLE "clinical"."radiology_reports"
  ADD CONSTRAINT "radiology_reports_study_id_fkey"
  FOREIGN KEY ("study_id") REFERENCES "clinical"."radiology_studies"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."imaging_devices" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "status" "clinical"."imaging_device_status" NOT NULL DEFAULT 'online',
    "utilization_percent" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "imaging_devices_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "imaging_devices_tenant_id_facility_id_idx"
  ON "clinical"."imaging_devices"("tenant_id", "facility_id");

ALTER TABLE "clinical"."radiology_studies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."radiology_studies" FORCE ROW LEVEL SECURITY;
CREATE POLICY radiology_studies_tenant_isolation ON "clinical"."radiology_studies"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."radiology_orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."radiology_orders" FORCE ROW LEVEL SECURITY;
CREATE POLICY radiology_orders_tenant_isolation ON "clinical"."radiology_orders"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."radiology_reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."radiology_reports" FORCE ROW LEVEL SECURITY;
CREATE POLICY radiology_reports_tenant_isolation ON "clinical"."radiology_reports"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."imaging_devices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."imaging_devices" FORCE ROW LEVEL SECURITY;
CREATE POLICY imaging_devices_tenant_isolation ON "clinical"."imaging_devices"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
