-- E5-02: Inventory warehouses / items / stock movements
-- Prisma models: database/prisma/operations.prisma
-- RLS source: database/rls/operations/inventory.sql

CREATE TYPE "operations"."inventory_category" AS ENUM (
  'medication', 'reagent', 'consumable', 'equipment', 'supplies',
  'vaccine', 'controlled', 'asset', 'otc', 'narcotic'
);
CREATE TYPE "operations"."inventory_department" AS ENUM (
  'pharmacy', 'laboratory', 'radiology', 'icu', 'surgery',
  'general', 'biomedical', 'warehouse'
);
CREATE TYPE "operations"."inventory_item_status" AS ENUM (
  'active', 'low_stock', 'out_of_stock', 'expired', 'recalled', 'inactive'
);
CREATE TYPE "operations"."stock_movement_type" AS ENUM (
  'receive', 'issue', 'transfer', 'adjustment', 'return', 'count'
);

CREATE TABLE "operations"."warehouses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL DEFAULT '',
    "capacity" INTEGER NOT NULL DEFAULT 0,
    "utilization_percent" INTEGER NOT NULL DEFAULT 0,
    "zones" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "manager_name" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "warehouses_tenant_id_code_key"
  ON "operations"."warehouses"("tenant_id", "code");
CREATE INDEX "warehouses_tenant_id_facility_id_idx"
  ON "operations"."warehouses"("tenant_id", "facility_id");

CREATE TABLE "operations"."inventory_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "facility_id" UUID NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT NOT NULL DEFAULT '',
    "item_name" TEXT NOT NULL,
    "generic_name" TEXT,
    "category" "operations"."inventory_category" NOT NULL DEFAULT 'supplies',
    "department" "operations"."inventory_department" NOT NULL DEFAULT 'general',
    "manufacturer" TEXT NOT NULL DEFAULT '',
    "supplier_name" TEXT NOT NULL DEFAULT '',
    "unit" TEXT NOT NULL DEFAULT 'ea',
    "package_size" INTEGER NOT NULL DEFAULT 1,
    "purchase_price_cents" BIGINT NOT NULL DEFAULT 0,
    "selling_price_cents" BIGINT NOT NULL DEFAULT 0,
    "quantity_on_hand" INTEGER NOT NULL DEFAULT 0,
    "reserved_quantity" INTEGER NOT NULL DEFAULT 0,
    "reorder_level" INTEGER NOT NULL DEFAULT 0,
    "reorder_quantity" INTEGER NOT NULL DEFAULT 0,
    "maximum_stock" INTEGER NOT NULL DEFAULT 0,
    "minimum_stock" INTEGER NOT NULL DEFAULT 0,
    "expiry_date" DATE,
    "batch_number" TEXT,
    "storage_conditions" TEXT NOT NULL DEFAULT '',
    "shelf_location" TEXT NOT NULL DEFAULT '',
    "status" "operations"."inventory_item_status" NOT NULL DEFAULT 'active',
    "cold_chain" BOOLEAN NOT NULL DEFAULT false,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "inventory_items_tenant_id_sku_key"
  ON "operations"."inventory_items"("tenant_id", "sku");
CREATE INDEX "inventory_items_tenant_id_facility_id_status_idx"
  ON "operations"."inventory_items"("tenant_id", "facility_id", "status");
CREATE INDEX "inventory_items_tenant_id_warehouse_id_category_idx"
  ON "operations"."inventory_items"("tenant_id", "warehouse_id", "category");
CREATE INDEX "inventory_items_tenant_id_department_status_idx"
  ON "operations"."inventory_items"("tenant_id", "department", "status");

ALTER TABLE "operations"."inventory_items"
  ADD CONSTRAINT "inventory_items_warehouse_id_fkey"
  FOREIGN KEY ("warehouse_id") REFERENCES "operations"."warehouses"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "operations"."stock_movements" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "inventory_id" UUID NOT NULL,
    "item_name" TEXT NOT NULL,
    "type" "operations"."stock_movement_type" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "from_location" TEXT,
    "to_location" TEXT,
    "reference" TEXT,
    "performed_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "stock_movements_tenant_id_inventory_id_created_at_idx"
  ON "operations"."stock_movements"("tenant_id", "inventory_id", "created_at" DESC);
CREATE INDEX "stock_movements_tenant_id_type_created_at_idx"
  ON "operations"."stock_movements"("tenant_id", "type", "created_at" DESC);

ALTER TABLE "operations"."stock_movements"
  ADD CONSTRAINT "stock_movements_inventory_id_fkey"
  FOREIGN KEY ("inventory_id") REFERENCES "operations"."inventory_items"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

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
