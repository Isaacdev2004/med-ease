-- E6: Enterprise admin modules (document store + notifications + preferences)
CREATE TABLE "platform"."enterprise_records" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "module" VARCHAR(64) NOT NULL,
    "resource_type" VARCHAR(64) NOT NULL,
    "external_key" VARCHAR(120),
    "title" VARCHAR(320),
    "status" VARCHAR(64),
    "payload" JSONB NOT NULL,
    "created_by" UUID,
    "updated_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "enterprise_records_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "enterprise_records_tenant_module_resource_updated_idx"
  ON "platform"."enterprise_records"("tenant_id", "module", "resource_type", "updated_at" DESC);
CREATE INDEX "enterprise_records_tenant_module_resource_status_idx"
  ON "platform"."enterprise_records"("tenant_id", "module", "resource_type", "status");
CREATE INDEX "enterprise_records_tenant_module_external_key_idx"
  ON "platform"."enterprise_records"("tenant_id", "module", "external_key");

CREATE TABLE "platform"."enterprise_snapshots" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "module" VARCHAR(64) NOT NULL,
    "kind" VARCHAR(32) NOT NULL,
    "scope_key" VARCHAR(120) NOT NULL DEFAULT '',
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    CONSTRAINT "enterprise_snapshots_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "enterprise_snapshots_tenant_module_kind_scope_key"
  ON "platform"."enterprise_snapshots"("tenant_id", "module", "kind", "scope_key");
CREATE INDEX "enterprise_snapshots_tenant_module_kind_idx"
  ON "platform"."enterprise_snapshots"("tenant_id", "module", "kind");

CREATE TABLE "platform"."app_notifications" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID,
    "title" VARCHAR(320) NOT NULL,
    "message" TEXT NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "priority" VARCHAR(32) NOT NULL DEFAULT 'medium',
    "category" VARCHAR(64) NOT NULL DEFAULT 'system',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "payload" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "app_notifications_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "app_notifications_tenant_user_read_created_idx"
  ON "platform"."app_notifications"("tenant_id", "user_id", "read", "created_at" DESC);
CREATE INDEX "app_notifications_tenant_created_idx"
  ON "platform"."app_notifications"("tenant_id", "created_at" DESC);

CREATE TABLE "platform"."user_preferences" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "key" VARCHAR(120) NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "user_preferences_tenant_user_key"
  ON "platform"."user_preferences"("tenant_id", "user_id", "key");
CREATE INDEX "user_preferences_tenant_user_idx"
  ON "platform"."user_preferences"("tenant_id", "user_id");
