-- E4-07: Patient monitoring / vitals / RPM / alerts / EWS
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/monitoring.sql

CREATE TYPE "clinical"."vital_type" AS ENUM (
  'blood_pressure', 'heart_rate', 'respiratory_rate', 'temperature', 'spo2',
  'blood_glucose', 'weight', 'bmi', 'ecg_summary', 'pain_score', 'fall_risk'
);
CREATE TYPE "clinical"."vital_status" AS ENUM ('normal', 'warning', 'critical');
CREATE TYPE "clinical"."monitoring_context" AS ENUM (
  'home', 'ward', 'telemonitoring', 'outpatient', 'rpm'
);
CREATE TYPE "clinical"."monitoring_observation_status" AS ENUM (
  'final', 'preliminary', 'amended'
);
CREATE TYPE "clinical"."monitoring_interpretation" AS ENUM (
  'normal', 'abnormal', 'critical'
);
CREATE TYPE "clinical"."monitoring_device_status" AS ENUM (
  'online', 'offline', 'syncing', 'error', 'maintenance'
);
CREATE TYPE "clinical"."battery_status" AS ENUM (
  'full', 'good', 'low', 'critical', 'unknown'
);
CREATE TYPE "clinical"."monitoring_device_type" AS ENUM (
  'wearable', 'bedside', 'home', 'mobile', 'gateway'
);
CREATE TYPE "clinical"."alert_severity" AS ENUM (
  'info', 'warning', 'critical', 'urgent'
);
CREATE TYPE "clinical"."monitoring_alert_status" AS ENUM (
  'active', 'acknowledged', 'resolved', 'dismissed'
);
CREATE TYPE "clinical"."monitoring_alert_type" AS ENUM (
  'threshold', 'missed_reading', 'device_offline', 'battery_low', 'escalation', 'clinical'
);
CREATE TYPE "clinical"."rpm_program_status" AS ENUM (
  'active', 'paused', 'completed', 'pending'
);
CREATE TYPE "clinical"."early_warning_type" AS ENUM ('NEWS2', 'MEWS');
CREATE TYPE "clinical"."early_warning_risk" AS ENUM (
  'low', 'medium', 'high', 'critical'
);

CREATE TABLE "clinical"."monitoring_devices" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "type" "clinical"."monitoring_device_type" NOT NULL DEFAULT 'home',
    "serial_number" TEXT NOT NULL,
    "status" "clinical"."monitoring_device_status" NOT NULL DEFAULT 'online',
    "battery" "clinical"."battery_status" NOT NULL DEFAULT 'unknown',
    "battery_percent" INTEGER,
    "last_sync_at" TIMESTAMPTZ(3),
    "firmware_version" TEXT,
    "calibration_due" TIMESTAMPTZ(3),
    "supported_metrics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "monitoring_devices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "monitoring_devices_tenant_id_serial_number_key"
  ON "clinical"."monitoring_devices"("tenant_id", "serial_number");
CREATE INDEX "monitoring_devices_tenant_id_status_idx"
  ON "clinical"."monitoring_devices"("tenant_id", "status");

CREATE TABLE "clinical"."device_assignments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "assigned_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL,
    "unassigned_at" TIMESTAMPTZ(3),
    "program_id" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "device_assignments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "device_assignments_tenant_id_patient_id_active_idx"
  ON "clinical"."device_assignments"("tenant_id", "patient_id", "active");
CREATE INDEX "device_assignments_tenant_id_device_id_idx"
  ON "clinical"."device_assignments"("tenant_id", "device_id");

ALTER TABLE "clinical"."device_assignments"
  ADD CONSTRAINT "device_assignments_device_id_fkey"
  FOREIGN KEY ("device_id") REFERENCES "clinical"."monitoring_devices"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clinical"."device_assignments"
  ADD CONSTRAINT "device_assignments_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."vital_signs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "clinical"."vital_type" NOT NULL,
    "value_text" TEXT NOT NULL,
    "value_numeric" DOUBLE PRECISION,
    "unit" TEXT NOT NULL DEFAULT '',
    "recorded_at" TIMESTAMPTZ(3) NOT NULL,
    "context" "clinical"."monitoring_context" NOT NULL DEFAULT 'home',
    "device_id" UUID,
    "recorded_by" TEXT,
    "status" "clinical"."vital_status" NOT NULL DEFAULT 'normal',
    "systolic" INTEGER,
    "diastolic" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vital_signs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "vital_signs_tenant_id_patient_id_recorded_at_idx"
  ON "clinical"."vital_signs"("tenant_id", "patient_id", "recorded_at" DESC);
CREATE INDEX "vital_signs_tenant_id_type_recorded_at_idx"
  ON "clinical"."vital_signs"("tenant_id", "type", "recorded_at" DESC);

