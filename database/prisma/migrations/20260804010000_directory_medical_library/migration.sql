-- E3-07: Provider directory + medical library catalog
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/directory-medical-library.sql

CREATE TYPE "clinical"."directory_provider_type" AS ENUM (
  'professional',
  'facility',
  'pharmacy',
  'transport',
  'nursing_home',
  'medical_center'
);

CREATE TABLE "clinical"."directory_providers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "type" "clinical"."directory_provider_type" NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "specialty" TEXT,
    "medical_specialty" TEXT,
    "facility_type" TEXT,
    "finess_number" TEXT,
    "street" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "department" TEXT NOT NULL DEFAULT '',
    "postal_code" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'France',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "distance_km" DOUBLE PRECISION,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "availability" TEXT,
    "status" TEXT NOT NULL DEFAULT 'stable',
    "languages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "insurance_accepted" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "accessibility" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "services" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "qualifications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "teleconsultation" BOOLEAN NOT NULL DEFAULT false,
    "emergency_services" BOOLEAN NOT NULL DEFAULT false,
    "opening_hours" JSONB,
    "associated_facility_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "related_professional_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "directory_providers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "directory_providers_tenant_id_finess_number_key"
  ON "clinical"."directory_providers"("tenant_id", "finess_number");
CREATE INDEX "directory_providers_tenant_id_type_active_idx"
  ON "clinical"."directory_providers"("tenant_id", "type", "active");
CREATE INDEX "directory_providers_tenant_id_city_idx"
  ON "clinical"."directory_providers"("tenant_id", "city");
CREATE INDEX "directory_providers_tenant_id_specialty_idx"
  ON "clinical"."directory_providers"("tenant_id", "specialty");
CREATE INDEX "directory_providers_tenant_id_name_idx"
  ON "clinical"."directory_providers"("tenant_id", "name");

CREATE TABLE "clinical"."directory_favorites" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "directory_favorites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "directory_favorites_user_id_provider_id_key"
  ON "clinical"."directory_favorites"("user_id", "provider_id");
CREATE INDEX "directory_favorites_tenant_id_user_id_idx"
  ON "clinical"."directory_favorites"("tenant_id", "user_id");

ALTER TABLE "clinical"."directory_favorites"
  ADD CONSTRAINT "directory_favorites_provider_id_fkey"
  FOREIGN KEY ("provider_id") REFERENCES "clinical"."directory_providers"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "clinical"."medication_catalog" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "bdpm_id" TEXT,
    "name" TEXT NOT NULL,
    "brand_name" TEXT,
    "generic_name" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "dosage_form" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "atc_code" TEXT NOT NULL,
    "therapeutic_class" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "manufacturer" TEXT,
    "prescription_required" BOOLEAN NOT NULL DEFAULT false,
    "controlled_substance" BOOLEAN NOT NULL DEFAULT false,
    "pregnancy_safety" TEXT NOT NULL DEFAULT 'unknown',
    "breastfeeding_safety" TEXT NOT NULL DEFAULT 'unknown',
    "pediatric_approved" BOOLEAN NOT NULL DEFAULT false,
    "geriatric_approved" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "search_count" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL DEFAULT '',
    "active_ingredients" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "indications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "contraindications" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "warnings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "precautions" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "side_effects" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "administration" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "storage" TEXT NOT NULL DEFAULT '',
    "patient_information" TEXT NOT NULL DEFAULT '',
    "professional_information" TEXT NOT NULL DEFAULT '',
    "references" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "dosages" JSONB NOT NULL DEFAULT '[]',
    "interactions" JSONB NOT NULL DEFAULT '[]',
    "related_medication_ids" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medication_catalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "medication_catalog_tenant_id_bdpm_id_key"
  ON "clinical"."medication_catalog"("tenant_id", "bdpm_id");
CREATE INDEX "medication_catalog_tenant_id_category_available_idx"
  ON "clinical"."medication_catalog"("tenant_id", "category", "available");
CREATE INDEX "medication_catalog_tenant_id_name_idx"
  ON "clinical"."medication_catalog"("tenant_id", "name");
CREATE INDEX "medication_catalog_tenant_id_atc_code_idx"
  ON "clinical"."medication_catalog"("tenant_id", "atc_code");
CREATE INDEX "medication_catalog_tenant_id_therapeutic_class_idx"
  ON "clinical"."medication_catalog"("tenant_id", "therapeutic_class");

CREATE TABLE "clinical"."medication_library_favorites" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medication_library_favorites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "medication_library_favorites_user_id_medication_id_key"
  ON "clinical"."medication_library_favorites"("user_id", "medication_id");
CREATE INDEX "medication_library_favorites_tenant_id_user_id_idx"
  ON "clinical"."medication_library_favorites"("tenant_id", "user_id");

ALTER TABLE "clinical"."medication_library_favorites"
  ADD CONSTRAINT "medication_library_favorites_medication_id_fkey"
  FOREIGN KEY ("medication_id") REFERENCES "clinical"."medication_catalog"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "clinical"."directory_providers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."directory_providers" FORCE ROW LEVEL SECURITY;
CREATE POLICY directory_providers_tenant_isolation ON "clinical"."directory_providers"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."directory_favorites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."directory_favorites" FORCE ROW LEVEL SECURITY;
CREATE POLICY directory_favorites_tenant_isolation ON "clinical"."directory_favorites"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."medication_catalog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."medication_catalog" FORCE ROW LEVEL SECURITY;
CREATE POLICY medication_catalog_tenant_isolation ON "clinical"."medication_catalog"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE "clinical"."medication_library_favorites" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clinical"."medication_library_favorites" FORCE ROW LEVEL SECURITY;
CREATE POLICY medication_library_favorites_tenant_isolation ON "clinical"."medication_library_favorites"
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
