-- clinical.directory_* / medication_catalog — tenant isolation (Epic 3 / P0)

ALTER TABLE clinical.directory_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.directory_providers FORCE ROW LEVEL SECURITY;

CREATE POLICY directory_providers_tenant_isolation ON clinical.directory_providers
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.directory_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.directory_favorites FORCE ROW LEVEL SECURITY;

CREATE POLICY directory_favorites_tenant_isolation ON clinical.directory_favorites
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.medication_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.medication_catalog FORCE ROW LEVEL SECURITY;

CREATE POLICY medication_catalog_tenant_isolation ON clinical.medication_catalog
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.medication_library_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.medication_library_favorites FORCE ROW LEVEL SECURITY;

CREATE POLICY medication_library_favorites_tenant_isolation ON clinical.medication_library_favorites
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