ALTER TABLE "clinical"."vital_signs"
  ADD CONSTRAINT "vital_signs_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."monitoring_observations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'vital-signs',
    "code" TEXT NOT NULL,
    "display" TEXT NOT NULL,
    "value_text" TEXT NOT NULL,
    "value_numeric" DOUBLE PRECISION,
    "unit" TEXT NOT NULL DEFAULT '',
    "recorded_at" TIMESTAMPTZ(3) NOT NULL,
    "context" "clinical"."monitoring_context" NOT NULL DEFAULT 'home',
    "device_id" UUID,
    "session_id" UUID,
    "status" "clinical"."monitoring_observation_status" NOT NULL DEFAULT 'final',
    "interpretation" "clinical"."monitoring_interpretation",
    "reference_range" TEXT,
    "recorded_by" TEXT,
    "notes" TEXT,
    "care_plan_id" UUID,
    "appointment_id" UUID,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "monitoring_observations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "monitoring_observations_tenant_id_patient_id_recorded_at_idx"
  ON "clinical"."monitoring_observations"("tenant_id", "patient_id", "recorded_at" DESC);
CREATE INDEX "monitoring_observations_tenant_id_category_recorded_at_idx"
  ON "clinical"."monitoring_observations"("tenant_id", "category", "recorded_at" DESC);

ALTER TABLE "clinical"."monitoring_observations"
  ADD CONSTRAINT "monitoring_observations_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."monitoring_alerts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "type" "clinical"."monitoring_alert_type" NOT NULL,
    "severity" "clinical"."alert_severity" NOT NULL DEFAULT 'warning',
    "status" "clinical"."monitoring_alert_status" NOT NULL DEFAULT 'active',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL DEFAULT '',
    "metric" "clinical"."vital_type",
    "value_text" TEXT,
    "threshold" TEXT,
    "acknowledged_at" TIMESTAMPTZ(3),
    "acknowledged_by" TEXT,
    "resolved_at" TIMESTAMPTZ(3),
    "observation_id" UUID,
    "device_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "monitoring_alerts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "monitoring_alerts_tenant_id_patient_id_status_idx"
  ON "clinical"."monitoring_alerts"("tenant_id", "patient_id", "status");
CREATE INDEX "monitoring_alerts_tenant_id_status_severity_created_at_idx"
  ON "clinical"."monitoring_alerts"("tenant_id", "status", "severity", "created_at" DESC);

ALTER TABLE "clinical"."monitoring_alerts"
  ADD CONSTRAINT "monitoring_alerts_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."monitoring_programs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "status" "clinical"."rpm_program_status" NOT NULL DEFAULT 'active',
    "enrolled_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrolled_by" TEXT NOT NULL,
    "device_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "metrics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "frequency" TEXT NOT NULL DEFAULT '',
    "clinician_id" UUID NOT NULL,
    "clinician_name" TEXT NOT NULL,
    "care_plan_id" UUID,
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "monitoring_programs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "monitoring_programs_tenant_id_patient_id_status_idx"
  ON "clinical"."monitoring_programs"("tenant_id", "patient_id", "status");

ALTER TABLE "clinical"."monitoring_programs"
  ADD CONSTRAINT "monitoring_programs_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."early_warning_scores" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "clinical"."early_warning_type" NOT NULL,
    "score" INTEGER NOT NULL,
    "risk_level" "clinical"."early_warning_risk" NOT NULL,
    "components" JSONB NOT NULL DEFAULT '{}',
    "calculated_at" TIMESTAMPTZ(3) NOT NULL,
    "context" "clinical"."monitoring_context" NOT NULL DEFAULT 'ward',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "early_warning_scores_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "early_warning_scores_tenant_id_patient_id_calculated_at_idx"
  ON "clinical"."early_warning_scores"("tenant_id", "patient_id", "calculated_at" DESC);

ALTER TABLE "clinical"."early_warning_scores"
  ADD CONSTRAINT "early_warning_scores_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "clinical"."monitoring_devices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."monitoring_devices" FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_devices_tenant_isolation ON "clinical"."monitoring_devices"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."device_assignments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."device_assignments" FORCE ROW LEVEL SECURITY;
CREATE POLICY device_assignments_tenant_isolation ON "clinical"."device_assignments"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."vital_signs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."vital_signs" FORCE ROW LEVEL SECURITY;
CREATE POLICY vital_signs_tenant_isolation ON "clinical"."vital_signs"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."monitoring_observations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."monitoring_observations" FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_observations_tenant_isolation ON "clinical"."monitoring_observations"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."monitoring_alerts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."monitoring_alerts" FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_alerts_tenant_isolation ON "clinical"."monitoring_alerts"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."monitoring_programs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."monitoring_programs" FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_programs_tenant_isolation ON "clinical"."monitoring_programs"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."early_warning_scores" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."early_warning_scores" FORCE ROW LEVEL SECURITY;
CREATE POLICY early_warning_scores_tenant_isolation ON "clinical"."early_warning_scores"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
