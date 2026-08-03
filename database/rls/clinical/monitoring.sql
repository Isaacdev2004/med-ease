-- clinical.monitoring_* / vital_signs / device_assignments — tenant isolation (Epic 4 / P1)

ALTER TABLE clinical.monitoring_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.monitoring_devices FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_devices_tenant_isolation ON clinical.monitoring_devices
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.device_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.device_assignments FORCE ROW LEVEL SECURITY;
CREATE POLICY device_assignments_tenant_isolation ON clinical.device_assignments
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.vital_signs FORCE ROW LEVEL SECURITY;
CREATE POLICY vital_signs_tenant_isolation ON clinical.vital_signs
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.monitoring_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.monitoring_observations FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_observations_tenant_isolation ON clinical.monitoring_observations
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.monitoring_alerts FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_alerts_tenant_isolation ON clinical.monitoring_alerts
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.monitoring_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.monitoring_programs FORCE ROW LEVEL SECURITY;
CREATE POLICY monitoring_programs_tenant_isolation ON clinical.monitoring_programs
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.early_warning_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.early_warning_scores FORCE ROW LEVEL SECURITY;
CREATE POLICY early_warning_scores_tenant_isolation ON clinical.early_warning_scores
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
