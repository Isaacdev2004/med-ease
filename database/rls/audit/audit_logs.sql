ALTER TABLE audit.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.audit_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_tenant_isolation ON audit.audit_logs
  FOR ALL
  USING (
    platform.is_system_request()
    OR (tenant_id IS NOT NULL AND platform.tenant_row_matches(tenant_id))
  )
  WITH CHECK (
    platform.is_system_request()
    OR (tenant_id IS NOT NULL AND platform.tenant_row_matches(tenant_id))
  );
