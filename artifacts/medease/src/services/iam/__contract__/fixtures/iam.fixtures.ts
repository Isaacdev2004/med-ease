/** Shared fixtures for IAM repository contract tests (mock + HTTP). */
export const iamContractFixtures = {
  tenantId: 'tenant-001',
  existingUserId: 'user-00001',
  existingUserEmail: 'user1@medease.health',
  searchQuery: 'user1',
  missingUserId: '00000000-0000-0000-0000-000000000000',
  page: 1,
  pageSize: 10,
  demoTenantId: '01930000-0000-7000-8000-000000000001',
  organizationId: 'org-0001',
  roleId: 'role-001',
  demoRoleId: '01930000-0000-7000-8000-000000000201',
  demoOrganizationId: '01930000-0000-7000-8000-000000000002',
  demoAdminEmail: 'admin@medease.health',
  demoPassword: 'demo',
};
