-- E5-04: Finance general ledger
CREATE TYPE "financial"."gl_account_type" AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');
CREATE TYPE "financial"."journal_entry_status" AS ENUM ('draft', 'pending_approval', 'posted', 'reversed');
CREATE TYPE "financial"."fiscal_period_status" AS ENUM ('open', 'closed', 'locked');

CREATE TABLE "financial"."chart_of_accounts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "financial"."gl_account_type" NOT NULL,
    "parent_id" UUID,
    "facility_id" UUID,
    "balance_cents" BIGINT NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "chart_of_accounts_tenant_id_code_key" ON "financial"."chart_of_accounts"("tenant_id", "code");
CREATE INDEX "chart_of_accounts_tenant_id_type_is_active_idx" ON "financial"."chart_of_accounts"("tenant_id", "type", "is_active");

CREATE TABLE "financial"."fiscal_periods" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "financial"."fiscal_period_status" NOT NULL DEFAULT 'open',
    "fiscal_year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "fiscal_periods_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "fiscal_periods_tenant_id_name_key" ON "financial"."fiscal_periods"("tenant_id", "name");
CREATE INDEX "fiscal_periods_tenant_id_fiscal_year_status_idx" ON "financial"."fiscal_periods"("tenant_id", "fiscal_year", "status");

CREATE TABLE "financial"."journal_entries" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "entry_number" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "entry_date" DATE NOT NULL,
    "fiscal_period_id" UUID NOT NULL,
    "status" "financial"."journal_entry_status" NOT NULL DEFAULT 'draft',
    "total_debit_cents" BIGINT NOT NULL DEFAULT 0,
    "total_credit_cents" BIGINT NOT NULL DEFAULT 0,
    "facility_id" UUID,
    "source_module" TEXT,
    "source_ref" TEXT,
    "posted_at" TIMESTAMP(3),
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "journal_entries_tenant_id_entry_number_key" ON "financial"."journal_entries"("tenant_id", "entry_number");
CREATE INDEX "journal_entries_tenant_id_status_entry_date_idx" ON "financial"."journal_entries"("tenant_id", "status", "entry_date" DESC);
CREATE INDEX "journal_entries_tenant_id_fiscal_period_id_idx" ON "financial"."journal_entries"("tenant_id", "fiscal_period_id");
ALTER TABLE "financial"."journal_entries" ADD CONSTRAINT "journal_entries_fiscal_period_id_fkey" FOREIGN KEY ("fiscal_period_id") REFERENCES "financial"."fiscal_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "financial"."journal_lines" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "journal_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "debit_cents" BIGINT NOT NULL DEFAULT 0,
    "credit_cents" BIGINT NOT NULL DEFAULT 0,
    "description" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "journal_lines_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "journal_lines_tenant_id_journal_id_idx" ON "financial"."journal_lines"("tenant_id", "journal_id");
CREATE INDEX "journal_lines_tenant_id_account_id_idx" ON "financial"."journal_lines"("tenant_id", "account_id");
ALTER TABLE "financial"."journal_lines" ADD CONSTRAINT "journal_lines_journal_id_fkey" FOREIGN KEY ("journal_id") REFERENCES "financial"."journal_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "financial"."journal_lines" ADD CONSTRAINT "journal_lines_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "financial"."chart_of_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE financial.chart_of_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.chart_of_accounts FORCE ROW LEVEL SECURITY;
CREATE POLICY chart_of_accounts_tenant_isolation ON financial.chart_of_accounts FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.fiscal_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.fiscal_periods FORCE ROW LEVEL SECURITY;
CREATE POLICY fiscal_periods_tenant_isolation ON financial.fiscal_periods FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.journal_entries FORCE ROW LEVEL SECURITY;
CREATE POLICY journal_entries_tenant_isolation ON financial.journal_entries FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE financial.journal_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial.journal_lines FORCE ROW LEVEL SECURITY;
CREATE POLICY journal_lines_tenant_isolation ON financial.journal_lines FOR ALL USING (platform.tenant_row_matches(tenant_id)) WITH CHECK (platform.tenant_row_matches(tenant_id));
