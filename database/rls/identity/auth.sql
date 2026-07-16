ALTER TABLE identity.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.users FORCE ROW LEVEL SECURITY;

CREATE POLICY users_tenant_isolation ON identity.users
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.user_sessions FORCE ROW LEVEL SECURITY;

CREATE POLICY user_sessions_tenant_isolation ON identity.user_sessions
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.login_attempts FORCE ROW LEVEL SECURITY;

CREATE POLICY login_attempts_system_only ON identity.login_attempts
  FOR ALL
  USING (platform.is_system_request())
  WITH CHECK (platform.is_system_request());
