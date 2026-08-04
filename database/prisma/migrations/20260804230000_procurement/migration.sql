-- E5-03: Procurement suppliers / purchase orders (inventory MVP)
-- Prisma models: database/prisma/operations.prisma
-- RLS source: database/rls/operations/procurement.sql

CREATE TYPE "operations"."purchase_order_status" AS ENUM (
  'draft', 'pending_approval', 'approved', 'ordered', 'partial', 'received', 'cancelled'
);

CREATE TABLE "operations"."suppliers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contact_email" TEXT NOT NULL DEFAULT '',
    "contact_phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "on_time_delivery_rate" INTEGER NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "categories" "operations"."inventory_category"[] NOT NULL DEFAULT ARRAY[]::"operations"."inventory_category"[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "suppliers_tenant_id_status_idx"
  ON "operations"."suppliers"("tenant_id", "status");
CREATE INDEX "suppliers_tenant_id_name_idx"
  ON "operations"."suppliers"("tenant_id", "name");

CREATE TABLE "operations"."purchase_orders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID,
    "supplier_id" UUID NOT NULL,
    "po_number" TEXT NOT NULL,
    "department" "operations"."inventory_department" NOT NULL DEFAULT 'general',
    "status" "operations"."purchase_order_status" NOT NULL DEFAULT 'draft',
    "subtotal_cents" BIGINT NOT NULL DEFAULT 0,
    "tax_cents" BIGINT NOT NULL DEFAULT 0,
    "total_cents" BIGINT NOT NULL DEFAULT 0,
    "requested_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "order_date" TIMESTAMP(3),
    "expected_delivery" TIMESTAMP(3),
    "received_date" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "purchase_orders_tenant_id_po_number_key"
  ON "operations"."purchase_orders"("tenant_id", "po_number");
CREATE INDEX "purchase_orders_tenant_id_status_idx"
  ON "operations"."purchase_orders"("tenant_id", "status");
CREATE INDEX "purchase_orders_tenant_id_supplier_id_idx"
  ON "operations"."purchase_orders"("tenant_id", "supplier_id");
CREATE INDEX "purchase_orders_tenant_id_department_status_idx"
  ON "operations"."purchase_orders"("tenant_id", "department", "status");

ALTER TABLE "operations"."purchase_orders"
  ADD CONSTRAINT "purchase_orders_supplier_id_fkey"
  FOREIGN KEY ("supplier_id") REFERENCES "operations"."suppliers"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "operations"."purchase_order_lines" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "purchase_order_id" UUID NOT NULL,
    "inventory_id" UUID,
    "sku" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price_cents" BIGINT NOT NULL,
    "received_quantity" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "purchase_order_lines_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "purchase_order_lines_tenant_id_purchase_order_id_idx"
  ON "operations"."purchase_order_lines"("tenant_id", "purchase_order_id");

ALTER TABLE "operations"."purchase_order_lines"
  ADD CONSTRAINT "purchase_order_lines_purchase_order_id_fkey"
  FOREIGN KEY ("purchase_order_id") REFERENCES "operations"."purchase_orders"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "operations"."purchase_order_lines"
  ADD CONSTRAINT "purchase_order_lines_inventory_id_fkey"
  FOREIGN KEY ("inventory_id") REFERENCES "operations"."inventory_items"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

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
