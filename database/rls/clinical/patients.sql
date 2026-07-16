-- clinical.* patient tables — tenant isolation (Epic 3 / P1)

ALTER TABLE clinical.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patients FORCE ROW LEVEL SECURITY;

CREATE POLICY patients_tenant_isolation ON clinical.patients
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_identifiers FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_identifiers_tenant_isolation ON clinical.patient_identifiers
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_contacts FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_contacts_tenant_isolation ON clinical.patient_contacts
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_addresses FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_addresses_tenant_isolation ON clinical.patient_addresses
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_emergency_contacts FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_emergency_contacts_tenant_isolation ON clinical.patient_emergency_contacts
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_allergies FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_allergies_tenant_isolation ON clinical.patient_allergies
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_preferences FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_preferences_tenant_isolation ON clinical.patient_preferences
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
