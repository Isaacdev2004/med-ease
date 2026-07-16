ALTER TABLE core.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.organizations FORCE ROW LEVEL SECURITY;

CREATE POLICY organizations_tenant_isolation ON core.organizations
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
