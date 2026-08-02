-- clinical medications domain — tenant isolation (Epic 3 / P0)

ALTER TABLE clinical.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.prescriptions FORCE ROW LEVEL SECURITY;

CREATE POLICY prescriptions_tenant_isolation ON clinical.prescriptions
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_medications FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_medications_tenant_isolation ON clinical.patient_medications
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.medication_doses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.medication_doses FORCE ROW LEVEL SECURITY;

CREATE POLICY medication_doses_tenant_isolation ON clinical.medication_doses
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.dose_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.dose_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY dose_logs_tenant_isolation ON clinical.dose_logs
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.medication_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.medication_reminders FORCE ROW LEVEL SECURITY;

CREATE POLICY medication_reminders_tenant_isolation ON clinical.medication_reminders
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.refill_requests FORCE ROW LEVEL SECURITY;

CREATE POLICY refill_requests_tenant_isolation ON clinical.refill_requests
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
