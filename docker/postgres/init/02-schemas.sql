-- E1-03 PostgreSQL schemas (aligned with database/prisma/schema.prisma)

CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS clinical;
CREATE SCHEMA IF NOT EXISTS operations;
CREATE SCHEMA IF NOT EXISTS intelligence;
CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS integration;

COMMENT ON SCHEMA core IS 'Shared kernel: tenancy, patients, providers, facilities';
COMMENT ON SCHEMA identity IS 'IAM: users, roles, sessions';
COMMENT ON SCHEMA clinical IS 'Clinical care bounded context';
COMMENT ON SCHEMA operations IS 'Hospital operations bounded context';
COMMENT ON SCHEMA intelligence IS 'Analytics and AI bounded context';
COMMENT ON SCHEMA platform IS 'Platform services';
COMMENT ON SCHEMA audit IS 'Append-only audit and security events';
COMMENT ON SCHEMA integration IS 'FHIR, HL7, interoperability';
