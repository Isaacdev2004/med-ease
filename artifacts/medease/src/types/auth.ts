/** Mutually exclusive roles for MVP — ordered highest to lowest privilege. */
export type UserRole =
  | 'platform_admin'
  | 'facility_admin'
  | 'physician'
  | 'pharmacist'
  | 'transport_dispatcher'
  | 'patient';

export type UserStatus = 'active' | 'disabled' | 'pending_verification';

export type AuthState =
  | 'unauthenticated'
  | 'authenticating'
  | 'authenticated'
  | 'refreshing'
  | 'session_expired'
  | 'logging_out'
  | 'offline';

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'session_expired'
  | 'account_disabled'
  | 'insufficient_permissions'
  | 'organization_unavailable'
  | 'network_error'
  | 'unknown';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  role: UserRole;
  tenantId: string;
  organizationId: string;
  permissions: string[];
  locale: string;
  timezone: string;
  lastLogin?: string;
  status: UserStatus;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  rememberMe?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  user: AuthUser;
  session: AuthSession;
  organization: Organization;
}
