import type { Tenant, TenantStatus } from '@/services/platform-admin/types';

export function canActivateTenant(tenant: Tenant): boolean {
  return tenant.status === 'suspended' || tenant.status === 'trial';
}

export function nextTenantStatus(
  current: TenantStatus,
  action: 'activate' | 'suspend' | 'archive',
): TenantStatus {
  if (action === 'activate') return 'active';
  if (action === 'suspend') return 'suspended';
  return 'archived';
}

export function activeTenantCount(tenants: Tenant[]): number {
  return tenants.filter((t) => t.status === 'active').length;
}

export function tenantGrowthRate(tenants: Tenant[]): number {
  if (tenants.length === 0) return 0;
  const active = activeTenantCount(tenants);
  return Math.round((active / tenants.length) * 100);
}
