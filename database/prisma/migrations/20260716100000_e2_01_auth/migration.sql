-- E2-01: Authentication foundation — users, sessions, security events

CREATE TYPE "identity"."identity_role" AS ENUM (
  'platform_admin',
  'facility_admin',
  'physician',
  'pharmacist',
  'transport_dispatcher',
  'patient'
);

CREATE TYPE "identity"."session_status" AS ENUM ('active', 'revoked', 'expired');

CREATE TYPE "audit"."security_event_type" AS ENUM (
  'login_success',
  'login_failure',
  'logout',
  'token_refresh',
  'token_reuse_detected',
  'session_revoked',
  'account_locked',
  'account_unlocked',
  'password_changed'
);

CREATE TABLE "core"."tenants" (
  "id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" "core"."tenant_status" NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_slug_key" ON "core"."tenants"("slug");

CREATE TABLE "core"."organizations" (
  "id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" "core"."tenant_status" NOT NULL DEFAULT 'active',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organizations_tenant_id_slug_key" ON "core"."organizations"("tenant_id", "slug");
CREATE INDEX "organizations_tenant_id_idx" ON "core"."organizations"("tenant_id");

ALTER TABLE "core"."organizations"
  ADD CONSTRAINT "organizations_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "identity"."users" (
  "id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "organization_id" UUID NOT NULL,
  "email" TEXT NOT NULL,
  "password_hash" TEXT NOT NULL,
  "full_name" TEXT NOT NULL,
  "role" "identity"."identity_role" NOT NULL,
  "status" "identity"."user_status" NOT NULL DEFAULT 'active',
  "locale" TEXT NOT NULL DEFAULT 'en-US',
  "timezone" TEXT NOT NULL DEFAULT 'UTC',
  "avatar_url" TEXT,
  "failed_login_count" INTEGER NOT NULL DEFAULT 0,
  "locked_until" TIMESTAMP(3),
  "last_login_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_tenant_id_email_key" ON "identity"."users"("tenant_id", "email");
CREATE INDEX "users_organization_id_idx" ON "identity"."users"("organization_id");

ALTER TABLE "identity"."users"
  ADD CONSTRAINT "users_tenant_id_fkey"
  FOREIGN KEY ("tenant_id") REFERENCES "core"."tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "identity"."users"
  ADD CONSTRAINT "users_organization_id_fkey"
  FOREIGN KEY ("organization_id") REFERENCES "core"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "identity"."user_sessions" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "tenant_id" UUID NOT NULL,
  "device_id" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "status" "identity"."session_status" NOT NULL DEFAULT 'active',
  "refresh_family_id" UUID NOT NULL,
  "remember_me" BOOLEAN NOT NULL DEFAULT false,
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "revoked_at" TIMESTAMP(3),
  CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "user_sessions_user_id_status_idx" ON "identity"."user_sessions"("user_id", "status");
CREATE INDEX "user_sessions_refresh_family_id_idx" ON "identity"."user_sessions"("refresh_family_id");

ALTER TABLE "identity"."user_sessions"
  ADD CONSTRAINT "user_sessions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "identity"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "identity"."login_attempts" (
  "id" UUID NOT NULL,
  "user_id" UUID,
  "email" TEXT NOT NULL,
  "success" BOOLEAN NOT NULL,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "reason" TEXT,
  "attempted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "login_attempts_email_attempted_at_idx" ON "identity"."login_attempts"("email", "attempted_at" DESC);

CREATE TABLE "audit"."security_events" (
  "id" UUID NOT NULL,
  "tenant_id" UUID,
  "user_id" UUID,
  "session_id" UUID,
  "event_type" "audit"."security_event_type" NOT NULL,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "security_events_tenant_id_created_at_idx" ON "audit"."security_events"("tenant_id", "created_at" DESC);
CREATE INDEX "security_events_user_id_created_at_idx" ON "audit"."security_events"("user_id", "created_at" DESC);
CREATE INDEX "security_events_event_type_created_at_idx" ON "audit"."security_events"("event_type", "created_at" DESC);
