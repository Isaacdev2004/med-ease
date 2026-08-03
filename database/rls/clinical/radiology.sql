-- clinical.radiology_* / imaging_devices — tenant isolation (Epic 4 / P1)

ALTER TABLE clinical.radiology_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.radiology_studies FORCE ROW LEVEL SECURITY;
CREATE POLICY radiology_studies_tenant_isolation ON clinical.radiology_studies
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.radiology_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.radiology_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY radiology_orders_tenant_isolation ON clinical.radiology_orders
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.radiology_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.radiology_reports FORCE ROW LEVEL SECURITY;
CREATE POLICY radiology_reports_tenant_isolation ON clinical.radiology_reports
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.imaging_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.imaging_devices FORCE ROW LEVEL SECURITY;
CREATE POLICY imaging_devices_tenant_isolation ON clinical.imaging_devices
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
