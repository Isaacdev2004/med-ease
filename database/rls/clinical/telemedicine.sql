-- clinical.telemedicine_* / session_* / waiting_room_entries — tenant isolation (Epic 4 / P2)

ALTER TABLE clinical.telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.telemedicine_sessions FORCE ROW LEVEL SECURITY;
CREATE POLICY telemedicine_sessions_tenant_isolation ON clinical.telemedicine_sessions
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.session_participants FORCE ROW LEVEL SECURITY;
CREATE POLICY session_participants_tenant_isolation ON clinical.session_participants
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.session_messages FORCE ROW LEVEL SECURITY;
CREATE POLICY session_messages_tenant_isolation ON clinical.session_messages
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.session_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.session_attachments FORCE ROW LEVEL SECURITY;
CREATE POLICY session_attachments_tenant_isolation ON clinical.session_attachments
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.session_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.session_recordings FORCE ROW LEVEL SECURITY;
CREATE POLICY session_recordings_tenant_isolation ON clinical.session_recordings
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.waiting_room_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.waiting_room_entries FORCE ROW LEVEL SECURITY;
CREATE POLICY waiting_room_entries_tenant_isolation ON clinical.waiting_room_entries
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.session_clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.session_clinical_notes FORCE ROW LEVEL SECURITY;
CREATE POLICY session_clinical_notes_tenant_isolation ON clinical.session_clinical_notes
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
