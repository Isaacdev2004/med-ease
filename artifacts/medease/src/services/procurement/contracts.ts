import type { Contract } from '@/services/procurement/types';

export function getExpiringContracts(
  contracts: Contract[],
  withinDays = 30,
): Contract[] {
  const cutoff = Date.now() + withinDays * 86400000;
  return contracts.filter((c) => {
    const end = new Date(c.endDate).getTime();
    return end <= cutoff && c.status !== 'expired' && c.status !== 'terminated';
  });
}

export function renewContract(
  contract: Contract,
  extensionMonths = 12,
): Contract {
  const end = new Date(contract.endDate);
  end.setMonth(end.getMonth() + extensionMonths);
  return {
    ...contract,
    status: 'renewed',
    startDate: contract.endDate,
    endDate: end.toISOString(),
    renewalDate: end.toISOString(),
    updatedAt: new Date().toISOString(),
  } as Contract & { updatedAt?: string };
}

export function contractUtilization(contract: Contract): number {
  if (contract.value <= 0) return 0;
  return Math.round((contract.spendToDate / contract.value) * 100);
}

export function shouldAlertRenewal(
  contract: Contract,
  daysBefore = 30,
): boolean {
  const daysUntil =
    (new Date(contract.endDate).getTime() - Date.now()) / 86400000;
  return (
    daysUntil <= daysBefore && daysUntil > 0 && contract.status !== 'terminated'
  );
}

export function validateContractObligations(contract: Contract): {
  compliant: boolean;
  gaps: string[];
} {
  const gaps: string[] = [];
  if (contractUtilization(contract) > 95)
    gaps.push('Contract value nearly exhausted');
  if (contract.status === 'expiring') gaps.push('Contract expiring soon');
  return { compliant: gaps.length === 0, gaps };
}
