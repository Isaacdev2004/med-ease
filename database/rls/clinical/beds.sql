-- clinical.beds / bed_assignments — tenant isolation (Epic 3 / P0)

ALTER TABLE clinical.beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.beds FORCE ROW LEVEL SECURITY;

CREATE POLICY beds_tenant_isolation ON clinical.beds
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.bed_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.bed_assignments FORCE ROW LEVEL SECURITY;

CREATE POLICY bed_assignments_tenant_isolation ON clinical.bed_assignments
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
