export type IdentityRole =
  | 'platform_admin'
  | 'facility_admin'
  | 'physician'
  | 'pharmacist'
  | 'transport_dispatcher'
  | 'patient';

/** Frontend-compatible user status strings returned by auth API. */
export type AuthUserStatus = 'active' | 'disabled' | 'pending_verification';

export interface JwtAccessPayload {
  sub: string;
  email: string;
  role: IdentityRole;
  tenantId: string;
  organizationId: string;
  facilityId?: string;
  permissions: string[];
  sessionId: string;
  deviceTrust: boolean;
}

export interface AuthUserDto {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: IdentityRole;
  organizationId: string;
  permissions: string[];
  locale: string;
  timezone: string;
  lastLogin?: string;
  status: AuthUserStatus;
}

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
}

export interface AuthSessionDto {
  accessToken: string;
  expiresAt: number;
  rememberMe?: boolean;
}

export interface LoginResultDto {
  user: AuthUserDto;
  session: AuthSessionDto;
  organization: OrganizationDto;
}

export const AUTH_ERROR_CODES = {
  invalid_credentials: 'invalid_credentials',
  session_expired: 'session_expired',
  account_disabled: 'account_disabled',
  account_locked: 'account_locked',
  too_many_requests: 'too_many_requests',
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];

export const REFRESH_COOKIE_NAME = 'medease_refresh_token';

export function mapUserStatusToFrontend(status: string): AuthUserStatus {
  switch (status) {
    case 'active':
      return 'active';
    case 'locked':
    case 'inactive':
      return 'disabled';
    case 'pending':
    default:
      return 'pending_verification';
  }
}
