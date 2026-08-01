-- clinical.appointments — tenant isolation (Epic 3 / P1)

ALTER TABLE clinical.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.appointments FORCE ROW LEVEL SECURITY;

CREATE POLICY appointments_tenant_isolation ON clinical.appointments
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
