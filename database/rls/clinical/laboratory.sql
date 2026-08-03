-- clinical.lab_* — tenant isolation (Epic 4 / P1)

ALTER TABLE clinical.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.lab_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_orders_tenant_isolation ON clinical.lab_orders
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.lab_specimens ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.lab_specimens FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_specimens_tenant_isolation ON clinical.lab_specimens
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.lab_diagnostic_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.lab_diagnostic_reports FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_diagnostic_reports_tenant_isolation ON clinical.lab_diagnostic_reports
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.lab_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.lab_observations FORCE ROW LEVEL SECURITY;
CREATE POLICY lab_observations_tenant_isolation ON clinical.lab_observations
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
