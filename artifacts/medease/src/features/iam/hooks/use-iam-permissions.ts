import { useAuth } from '@/services/auth/auth-context';
import type { IamPermissions } from '@/services/iam/types';

export function useIamPermissions(): IamPermissions {
  const { permissions } = useAuth();
  return {
    canView: permissions.includes('iam.read'),
    canWrite: permissions.includes('iam.write'),
    canUsers: permissions.includes('iam.users'),
    canRoles: permissions.includes('iam.roles'),
    canPermissions: permissions.includes('iam.permissions'),
    canPolicies: permissions.includes('iam.policies'),
    canSessions: permissions.includes('iam.sessions'),
    canMfa: permissions.includes('iam.mfa'),
    canSso: permissions.includes('iam.sso'),
    canOauth: permissions.includes('iam.oauth'),
    canApiKeys: permissions.includes('iam.apiKeys'),
    canAudit: permissions.includes('iam.audit'),
    canAnalytics: permissions.includes('iam.analytics'),
    canConsent: permissions.includes('iam.consent'),
    canBreakGlass: permissions.includes('iam.breakGlass'),
    canAdmin: permissions.includes('iam.admin'),
  };
}
