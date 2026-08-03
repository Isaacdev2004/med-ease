-- E3-06: Care pathways / enrollments / step progress
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/care-pathways.sql

CREATE TYPE "clinical"."care_plan_status" AS ENUM (
  'draft',
  'active',
  'on_hold',
  'completed',
  'cancelled',
  'archived',
  'suspended'
);

CREATE TYPE "clinical"."care_plan_type" AS ENUM (
  'chronic_disease',
  'rehabilitation',
  'preventive',
  'post_operative',
  'home_care',
  'palliative',
  'goal_based',
  'collaborative',
  'shared'
);

CREATE TYPE "clinical"."care_step_status" AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'skipped'
);

CREATE TYPE "clinical"."care_task_status" AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'overdue',
  'missed',
  'cancelled'
);

CREATE TABLE "clinical"."care_pathway_definitions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "completion_criteria" TEXT NOT NULL DEFAULT '',
    "required_appointments" INTEGER NOT NULL DEFAULT 0,
    "required_labs" INTEGER NOT NULL DEFAULT 0,
    "medication_protocols" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "mandatory_tasks" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_pathway_definitions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "care_pathway_definitions_tenant_id_code_key"
  ON "clinical"."care_pathway_definitions"("tenant_id", "code");
CREATE INDEX "care_pathway_definitions_tenant_id_active_idx"
  ON "clinical"."care_pathway_definitions"("tenant_id", "active");

CREATE TABLE "clinical"."care_pathway_step_definitions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "pathway_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "care_pathway_step_definitions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "care_pathway_step_definitions_tenant_id_pathway_id_sort_order_idx"
  ON "clinical"."care_pathway_step_definitions"("tenant_id", "pathway_id", "sort_order");

ALTER TABLE "clinical"."care_pathway_step_definitions"
  ADD CONSTRAINT "care_pathway_step_definitions_pathway_id_fkey"
  FOREIGN KEY ("pathway_id") REFERENCES "clinical"."care_pathway_definitions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."care_plans" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "pathway_id" UUID,
    "pathway_code" TEXT,
    "admission_id" UUID,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "clinical"."care_plan_type" NOT NULL DEFAULT 'chronic_disease',
    "status" "clinical"."care_plan_status" NOT NULL DEFAULT 'draft',
    "primary_diagnosis" TEXT,
    "diagnosis_code" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "review_date" DATE NOT NULL,
    "completion_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progress_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "health_score" DOUBLE PRECISION NOT NULL DEFAULT 70,
    "risk_level" TEXT NOT NULL DEFAULT 'moderate',
    "assigned_physician" TEXT NOT NULL,
    "assigned_physician_id" UUID NOT NULL,
    "facility_id" UUID,
    "facility_name" TEXT,
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "care_plans_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "care_plans_tenant_id_patient_id_status_idx"
  ON "clinical"."care_plans"("tenant_id", "patient_id", "status");
CREATE INDEX "care_plans_tenant_id_pathway_id_status_idx"
  ON "clinical"."care_plans"("tenant_id", "pathway_id", "status");
CREATE INDEX "care_plans_tenant_id_status_updated_at_idx"
  ON "clinical"."care_plans"("tenant_id", "status", "updated_at" DESC);

ALTER TABLE "clinical"."care_plans"
  ADD CONSTRAINT "care_plans_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "clinical"."care_plans"
  ADD CONSTRAINT "care_plans_pathway_id_fkey"
  FOREIGN KEY ("pathway_id") REFERENCES "clinical"."care_pathway_definitions"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "clinical"."care_plan_steps" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "care_plan_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "clinical"."care_step_status" NOT NULL DEFAULT 'pending',
    "completed_at" TIMESTAMPTZ(3),
    "notes" TEXT,

    CONSTRAINT "care_plan_steps_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "care_plan_steps_tenant_id_care_plan_id_sort_order_idx"
  ON "clinical"."care_plan_steps"("tenant_id", "care_plan_id", "sort_order");

ALTER TABLE "clinical"."care_plan_steps"
  ADD CONSTRAINT "care_plan_steps_care_plan_id_fkey"
  FOREIGN KEY ("care_plan_id") REFERENCES "clinical"."care_plans"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."care_plan_tasks" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "care_plan_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'custom',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "owner" TEXT NOT NULL DEFAULT '',
    "due_date" TIMESTAMPTZ(3) NOT NULL,
    "status" "clinical"."care_task_status" NOT NULL DEFAULT 'pending',
    "completion_notes" TEXT,
    "completed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_plan_tasks_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "care_plan_tasks_tenant_id_care_plan_id_status_idx"
  ON "clinical"."care_plan_tasks"("tenant_id", "care_plan_id", "status");
CREATE INDEX "care_plan_tasks_tenant_id_patient_id_due_date_idx"
  ON "clinical"."care_plan_tasks"("tenant_id", "patient_id", "due_date");

ALTER TABLE "clinical"."care_plan_tasks"
  ADD CONSTRAINT "care_plan_tasks_care_plan_id_fkey"
  FOREIGN KEY ("care_plan_id") REFERENCES "clinical"."care_plans"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "clinical"."care_pathway_definitions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."care_pathway_definitions" FORCE ROW LEVEL SECURITY;
CREATE POLICY care_pathway_definitions_tenant_isolation ON "clinical"."care_pathway_definitions"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."care_pathway_step_definitions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."care_pathway_step_definitions" FORCE ROW LEVEL SECURITY;
CREATE POLICY care_pathway_step_definitions_tenant_isolation ON "clinical"."care_pathway_step_definitions"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."care_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."care_plans" FORCE ROW LEVEL SECURITY;
CREATE POLICY care_plans_tenant_isolation ON "clinical"."care_plans"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."care_plan_steps" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."care_plan_steps" FORCE ROW LEVEL SECURITY;
CREATE POLICY care_plan_steps_tenant_isolation ON "clinical"."care_plan_steps"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."care_plan_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."care_plan_tasks" FORCE ROW LEVEL SECURITY;
CREATE POLICY care_plan_tasks_tenant_isolation ON "clinical"."care_plan_tasks"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
