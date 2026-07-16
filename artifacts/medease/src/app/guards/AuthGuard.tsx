import {
  AuthenticatedGuard,
  FeatureFlagGuard,
  OrganizationGuard,
  PermissionGuard,
  PublicGuard,
  PublicOnlyGuard,
  RoleGuard,
} from '@/app/guards/index';

/** @deprecated Use AuthenticatedGuard */
export const AuthGuard = AuthenticatedGuard;

export {
  AuthenticatedGuard,
  FeatureFlagGuard,
  OrganizationGuard,
  PermissionGuard,
  PublicGuard,
  PublicOnlyGuard,
  RoleGuard,
};
