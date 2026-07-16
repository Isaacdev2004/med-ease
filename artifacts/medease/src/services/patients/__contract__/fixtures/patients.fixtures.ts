/** Shared fixtures for Patients repository contract tests (mock + HTTP). */
export const patientsContractFixtures = {
  tenantId: '01930000-0000-7000-8000-000000000001',
  existingPatientId: '01930000-0000-7000-8000-000000000301',
  existingMrn: 'MRN-10293',
  existingFullName: 'Sarah Jenkins',
  searchQuery: 'Jenkins',
  missingPatientId: '00000000-0000-0000-0000-000000000000',
  page: 1,
  pageSize: 10,
  actorId: '01930000-0000-7000-8000-000000000101',
  demoTenantId: '01930000-0000-7000-8000-000000000001',
  demoAdminEmail: 'admin@medease.health',
  demoPassword: 'demo',
};
