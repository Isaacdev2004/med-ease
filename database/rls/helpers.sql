-- Shared RLS helpers (applied in E2-04 migration)

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
