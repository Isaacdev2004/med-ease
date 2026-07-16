import type { DelegationRecord } from '@/services/iam/types';

export function isDelegationActive(delegation: DelegationRecord): boolean {
  if (delegation.status !== 'active') return false;
  return new Date(delegation.endsAt).getTime() > Date.now();
}

export function activeDelegations(delegations: DelegationRecord[]): DelegationRecord[] {
  return delegations.filter(isDelegationActive);
}
