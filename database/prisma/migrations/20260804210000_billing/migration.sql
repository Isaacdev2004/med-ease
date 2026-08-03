-- clinical / financial billing RLS helpers live under database/rls/financial/billing.sql
-- E5-01: Patient billing — invoices, line items, payments, receipts, refunds, claims, policies
-- Prisma models: database/prisma/financial.prisma
-- RLS source: database/rls/financial/billing.sql

CREATE SCHEMA IF NOT EXISTS "financial";

-- Unused placeholders previously lived under operations; recreate under financial.
DROP TYPE IF EXISTS "operations"."invoice_status";
DROP TYPE IF EXISTS "operations"."claim_status";

CREATE TYPE "financial"."invoice_status" AS ENUM (
  'draft', 'issued', 'partial', 'paid', 'overdue', 'cancelled', 'written_off'
);
CREATE TYPE "financial"."claim_status" AS ENUM (
  'draft', 'submitted', 'pending', 'approved', 'partially_approved', 'denied',
  'appealed', 'resubmitted', 'accepted', 'rejected', 'paid'
);
CREATE TYPE "financial"."billing_payment_method" AS ENUM (
  'cash', 'card', 'bank_transfer', 'insurance', 'wallet',
  'stripe', 'paystack', 'flutterwave', 'mobile_money'
);
CREATE TYPE "financial"."billing_payment_status" AS ENUM (
  'pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded'
);
CREATE TYPE "financial"."billing_refund_status" AS ENUM (
  'pending', 'processing', 'completed', 'failed'
);
CREATE TYPE "financial"."insurance_policy_status" AS ENUM (
  'active', 'inactive', 'pending', 'expired'
);
CREATE TYPE "financial"."invoice_line_category" AS ENUM (
  'consultation', 'laboratory', 'radiology', 'medication',
  'monitoring', 'telemedicine', 'procedure', 'other'
);

CREATE TABLE "financial"."insurance_policies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "payer" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "group_number" TEXT,
    "plan_type" TEXT NOT NULL,
    "coverage_start" TIMESTAMPTZ(3) NOT NULL,
    "coverage_end" TIMESTAMPTZ(3) NOT NULL,
    "deductible_cents" BIGINT NOT NULL DEFAULT 0,
    "copay_cents" BIGINT NOT NULL DEFAULT 0,
    "coinsurance_percent" INTEGER NOT NULL DEFAULT 0,
    "status" "financial"."insurance_policy_status" NOT NULL DEFAULT 'active',
    "eligibility_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_verified_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "insurance_policies_tenant_id_patient_id_status_idx"
  ON "financial"."insurance_policies"("tenant_id", "patient_id", "status");

