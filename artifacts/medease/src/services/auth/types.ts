import type {
  AuthSession,
  LoginCredentials,
  LoginResult,
  UserRole,
} from '@/types/auth';

export interface StoredSessionRef {
  userId: string;
  expiresAt: number;
  rememberMe?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthService {
  getStoredSessionRef(): StoredSessionRef | null;
  restoreSession(ref: StoredSessionRef): Promise<LoginResult | null>;
  signIn(credentials: LoginCredentials): Promise<LoginResult>;
  signOut(): Promise<void>;
  refreshSession(session: AuthSession): Promise<AuthSession | null>;
  switchRole?(role: UserRole): Promise<LoginResult>;
}

export interface AuthFriendlyError {
  code: string;
  message: string;
}

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'The email or password you entered is incorrect.',
  session_expired: 'Your session has expired. Please sign in again.',
  account_disabled:
    'Your account has been disabled. Contact your administrator.',
  insufficient_permissions:
    'You do not have permission to perform this action.',
  organization_unavailable:
    'Your organization is currently unavailable. Try again later.',
  network_error: 'Unable to connect. Check your network and try again.',
  unknown: 'Something went wrong. Please try again.',
};

export function toFriendlyAuthError(code: string): AuthFriendlyError {
  return {
    code,
    message: AUTH_ERROR_MESSAGES[code] ?? AUTH_ERROR_MESSAGES.unknown,
  };
}
