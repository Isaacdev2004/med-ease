-- financial.* billing tables — tenant isolation (Epic 5)

ALTER TABLE financial.insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.insurance_policies FORCE ROW LEVEL SECURITY;
CREATE POLICY insurance_policies_tenant_isolation ON financial.insurance_policies
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.patient_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.patient_invoices FORCE ROW LEVEL SECURITY;
CREATE POLICY patient_invoices_tenant_isolation ON financial.patient_invoices
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.invoice_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.invoice_line_items FORCE ROW LEVEL SECURITY;
CREATE POLICY invoice_line_items_tenant_isolation ON financial.invoice_line_items
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.payments FORCE ROW LEVEL SECURITY;
CREATE POLICY payments_tenant_isolation ON financial.payments
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.receipts FORCE ROW LEVEL SECURITY;
CREATE POLICY receipts_tenant_isolation ON financial.receipts
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.refunds FORCE ROW LEVEL SECURITY;
CREATE POLICY refunds_tenant_isolation ON financial.refunds
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.insurance_claims FORCE ROW LEVEL SECURITY;
CREATE POLICY insurance_claims_tenant_isolation ON financial.insurance_claims
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