CREATE TABLE "financial"."patient_invoices" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "facility_id" UUID NOT NULL,
    "facility_name" TEXT NOT NULL,
    "provider_id" UUID NOT NULL,
    "provider_name" TEXT NOT NULL,
    "appointment_id" UUID,
    "encounter_id" UUID,
    "insurance_policy_id" UUID,
    "status" "financial"."invoice_status" NOT NULL DEFAULT 'draft',
    "currency_code" CHAR(3) NOT NULL DEFAULT 'EUR',
    "subtotal_cents" BIGINT NOT NULL DEFAULT 0,
    "discount_cents" BIGINT NOT NULL DEFAULT 0,
    "tax_cents" BIGINT NOT NULL DEFAULT 0,
    "total_cents" BIGINT NOT NULL DEFAULT 0,
    "paid_cents" BIGINT NOT NULL DEFAULT 0,
    "balance_cents" BIGINT NOT NULL DEFAULT 0,
    "payment_method" "financial"."billing_payment_method",
    "notes" TEXT,
    "issued_at" TIMESTAMPTZ(3),
    "due_at" TIMESTAMPTZ(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "patient_invoices_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patient_invoices_tenant_id_invoice_number_key"
  ON "financial"."patient_invoices"("tenant_id", "invoice_number");
CREATE INDEX "patient_invoices_tenant_id_patient_id_status_idx"
  ON "financial"."patient_invoices"("tenant_id", "patient_id", "status");
CREATE INDEX "patient_invoices_tenant_id_facility_id_status_idx"
  ON "financial"."patient_invoices"("tenant_id", "facility_id", "status");
CREATE INDEX "patient_invoices_tenant_id_status_issued_at_idx"
  ON "financial"."patient_invoices"("tenant_id", "status", "issued_at" DESC);

ALTER TABLE "financial"."patient_invoices"
  ADD CONSTRAINT "patient_invoices_insurance_policy_id_fkey"
  FOREIGN KEY ("insurance_policy_id") REFERENCES "financial"."insurance_policies"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "financial"."invoice_line_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "category" "financial"."invoice_line_category" NOT NULL DEFAULT 'other',
    "description" TEXT NOT NULL,
    "code" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit_price_cents" BIGINT NOT NULL,
    "amount_cents" BIGINT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "invoice_line_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "invoice_line_items_tenant_id_invoice_id_idx"
  ON "financial"."invoice_line_items"("tenant_id", "invoice_id");

ALTER TABLE "financial"."invoice_line_items"
  ADD CONSTRAINT "invoice_line_items_invoice_id_fkey"
  FOREIGN KEY ("invoice_id") REFERENCES "financial"."patient_invoices"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "financial"."payments" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "facility_id" UUID,
    "provider_id" UUID,
    "amount_cents" BIGINT NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'EUR',
    "method" "financial"."billing_payment_method" NOT NULL,
    "status" "financial"."billing_payment_status" NOT NULL DEFAULT 'pending',
    "reference" TEXT NOT NULL,
    "paid_at" TIMESTAMPTZ(3) NOT NULL,
    "installment_number" INTEGER,
    "total_installments" INTEGER,
    "retry_count" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "payments_tenant_id_invoice_id_idx"
  ON "financial"."payments"("tenant_id", "invoice_id");
CREATE INDEX "payments_tenant_id_patient_id_status_idx"
  ON "financial"."payments"("tenant_id", "patient_id", "status");
CREATE INDEX "payments_tenant_id_paid_at_idx"
  ON "financial"."payments"("tenant_id", "paid_at" DESC);

ALTER TABLE "financial"."payments"
  ADD CONSTRAINT "payments_invoice_id_fkey"
  FOREIGN KEY ("invoice_id") REFERENCES "financial"."patient_invoices"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "financial"."receipts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "receipt_number" TEXT NOT NULL,
    "amount_cents" BIGINT NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'EUR',
    "payment_method" "financial"."billing_payment_method" NOT NULL,
    "issued_at" TIMESTAMPTZ(3) NOT NULL,
    "download_url" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "receipts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "receipts_tenant_id_receipt_number_key"
  ON "financial"."receipts"("tenant_id", "receipt_number");
CREATE INDEX "receipts_tenant_id_patient_id_idx"
  ON "financial"."receipts"("tenant_id", "patient_id");
CREATE INDEX "receipts_tenant_id_invoice_id_idx"
  ON "financial"."receipts"("tenant_id", "invoice_id");

ALTER TABLE "financial"."receipts"
  ADD CONSTRAINT "receipts_payment_id_fkey"
  FOREIGN KEY ("payment_id") REFERENCES "financial"."payments"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "financial"."receipts"
  ADD CONSTRAINT "receipts_invoice_id_fkey"
  FOREIGN KEY ("invoice_id") REFERENCES "financial"."patient_invoices"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "financial"."refunds" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "payment_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "amount_cents" BIGINT NOT NULL,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'EUR',
    "reason" TEXT NOT NULL,
    "status" "financial"."billing_refund_status" NOT NULL DEFAULT 'pending',
    "processed_at" TIMESTAMPTZ(3),
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "refunds_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "refunds_tenant_id_payment_id_idx"
  ON "financial"."refunds"("tenant_id", "payment_id");
CREATE INDEX "refunds_tenant_id_patient_id_status_idx"
  ON "financial"."refunds"("tenant_id", "patient_id", "status");

ALTER TABLE "financial"."refunds"
  ADD CONSTRAINT "refunds_payment_id_fkey"
  FOREIGN KEY ("payment_id") REFERENCES "financial"."payments"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "financial"."refunds"
  ADD CONSTRAINT "refunds_invoice_id_fkey"
  FOREIGN KEY ("invoice_id") REFERENCES "financial"."patient_invoices"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "financial"."insurance_claims" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "patient_name" TEXT NOT NULL,
    "invoice_id" UUID,
    "insurance_policy_id" UUID,
    "facility_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "payer" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "authorization_number" TEXT,
    "diagnosis_codes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "procedure_codes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "medications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "laboratory_orders" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "radiology_orders" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "total_claim_cents" BIGINT NOT NULL,
    "approved_cents" BIGINT NOT NULL DEFAULT 0,
    "denied_cents" BIGINT NOT NULL DEFAULT 0,
    "deductible_cents" BIGINT NOT NULL DEFAULT 0,
    "copay_cents" BIGINT NOT NULL DEFAULT 0,
    "coinsurance_cents" BIGINT NOT NULL DEFAULT 0,
    "currency_code" CHAR(3) NOT NULL DEFAULT 'EUR',
    "status" "financial"."claim_status" NOT NULL DEFAULT 'draft',
    "submission_date" TIMESTAMPTZ(3),
    "adjudication_date" TIMESTAMPTZ(3),
    "denial_reason" TEXT,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "insurance_claims_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "insurance_claims_tenant_id_patient_id_status_idx"
  ON "financial"."insurance_claims"("tenant_id", "patient_id", "status");
CREATE INDEX "insurance_claims_tenant_id_facility_id_status_idx"
  ON "financial"."insurance_claims"("tenant_id", "facility_id", "status");
CREATE INDEX "insurance_claims_tenant_id_status_created_at_idx"
  ON "financial"."insurance_claims"("tenant_id", "status", "created_at" DESC);

ALTER TABLE "financial"."insurance_claims"
  ADD CONSTRAINT "insurance_claims_invoice_id_fkey"
  FOREIGN KEY ("invoice_id") REFERENCES "financial"."patient_invoices"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "financial"."insurance_claims"
  ADD CONSTRAINT "insurance_claims_insurance_policy_id_fkey"
  FOREIGN KEY ("insurance_policy_id") REFERENCES "financial"."insurance_policies"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- RLS
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
