-- Public marketing CTA leads (platform scope, no tenant RLS)

CREATE TABLE "platform"."marketing_leads" (
    "id" UUID NOT NULL,
    "cta_id" VARCHAR(64) NOT NULL,
    "email" VARCHAR(320),
    "fields" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketing_leads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "marketing_leads_cta_id_idx" ON "platform"."marketing_leads"("cta_id");
CREATE INDEX "marketing_leads_email_idx" ON "platform"."marketing_leads"("email");
CREATE INDEX "marketing_leads_created_at_idx" ON "platform"."marketing_leads"("created_at" DESC);
