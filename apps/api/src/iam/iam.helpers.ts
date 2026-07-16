import type { UserStatus } from '@medease/iam-contract';
import {
  buildExportResult,
  matchQuery,
  toContractPaginated,
} from '@medease/prisma';

export { buildExportResult, matchQuery as matchQ, toContractPaginated };

export function mapUserStatus(status: string): UserStatus {
  switch (status) {
    case 'active':
    case 'inactive':
    case 'locked':
    case 'pending':
      return status;
    default:
      return 'pending';
  }
}

export function permissionModule(name: string): string {
  return name.split('.')[0] ?? 'platform';
}

export const SYSTEM_ACTOR_ID = '00000000-0000-0000-0000-000000000000';

export function generateClientSecret(): string {
  return `mc_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

export function randomTempPassword(): string {
  return `Tmp_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}
