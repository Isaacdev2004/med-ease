-- operations inventory — tenant isolation (Epic 5)

ALTER TABLE operations.warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.warehouses FORCE ROW LEVEL SECURITY;
CREATE POLICY warehouses_tenant_isolation ON operations.warehouses
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.inventory_items FORCE ROW LEVEL SECURITY;
CREATE POLICY inventory_items_tenant_isolation ON operations.inventory_items
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.stock_movements FORCE ROW LEVEL SECURITY;
CREATE POLICY stock_movements_tenant_isolation ON operations.stock_movements
  FOR ALL USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
