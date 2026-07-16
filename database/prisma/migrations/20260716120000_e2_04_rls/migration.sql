-- E2-04: PostgreSQL Row-Level Security for tenant isolation
-- Source files: database/rls/

-- ─── RLS helpers ────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION platform.is_system_request()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('app.system_request', true) = 'true';
$$;

CREATE OR REPLACE FUNCTION platform.set_system_request_context()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('app.system_request', 'true', true);
END;
$$;

CREATE OR REPLACE FUNCTION platform.tenant_matches(p_tenant_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT platform.is_system_request()
    OR (
      platform.current_tenant_id() IS NOT NULL
      AND p_tenant_id = platform.current_tenant_id()
    );
$$;

CREATE OR REPLACE FUNCTION platform.tenant_row_matches(p_row_tenant_id UUID)
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT platform.tenant_matches(p_row_tenant_id);
$$;

CREATE OR REPLACE FUNCTION platform.clear_request_context()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM set_config('app.tenant_id', '', true);
  PERFORM set_config('app.facility_id', '', true);
  PERFORM set_config('app.user_id', '', true);
  PERFORM set_config('app.role', '', true);
  PERFORM set_config('app.break_glass_patient_id', '', true);
  PERFORM set_config('app.system_request', '', true);
END;
$$;

-- ─── core.tenants ─────────────────────────────────────────────────────────────

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

-- ─── core.organizations ───────────────────────────────────────────────────────

ALTER TABLE core.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE core.organizations FORCE ROW LEVEL SECURITY;

CREATE POLICY organizations_tenant_isolation ON core.organizations
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

-- ─── identity (auth tables) ───────────────────────────────────────────────────

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

-- ─── audit.security_events ────────────────────────────────────────────────────

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
