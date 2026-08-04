-- operations procurement — tenant isolation (Epic 5)

ALTER TABLE operations.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.suppliers FORCE ROW LEVEL SECURITY;
CREATE POLICY suppliers_tenant_isolation ON operations.suppliers
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.purchase_orders FORCE ROW LEVEL SECURITY;
CREATE POLICY purchase_orders_tenant_isolation ON operations.purchase_orders
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.purchase_order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.purchase_order_lines FORCE ROW LEVEL SECURITY;
CREATE POLICY purchase_order_lines_tenant_isolation ON operations.purchase_order_lines
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
