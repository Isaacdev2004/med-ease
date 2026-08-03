-- clinical.admissions / patient_transfers — tenant isolation (Epic 3 / P0)

ALTER TABLE clinical.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.admissions FORCE ROW LEVEL SECURITY;

CREATE POLICY admissions_tenant_isolation ON clinical.admissions
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_transfers FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_transfers_tenant_isolation ON clinical.patient_transfers
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
