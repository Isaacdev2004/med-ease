-- E3-01: Clinical patients domain (normalized clinical.* schema)
-- Prisma models: database/prisma/clinical.prisma
-- RLS source: database/rls/clinical/patients.sql

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE "clinical"."patient_status" AS ENUM ('active', 'inactive', 'observation');
CREATE TYPE "clinical"."patient_identifier_type" AS ENUM ('mrn', 'national_id', 'passport', 'drivers_license', 'ssn', 'other');
CREATE TYPE "clinical"."patient_contact_type" AS ENUM ('phone', 'email', 'fax', 'other');
CREATE TYPE "clinical"."patient_address_type" AS ENUM ('home', 'work', 'mailing', 'temporary', 'other');
CREATE TYPE "clinical"."allergy_severity" AS ENUM ('mild', 'moderate', 'severe', 'life_threatening');
CREATE TYPE "clinical"."allergy_type" AS ENUM ('drug', 'food', 'environmental', 'other');

-- ─── clinical.patients ───────────────────────────────────────────────────────

CREATE TABLE "clinical"."patients" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "facility_id" UUID,
    "user_id" UUID,
    "mrn" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "gender" "core"."gender",
    "status" "clinical"."patient_status" NOT NULL DEFAULT 'active',
    "primary_provider_id" UUID,
    "fhir_resource_id" UUID NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patients_tenant_id_mrn_key" ON "clinical"."patients"("tenant_id", "mrn");
CREATE INDEX "patients_tenant_id_status_idx" ON "clinical"."patients"("tenant_id", "status");
CREATE INDEX "patients_tenant_id_full_name_idx" ON "clinical"."patients"("tenant_id", "full_name");
CREATE INDEX "patients_tenant_id_facility_id_idx" ON "clinical"."patients"("tenant_id", "facility_id");
CREATE INDEX "patients_tenant_id_deleted_at_idx" ON "clinical"."patients"("tenant_id", "deleted_at");

-- ─── clinical.patient_identifiers ──────────────────────────────────────────

CREATE TABLE "clinical"."patient_identifiers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "clinical"."patient_identifier_type" NOT NULL,
    "value" TEXT NOT NULL,
    "system" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_identifiers_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patient_identifiers_tenant_id_type_value_key" ON "clinical"."patient_identifiers"("tenant_id", "type", "value");
CREATE INDEX "patient_identifiers_patient_id_idx" ON "clinical"."patient_identifiers"("patient_id");

ALTER TABLE "clinical"."patient_identifiers"
  ADD CONSTRAINT "patient_identifiers_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── clinical.patient_contacts ───────────────────────────────────────────────

CREATE TABLE "clinical"."patient_contacts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "clinical"."patient_contact_type" NOT NULL,
    "value" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_contacts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_contacts_patient_id_idx" ON "clinical"."patient_contacts"("patient_id");
CREATE INDEX "patient_contacts_tenant_id_value_idx" ON "clinical"."patient_contacts"("tenant_id", "value");

ALTER TABLE "clinical"."patient_contacts"
  ADD CONSTRAINT "patient_contacts_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── clinical.patient_addresses ──────────────────────────────────────────────

CREATE TABLE "clinical"."patient_addresses" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "type" "clinical"."patient_address_type" NOT NULL DEFAULT 'home',
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_addresses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_addresses_patient_id_idx" ON "clinical"."patient_addresses"("patient_id");

ALTER TABLE "clinical"."patient_addresses"
  ADD CONSTRAINT "patient_addresses_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── clinical.patient_emergency_contacts ─────────────────────────────────────

CREATE TABLE "clinical"."patient_emergency_contacts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_emergency_contacts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_emergency_contacts_patient_id_idx" ON "clinical"."patient_emergency_contacts"("patient_id");

ALTER TABLE "clinical"."patient_emergency_contacts"
  ADD CONSTRAINT "patient_emergency_contacts_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── clinical.patient_allergies ──────────────────────────────────────────────

CREATE TABLE "clinical"."patient_allergies" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "allergen" TEXT NOT NULL,
    "type" "clinical"."allergy_type" NOT NULL,
    "severity" "clinical"."allergy_severity" NOT NULL,
    "reaction" TEXT,
    "noted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_allergies_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "patient_allergies_patient_id_idx" ON "clinical"."patient_allergies"("patient_id");
CREATE INDEX "patient_allergies_tenant_id_allergen_idx" ON "clinical"."patient_allergies"("tenant_id", "allergen");

ALTER TABLE "clinical"."patient_allergies"
  ADD CONSTRAINT "patient_allergies_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── clinical.patient_preferences ────────────────────────────────────────────

CREATE TABLE "clinical"."patient_preferences" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en-US',
    "marital_status" TEXT,
    "occupation" TEXT,
    "nationality" TEXT,
    "smoking" TEXT,
    "communication" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_preferences_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "patient_preferences_patient_id_key" ON "clinical"."patient_preferences"("patient_id");
CREATE INDEX "patient_preferences_tenant_id_idx" ON "clinical"."patient_preferences"("tenant_id");

ALTER TABLE "clinical"."patient_preferences"
  ADD CONSTRAINT "patient_preferences_patient_id_fkey"
  FOREIGN KEY ("patient_id") REFERENCES "clinical"."patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── RLS (database/rls/clinical/patients.sql) ───────────────────────────────

ALTER TABLE clinical.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patients FORCE ROW LEVEL SECURITY;

CREATE POLICY patients_tenant_isolation ON clinical.patients
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_identifiers FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_identifiers_tenant_isolation ON clinical.patient_identifiers
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_contacts FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_contacts_tenant_isolation ON clinical.patient_contacts
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_addresses FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_addresses_tenant_isolation ON clinical.patient_addresses
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_emergency_contacts FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_emergency_contacts_tenant_isolation ON clinical.patient_emergency_contacts
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_allergies FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_allergies_tenant_isolation ON clinical.patient_allergies
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));

ALTER TABLE clinical.patient_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical.patient_preferences FORCE ROW LEVEL SECURITY;

CREATE POLICY patient_preferences_tenant_isolation ON clinical.patient_preferences
  FOR ALL
  USING (platform.tenant_row_matches(tenant_id))
  WITH CHECK (platform.tenant_row_matches(tenant_id));
