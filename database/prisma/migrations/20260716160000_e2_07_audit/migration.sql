-- E2-07: Global audit logs + audit_action enum extensions

ALTER TYPE "audit"."audit_action" ADD VALUE IF NOT EXISTS 'LOGIN';
ALTER TYPE "audit"."audit_action" ADD VALUE IF NOT EXISTS 'LOGOUT';

CREATE TABLE "audit"."audit_logs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID,
    "facility_id" UUID,
    "actor_id" UUID NOT NULL,
    "action" "audit"."audit_action" NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "resource_id" UUID,
    "patient_id" UUID,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "request_id" UUID,
    "outcome" TEXT NOT NULL DEFAULT 'success',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "audit_logs_tenant_id_created_at_idx" ON "audit"."audit_logs"("tenant_id", "created_at" DESC);
CREATE INDEX "audit_logs_patient_id_created_at_idx" ON "audit"."audit_logs"("patient_id", "created_at" DESC);
CREATE INDEX "audit_logs_actor_id_created_at_idx" ON "audit"."audit_logs"("actor_id", "created_at" DESC);

ALTER TABLE "audit"."audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit"."audit_logs" FORCE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_tenant_isolation ON "audit"."audit_logs"
  FOR ALL
  USING (
    platform.is_system_request()
    OR (tenant_id IS NOT NULL AND platform.tenant_row_matches(tenant_id))
  )
  WITH CHECK (
    platform.is_system_request()
    OR (tenant_id IS NOT NULL AND platform.tenant_row_matches(tenant_id))
  );
