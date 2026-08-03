-- E4-08: Telemedicine sessions / participants / messages / waiting room
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/telemedicine.sql

CREATE TYPE "clinical"."telemedicine_session_status" AS ENUM (
  'scheduled', 'waiting', 'in_progress', 'completed', 'cancelled', 'no_show', 'failed'
);
CREATE TYPE "clinical"."telemedicine_session_type" AS ENUM (
  'consultation', 'follow_up', 'urgent', 'specialist', 'group', 'interpreter'
);
CREATE TYPE "clinical"."telemedicine_platform" AS ENUM (
  'webrtc', 'twilio', 'agora', 'daily', 'zoom', 'teams'
);
CREATE TYPE "clinical"."telemedicine_recording_status" AS ENUM (
  'none', 'pending_consent', 'recording', 'stopped', 'processing', 'available'
);
CREATE TYPE "clinical"."telemedicine_participant_role" AS ENUM (
  'patient', 'clinician', 'nurse', 'interpreter', 'caregiver', 'observer'
);
CREATE TYPE "clinical"."telemedicine_connection_quality" AS ENUM (
  'excellent', 'good', 'fair', 'poor', 'disconnected'
);
CREATE TYPE "clinical"."telemedicine_message_status" AS ENUM (
  'sent', 'delivered', 'read', 'failed'
);
CREATE TYPE "clinical"."telemedicine_attachment_type" AS ENUM (
  'image', 'pdf', 'lab', 'radiology', 'prescription', 'consent', 'document'
);
CREATE TYPE "clinical"."telemedicine_waiting_status" AS ENUM (
  'waiting', 'admitted', 'rejected', 'left'
);
CREATE TYPE "clinical"."telemedicine_waiting_priority" AS ENUM (
  'normal', 'urgent', 'high'
);
CREATE TYPE "clinical"."telemedicine_note_status" AS ENUM (
  'draft', 'final', 'signed'
);

CREATE TABLE "clinical"."telemedicine_sessions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "appointment_id" UUID,
    "encounter_id" UUID,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "clinician_id" UUID NOT NULL,
    "clinician_name" TEXT NOT NULL,
    "facility_id" UUID,
    "meeting_number" TEXT NOT NULL,
    "meeting_password" TEXT,
    "platform" "clinical"."telemedicine_platform" NOT NULL DEFAULT 'webrtc',
    "room_id" TEXT NOT NULL,
    "session_type" "clinical"."telemedicine_session_type" NOT NULL DEFAULT 'consultation',
    "specialty" TEXT NOT NULL DEFAULT '',
    "scheduled_start" TIMESTAMPTZ(3) NOT NULL,
    "scheduled_end" TIMESTAMPTZ(3) NOT NULL,
    "actual_start" TIMESTAMPTZ(3),
    "actual_end" TIMESTAMPTZ(3),
    "duration_minutes" INTEGER,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "language" TEXT NOT NULL DEFAULT 'en',
    "interpreter_required" BOOLEAN NOT NULL DEFAULT false,
    "status" "clinical"."telemedicine_session_status" NOT NULL DEFAULT 'scheduled',
    "recording_status" "clinical"."telemedicine_recording_status" NOT NULL DEFAULT 'none',
    "waiting_room_enabled" BOOLEAN NOT NULL DEFAULT true,
    "encryption" BOOLEAN NOT NULL DEFAULT true,
    "quality_score" DOUBLE PRECISION,
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "telemedicine_sessions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "telemedicine_sessions_tenant_id_meeting_number_key"
  ON "clinical"."telemedicine_sessions"("tenant_id", "meeting_number");
CREATE INDEX "telemedicine_sessions_tenant_id_patient_id_scheduled_start_idx"
  ON "clinical"."telemedicine_sessions"("tenant_id", "patient_id", "scheduled_start" DESC);
CREATE INDEX "telemedicine_sessions_tenant_id_clinician_id_status_idx"
  ON "clinical"."telemedicine_sessions"("tenant_id", "clinician_id", "status");
CREATE INDEX "telemedicine_sessions_tenant_id_facility_id_status_idx"
  ON "clinical"."telemedicine_sessions"("tenant_id", "facility_id", "status");
CREATE INDEX "telemedicine_sessions_tenant_id_status_scheduled_start_idx"
  ON "clinical"."telemedicine_sessions"("tenant_id", "status", "scheduled_start");

ALTER TABLE "clinical"."telemedicine_sessions"
  ADD CONSTRAINT "telemedicine_sessions_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "clinical"."session_participants" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "user_id" UUID,
    "name" TEXT NOT NULL,
    "role" "clinical"."telemedicine_participant_role" NOT NULL,
    "joined_at" TIMESTAMPTZ(3),
    "left_at" TIMESTAMPTZ(3),
    "camera_on" BOOLEAN NOT NULL DEFAULT false,
    "microphone_on" BOOLEAN NOT NULL DEFAULT false,
    "screen_sharing" BOOLEAN NOT NULL DEFAULT false,
    "connection_quality" "clinical"."telemedicine_connection_quality" NOT NULL DEFAULT 'good',
    "device_type" TEXT NOT NULL DEFAULT '',
    "browser" TEXT NOT NULL DEFAULT '',
    "network_type" TEXT NOT NULL DEFAULT '',
    "permissions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "session_participants_tenant_id_session_id_idx"
  ON "clinical"."session_participants"("tenant_id", "session_id");

