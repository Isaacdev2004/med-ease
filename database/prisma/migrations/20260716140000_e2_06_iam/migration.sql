-- E2-06: IAM domain tables and identity/core column extensions

-- ─── User & organization extensions ─────────────────────────────────────────

ALTER TABLE identity.users
  ADD COLUMN IF NOT EXISTS facility_id UUID,
  ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE core.organizations
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'health_system',
  ADD COLUMN IF NOT EXISTS parent_id UUID;

CREATE INDEX IF NOT EXISTS organizations_parent_id_idx ON core.organizations(parent_id);

-- ─── IAM tables (identity schema) ───────────────────────────────────────────

CREATE TABLE identity.iam_roles (
  id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tenant_id UUID,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL,
  CONSTRAINT iam_roles_pkey PRIMARY KEY (id)
);

CREATE INDEX iam_roles_tenant_id_idx ON identity.iam_roles(tenant_id);

CREATE TABLE identity.user_role_assignments (
  user_id UUID NOT NULL,
  role_id UUID NOT NULL,
  assigned_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_role_assignments_pkey PRIMARY KEY (user_id, role_id)
);

ALTER TABLE identity.user_role_assignments
  ADD CONSTRAINT user_role_assignments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE identity.user_role_assignments
  ADD CONSTRAINT user_role_assignments_role_id_fkey
  FOREIGN KEY (role_id) REFERENCES identity.iam_roles(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE identity.iam_policies (
  id UUID NOT NULL,
  tenant_id UUID,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  effect TEXT NOT NULL,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  conditions JSONB,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL,
  CONSTRAINT iam_policies_pkey PRIMARY KEY (id)
);

CREATE INDEX iam_policies_tenant_id_idx ON identity.iam_policies(tenant_id);

CREATE TABLE identity.mfa_devices (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  method TEXT NOT NULL,
  label TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  registered_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP(3),
  CONSTRAINT mfa_devices_pkey PRIMARY KEY (id)
);

CREATE INDEX mfa_devices_user_id_idx ON identity.mfa_devices(user_id);

ALTER TABLE identity.mfa_devices
  ADD CONSTRAINT mfa_devices_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE identity.trusted_devices (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  platform TEXT NOT NULL,
  trust_score INTEGER NOT NULL DEFAULT 100,
  registered_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT trusted_devices_pkey PRIMARY KEY (id)
);

CREATE INDEX trusted_devices_user_id_idx ON identity.trusted_devices(user_id);

ALTER TABLE identity.trusted_devices
  ADD CONSTRAINT trusted_devices_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE identity.oauth_clients (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  client_secret TEXT NOT NULL,
  redirect_uris TEXT[] NOT NULL,
  scopes TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT oauth_clients_pkey PRIMARY KEY (id)
);

CREATE INDEX oauth_clients_tenant_id_idx ON identity.oauth_clients(tenant_id);

CREATE TABLE identity.api_keys (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  prefix TEXT NOT NULL,
  scopes TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP(3),
  last_used_at TIMESTAMP(3),
  CONSTRAINT api_keys_pkey PRIMARY KEY (id)
);

CREATE INDEX api_keys_tenant_id_idx ON identity.api_keys(tenant_id);

CREATE TABLE identity.consent_records (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  grantee_id UUID NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  granted_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP(3),
  revoked_at TIMESTAMP(3),
  CONSTRAINT consent_records_pkey PRIMARY KEY (id)
);

CREATE INDEX consent_records_grantee_id_idx ON identity.consent_records(grantee_id);
CREATE INDEX consent_records_patient_id_idx ON identity.consent_records(patient_id);

CREATE TABLE identity.delegation_records (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  delegator_id UUID NOT NULL,
  delegate_id UUID NOT NULL,
  scope TEXT NOT NULL,
  starts_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ends_at TIMESTAMP(3) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT delegation_records_pkey PRIMARY KEY (id)
);

CREATE INDEX delegation_records_delegator_id_idx ON identity.delegation_records(delegator_id);
CREATE INDEX delegation_records_delegate_id_idx ON identity.delegation_records(delegate_id);

CREATE TABLE identity.proxy_access (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  proxy_user_id UUID NOT NULL,
  relationship TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  granted_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT proxy_access_pkey PRIMARY KEY (id)
);

CREATE INDEX proxy_access_patient_id_idx ON identity.proxy_access(patient_id);

CREATE TABLE identity.break_glass_events (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  patient_id UUID,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP(3),
  reviewed_by UUID,
  CONSTRAINT break_glass_events_pkey PRIMARY KEY (id)
);

CREATE INDEX break_glass_events_user_id_status_idx ON identity.break_glass_events(user_id, status);

CREATE TABLE identity.risk_scores (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  score INTEGER NOT NULL,
  factors TEXT[] NOT NULL,
  level TEXT NOT NULL,
  assessed_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT risk_scores_pkey PRIMARY KEY (id)
);

CREATE INDEX risk_scores_user_id_assessed_at_idx ON identity.risk_scores(user_id, assessed_at DESC);

CREATE TABLE identity.saml_providers (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT saml_providers_pkey PRIMARY KEY (id)
);

CREATE INDEX saml_providers_tenant_id_idx ON identity.saml_providers(tenant_id);

CREATE TABLE identity.oidc_providers (
  id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  CONSTRAINT oidc_providers_pkey PRIMARY KEY (id)
);

CREATE INDEX oidc_providers_tenant_id_idx ON identity.oidc_providers(tenant_id);

CREATE TABLE identity.iam_favorites (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT iam_favorites_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX iam_favorites_user_id_entity_type_entity_id_key
  ON identity.iam_favorites(user_id, entity_type, entity_id);

-- ─── Audit schema tables ────────────────────────────────────────────────────

CREATE TABLE audit.iam_audit_logs (
  id UUID NOT NULL,
  tenant_id UUID,
  action TEXT NOT NULL,
  actor_id UUID NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  outcome TEXT NOT NULL DEFAULT 'success',
  ip_address TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT iam_audit_logs_pkey PRIMARY KEY (id)
);

CREATE INDEX iam_audit_logs_tenant_id_created_at_idx
  ON audit.iam_audit_logs(tenant_id, created_at DESC);
CREATE INDEX iam_audit_logs_actor_id_created_at_idx
  ON audit.iam_audit_logs(actor_id, created_at DESC);

CREATE TABLE audit.security_incidents (
  id UUID NOT NULL,
  tenant_id UUID,
  title TEXT NOT NULL,
  severity TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  detected_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP(3),
  CONSTRAINT security_incidents_pkey PRIMARY KEY (id)
);

CREATE INDEX security_incidents_status_detected_at_idx
  ON audit.security_incidents(status, detected_at DESC);

-- ─── Row-Level Security ─────────────────────────────────────────────────────

ALTER TABLE identity.iam_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.iam_roles FORCE ROW LEVEL SECURITY;

CREATE POLICY iam_roles_tenant_isolation ON identity.iam_roles
  FOR ALL
  USING (
    platform.is_system_request()
    OR tenant_id IS NULL
    OR platform.tenant_row_matches(tenant_id)
  )
  WITH CHECK (
    platform.is_system_request()
    OR tenant_id IS NULL
    OR platform.tenant_row_matches(tenant_id)
  );

ALTER TABLE identity.user_role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.user_role_assignments FORCE ROW LEVEL SECURITY;

CREATE POLICY user_role_assignments_tenant_isolation ON identity.user_role_assignments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM identity.users u
      WHERE u.id = user_role_assignments.user_id
        AND platform.tenant_row_matches(u.tenant_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM identity.users u
      WHERE u.id = user_role_assignments.user_id
        AND platform.tenant_row_matches(u.tenant_id)
    )
  );

ALTER TABLE identity.iam_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.iam_policies FORCE ROW LEVEL SECURITY;

CREATE POLICY iam_policies_tenant_isolation ON identity.iam_policies
  FOR ALL
  USING (
    platform.is_system_request()
    OR tenant_id IS NULL
    OR platform.tenant_row_matches(tenant_id)
  )
  WITH CHECK (
    platform.is_system_request()
    OR tenant_id IS NULL
    OR platform.tenant_row_matches(tenant_id)
  );

ALTER TABLE identity.mfa_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.mfa_devices FORCE ROW LEVEL SECURITY;

CREATE POLICY mfa_devices_tenant_isolation ON identity.mfa_devices
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.trusted_devices FORCE ROW LEVEL SECURITY;

CREATE POLICY trusted_devices_tenant_isolation ON identity.trusted_devices
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.oauth_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.oauth_clients FORCE ROW LEVEL SECURITY;

CREATE POLICY oauth_clients_tenant_isolation ON identity.oauth_clients
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.api_keys FORCE ROW LEVEL SECURITY;

CREATE POLICY api_keys_tenant_isolation ON identity.api_keys
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.consent_records FORCE ROW LEVEL SECURITY;

CREATE POLICY consent_records_tenant_isolation ON identity.consent_records
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.delegation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.delegation_records FORCE ROW LEVEL SECURITY;

CREATE POLICY delegation_records_tenant_isolation ON identity.delegation_records
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.proxy_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.proxy_access FORCE ROW LEVEL SECURITY;

CREATE POLICY proxy_access_tenant_isolation ON identity.proxy_access
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.break_glass_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.break_glass_events FORCE ROW LEVEL SECURITY;

CREATE POLICY break_glass_events_tenant_isolation ON identity.break_glass_events
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.risk_scores FORCE ROW LEVEL SECURITY;

CREATE POLICY risk_scores_tenant_isolation ON identity.risk_scores
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.saml_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.saml_providers FORCE ROW LEVEL SECURITY;

CREATE POLICY saml_providers_tenant_isolation ON identity.saml_providers
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.oidc_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.oidc_providers FORCE ROW LEVEL SECURITY;

CREATE POLICY oidc_providers_tenant_isolation ON identity.oidc_providers
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE identity.iam_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity.iam_favorites FORCE ROW LEVEL SECURITY;

CREATE POLICY iam_favorites_tenant_isolation ON identity.iam_favorites
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM identity.users u
      WHERE u.id = iam_favorites.user_id
        AND platform.tenant_row_matches(u.tenant_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM identity.users u
      WHERE u.id = iam_favorites.user_id
        AND platform.tenant_row_matches(u.tenant_id)
    )
  );

ALTER TABLE audit.iam_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.iam_audit_logs FORCE ROW LEVEL SECURITY;

CREATE POLICY iam_audit_logs_tenant_isolation ON audit.iam_audit_logs
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

ALTER TABLE audit.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit.security_incidents FORCE ROW LEVEL SECURITY;

CREATE POLICY security_incidents_tenant_isolation ON audit.security_incidents
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
