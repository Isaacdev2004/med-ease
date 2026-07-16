ALTER TABLE core.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.tenants FORCE ROW LEVEL SECURITY;

CREATE POLICY tenants_select ON core.tenants
  FOR SELECT
  USING (platform.tenant_row_matches(id));

CREATE POLICY tenants_insert ON core.tenants
  FOR INSERT
  WITH CHECK (platform.is_system_request());

CREATE POLICY tenants_update ON core.tenants
  FOR UPDATE
  USING (platform.tenant_row_matches(id))
  WITH CHECK (platform.tenant_row_matches(id));

CREATE POLICY tenants_delete ON core.tenants
  FOR DELETE
  USING (platform.is_system_request());
