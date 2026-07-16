import type { IdentityRole } from '../types';

/**
 * Explicit deny rules — evaluated after role grants and take precedence over allows.
 * Patterns support wildcards (e.g. `patients.*`).
 */
export const ROLE_DENY_RULES: Partial<Record<IdentityRole, string[]>> = {
  patient: ['patients.write', 'patients.delete', 'users.*', 'iam.*'],
  pharmacist: ['medications.prescribe'],
  transport_dispatcher: ['patients.write', 'patients.delete'],
};

export function getDenyRulesForRole(role: IdentityRole): string[] {
  return ROLE_DENY_RULES[role] ?? [];
}
