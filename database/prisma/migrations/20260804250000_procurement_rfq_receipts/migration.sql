-- E5-05: Procurement RFQs + goods receipts
CREATE TYPE "operations"."rfq_status" AS ENUM ('draft', 'open', 'closed', 'awarded', 'cancelled');
CREATE TYPE "operations"."rfq_response_status" AS ENUM ('submitted', 'shortlisted', 'awarded', 'declined');
CREATE TYPE "operations"."goods_receipt_status" AS ENUM ('pending', 'partial', 'complete', 'rejected');

CREATE TABLE "operations"."rfqs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "rfq_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL DEFAULT 'general',
    "status" "operations"."rfq_status" NOT NULL DEFAULT 'draft',
    "requisition_id" UUID,
    "deadline" TIMESTAMP(3) NOT NULL,
    "awarded_supplier_id" UUID,
    "invited_supplier_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rfqs_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "rfqs_tenant_id_rfq_number_key" ON "operations"."rfqs"("tenant_id", "rfq_number");
CREATE INDEX "rfqs_tenant_id_status_idx" ON "operations"."rfqs"("tenant_id", "status");
CREATE INDEX "rfqs_tenant_id_department_status_idx" ON "operations"."rfqs"("tenant_id", "department", "status");

CREATE TABLE "operations"."rfq_lines" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'ea',
    "specifications" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "rfq_lines_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "rfq_lines_tenant_id_rfq_id_idx" ON "operations"."rfq_lines"("tenant_id", "rfq_id");
ALTER TABLE "operations"."rfq_lines" ADD CONSTRAINT "rfq_lines_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "operations"."rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "operations"."rfq_responses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "rfq_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "total_quote_cents" BIGINT NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'EUR',
    "valid_until" TIMESTAMP(3) NOT NULL,
    "rank" INTEGER,
    "status" "operations"."rfq_response_status" NOT NULL DEFAULT 'submitted',
    "line_quotes" JSONB NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rfq_responses_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "rfq_responses_tenant_id_rfq_id_idx" ON "operations"."rfq_responses"("tenant_id", "rfq_id");
CREATE INDEX "rfq_responses_tenant_id_supplier_id_idx" ON "operations"."rfq_responses"("tenant_id", "supplier_id");
ALTER TABLE "operations"."rfq_responses" ADD CONSTRAINT "rfq_responses_rfq_id_fkey" FOREIGN KEY ("rfq_id") REFERENCES "operations"."rfqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "operations"."goods_receipts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "purchase_order_id" UUID NOT NULL,
    "po_number" TEXT NOT NULL,
    "supplier_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "status" "operations"."goods_receipt_status" NOT NULL DEFAULT 'pending',
    "received_by" TEXT NOT NULL,
    "received_at" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "goods_receipts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "goods_receipts_tenant_id_receipt_number_key" ON "operations"."goods_receipts"("tenant_id", "receipt_number");
CREATE INDEX "goods_receipts_tenant_id_purchase_order_id_idx" ON "operations"."goods_receipts"("tenant_id", "purchase_order_id");
CREATE INDEX "goods_receipts_tenant_id_status_idx" ON "operations"."goods_receipts"("tenant_id", "status");
ALTER TABLE "operations"."goods_receipts" ADD CONSTRAINT "goods_receipts_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "operations"."purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "operations"."goods_receipt_lines" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "receipt_id" UUID NOT NULL,
    "po_line_id" UUID,
    "description" TEXT NOT NULL,
    "ordered_qty" INTEGER NOT NULL,
    "received_qty" INTEGER NOT NULL,
    CONSTRAINT "goods_receipt_lines_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "goods_receipt_lines_tenant_id_receipt_id_idx" ON "operations"."goods_receipt_lines"("tenant_id", "receipt_id");
ALTER TABLE "operations"."goods_receipt_lines" ADD CONSTRAINT "goods_receipt_lines_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "operations"."goods_receipts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE operations.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.rfqs FORCE ROW LEVEL SECURITY;
CREATE POLICY rfqs_tenant_isolation ON operations.rfqs FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.rfq_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.rfq_lines FORCE ROW LEVEL SECURITY;
CREATE POLICY rfq_lines_tenant_isolation ON operations.rfq_lines FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.rfq_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.rfq_responses FORCE ROW LEVEL SECURITY;
CREATE POLICY rfq_responses_tenant_isolation ON operations.rfq_responses FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.goods_receipts FORCE ROW LEVEL SECURITY;
CREATE POLICY goods_receipts_tenant_isolation ON operations.goods_receipts FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE operations.goods_receipt_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE operations.goods_receipt_lines FORCE ROW LEVEL SECURITY;
CREATE POLICY goods_receipt_lines_tenant_isolation ON operations.goods_receipt_lines FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));
