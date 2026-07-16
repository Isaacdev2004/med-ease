import type { MfaMethod } from '@/services/iam/types';

export const MFA_METHODS: MfaMethod[] = ['totp', 'sms', 'email', 'hardware_key', 'push'];

export function mfaRequiredForRole(roleName: string): boolean {
  return ['platform_admin', 'facility_admin', 'physician'].includes(roleName);
}

export function generateTotpSecret(): string {
  return `MEDEASE-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export function verifyMfaCode(_secret: string, code: string): boolean {
  return /^\d{6}$/.test(code);
}
