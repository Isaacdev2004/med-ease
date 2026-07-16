export { iamService } from '@/services/iam/iam.service';
export { iamRepository } from '@/services/iam/repository';
export { iamMockRepository } from '@/services/iam/repository.mock';
export { iamOfflineQueue } from '@/services/iam/offline-sync';
export { computeIamAnalytics, buildIamDashboard } from '@/services/iam/analytics';
export {
  MOCK_IAM_USERS,
  MOCK_IAM_ROLES,
  MOCK_IAM_PERMISSIONS,
  MOCK_IAM_POLICIES,
  MOCK_IAM_SESSIONS,
  MOCK_LOGIN_HISTORY,
  MOCK_MFA_DEVICES,
  MOCK_TRUSTED_DEVICES,
  MOCK_OAUTH_CLIENTS,
  MOCK_API_KEYS,
  MOCK_CONSENTS,
  MOCK_DELEGATIONS,
  MOCK_BREAK_GLASS,
  MOCK_SECURITY_INCIDENTS,
  MOCK_IAM_AUDIT,
  MOCK_RISK_SCORES,
  MOCK_TENANTS,
  MOCK_ORGANIZATIONS,
} from '@/services/iam/mock-data';
