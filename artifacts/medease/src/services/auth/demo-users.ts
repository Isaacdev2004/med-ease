import type { Organization, AuthUser, UserRole } from '@/types/auth';
import { getPermissionsForRole } from '@/config/permissions';

const DEMO_ORGANIZATION: Organization = {
  id: 'org-demo-001',
  name: "Med'ease Network",
  slug: 'medease-network',
};

interface DemoAccount {
  email: string;
  password: string;
  user: Omit<AuthUser, 'permissions' | 'lastLogin'>;
}

const demoAccounts: DemoAccount[] = [
  {
    email: 'admin@medease.health',
    password: 'demo',
    user: {
      id: 'user-admin',
      email: 'admin@medease.health',
      fullName: 'System Administrator',
      role: 'platform_admin',
      organizationId: DEMO_ORGANIZATION.id,
      locale: 'en-US',
      timezone: 'America/New_York',
      status: 'active',
    },
  },
  {
    email: 'facility@medease.health',
    password: 'demo',
    user: {
      id: 'user-facility',
      email: 'facility@medease.health',
      fullName: 'Robert Vance',
      role: 'facility_admin',
      organizationId: DEMO_ORGANIZATION.id,
      locale: 'en-US',
      timezone: 'America/New_York',
      status: 'active',
    },
  },
  {
    email: 'doctor@medease.health',
    password: 'demo',
    user: {
      id: 'user-physician',
      email: 'doctor@medease.health',
      fullName: 'Dr. Emily Chen',
      role: 'physician',
      organizationId: DEMO_ORGANIZATION.id,
      locale: 'en-US',
      timezone: 'America/New_York',
      status: 'active',
    },
  },
  {
    email: 'pharmacy@medease.health',
    password: 'demo',
    user: {
      id: 'user-pharmacy',
      email: 'pharmacy@medease.health',
      fullName: 'David Chen, PharmD',
      role: 'pharmacist',
      organizationId: DEMO_ORGANIZATION.id,
      locale: 'en-US',
      timezone: 'America/New_York',
      status: 'active',
    },
  },
  {
    email: 'transport@medease.health',
    password: 'demo',
    user: {
      id: 'user-transport',
      email: 'transport@medease.health',
      fullName: 'Dispatch Unit A',
      role: 'transport_dispatcher',
      organizationId: DEMO_ORGANIZATION.id,
      locale: 'en-US',
      timezone: 'America/New_York',
      status: 'active',
    },
  },
  {
    email: 'patient@medease.health',
    password: 'demo',
    user: {
      id: 'user-patient',
      email: 'patient@medease.health',
      fullName: 'Sarah Jenkins',
      role: 'patient',
      organizationId: DEMO_ORGANIZATION.id,
      locale: 'en-US',
      timezone: 'America/New_York',
      status: 'active',
    },
  },
];

const accountById = new Map(demoAccounts.map((a) => [a.user.id, a]));
const accountByEmail = new Map(
  demoAccounts.map((a) => [a.email.toLowerCase(), a]),
);

export function getDemoOrganization(): Organization {
  return DEMO_ORGANIZATION;
}

export function findDemoAccount(email: string, password: string) {
  const account = accountByEmail.get(email.toLowerCase());
  if (!account || account.password !== password) {
    return null;
  }
  return account;
}

export function getDemoAccountById(userId: string) {
  return accountById.get(userId) ?? null;
}

export function buildDemoUser(account: DemoAccount): AuthUser {
  return {
    ...account.user,
    permissions: getPermissionsForRole(account.user.role),
    lastLogin: new Date().toISOString(),
  };
}

export function getDemoAccountForRole(role: UserRole) {
  return demoAccounts.find((a) => a.user.role === role) ?? demoAccounts[0]!;
}

export const DEMO_CREDENTIALS_HINT =
  'Demo: patient@medease.health / demo (or any role email with password demo)';
