ALTER TABLE audit.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.security_events FORCE ROW LEVEL SECURITY;

CREATE POLICY security_events_tenant_isolation ON audit.security_events
  FOR ALL
  USING (
    platform.is_system_request()
    OR (
      tenant_id IS NOT NULL
      AND platform.tenant_row_matches(tenant_id)
    )
  )
  WITH CHECK (
    platform.is_system_request()
    OR (
      tenant_id IS NOT NULL
      AND platform.tenant_row_matches(tenant_id)
    )
  );