ALTER TABLE "clinical"."session_participants"
  ADD CONSTRAINT "session_participants_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "clinical"."telemedicine_sessions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."session_messages" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "sender_id" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "receiver_id" TEXT,
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_status" "clinical"."telemedicine_message_status" NOT NULL DEFAULT 'sent',
    "read_at" TIMESTAMPTZ(3),
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "session_messages_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "session_messages_tenant_id_session_id_sent_at_idx"
  ON "clinical"."session_messages"("tenant_id", "session_id", "sent_at" DESC);

ALTER TABLE "clinical"."session_messages"
  ADD CONSTRAINT "session_messages_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "clinical"."telemedicine_sessions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."session_attachments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "clinical"."telemedicine_attachment_type" NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "session_attachments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "session_attachments_tenant_id_session_id_idx"
  ON "clinical"."session_attachments"("tenant_id", "session_id");

ALTER TABLE "clinical"."session_attachments"
  ADD CONSTRAINT "session_attachments_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "clinical"."telemedicine_sessions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."session_recordings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "consent_given" BOOLEAN NOT NULL DEFAULT false,
    "status" "clinical"."telemedicine_recording_status" NOT NULL DEFAULT 'none',
    "duration_seconds" INTEGER,
    "storage_url" TEXT,
    "retention_days" INTEGER NOT NULL DEFAULT 30,
    "transcription" TEXT,
    "started_at" TIMESTAMPTZ(3),
    "stopped_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "session_recordings_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "session_recordings_tenant_id_session_id_idx"
  ON "clinical"."session_recordings"("tenant_id", "session_id");

ALTER TABLE "clinical"."session_recordings"
  ADD CONSTRAINT "session_recordings_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "clinical"."telemedicine_sessions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."waiting_room_entries" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "status" "clinical"."telemedicine_waiting_status" NOT NULL DEFAULT 'waiting',
    "joined_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "admitted_at" TIMESTAMPTZ(3),
    "estimated_wait_minutes" INTEGER NOT NULL DEFAULT 5,
    "priority" "clinical"."telemedicine_waiting_priority" NOT NULL DEFAULT 'normal',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "waiting_room_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "waiting_room_entries_tenant_id_session_id_status_idx"
  ON "clinical"."waiting_room_entries"("tenant_id", "session_id", "status");
CREATE INDEX "waiting_room_entries_tenant_id_status_joined_at_idx"
  ON "clinical"."waiting_room_entries"("tenant_id", "status", "joined_at");

ALTER TABLE "clinical"."waiting_room_entries"
  ADD CONSTRAINT "waiting_room_entries_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "clinical"."telemedicine_sessions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."session_clinical_notes" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "clinician_id" UUID NOT NULL,
    "subjective" TEXT NOT NULL DEFAULT '',
    "objective" TEXT NOT NULL DEFAULT '',
    "assessment" TEXT NOT NULL DEFAULT '',
    "plan" TEXT NOT NULL DEFAULT '',
    "diagnosis" TEXT,
    "treatment" TEXT,
    "recommendations" TEXT,
    "follow_up" TEXT,
    "status" "clinical"."telemedicine_note_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "session_clinical_notes_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "session_clinical_notes_tenant_id_session_id_idx"
  ON "clinical"."session_clinical_notes"("tenant_id", "session_id");

ALTER TABLE "clinical"."session_clinical_notes"
  ADD CONSTRAINT "session_clinical_notes_session_id_fkey"
  FOREIGN KEY ("session_id") REFERENCES "clinical"."telemedicine_sessions"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "clinical"."telemedicine_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."telemedicine_sessions" FORCE ROW LEVEL SECURITY;
CREATE POLICY telemedicine_sessions_tenant_isolation ON "clinical"."telemedicine_sessions"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."session_participants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."session_participants" FORCE ROW LEVEL SECURITY;
CREATE POLICY session_participants_tenant_isolation ON "clinical"."session_participants"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."session_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."session_messages" FORCE ROW LEVEL SECURITY;
CREATE POLICY session_messages_tenant_isolation ON "clinical"."session_messages"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."session_attachments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."session_attachments" FORCE ROW LEVEL SECURITY;
CREATE POLICY session_attachments_tenant_isolation ON "clinical"."session_attachments"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."session_recordings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."session_recordings" FORCE ROW LEVEL SECURITY;
CREATE POLICY session_recordings_tenant_isolation ON "clinical"."session_recordings"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."waiting_room_entries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."waiting_room_entries" FORCE ROW LEVEL SECURITY;
CREATE POLICY waiting_room_entries_tenant_isolation ON "clinical"."waiting_room_entries"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."session_clinical_notes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."session_clinical_notes" FORCE ROW LEVEL SECURITY;
CREATE POLICY session_clinical_notes_tenant_isolation ON "clinical"."session_clinical_notes"
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
