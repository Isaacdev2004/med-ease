-- Application role for RLS-enforced connections.
-- Supabase `postgres` is a superuser and bypasses RLS; integration tests SET ROLE medease_app.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'medease_app') THEN
    CREATE ROLE medease_app NOINHERIT;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA core, identity, clinical, operations, intelligence, platform, audit, integration
  TO medease_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA identity TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA clinical TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA operations TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA intelligence TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA platform TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA audit TO medease_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA integration TO medease_app;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA platform TO medease_app;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA identity TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA clinical TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA operations TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA intelligence TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA platform TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA audit TO medease_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA integration TO medease_app;

GRANT medease_app TO postgres;
