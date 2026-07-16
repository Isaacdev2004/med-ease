import { useMemo } from 'react';
import { useLocation } from 'wouter';

import { BillingSectionContent } from '@/features/billing/components/BillingSections';
import { BillingTabs, getBillingSectionFromPath } from '@/features/billing/components/BillingTabs';
import { useBillingContext } from '@/features/billing/hooks/use-billing';
import { useBillingPermissions } from '@/features/billing/hooks/use-billing-permissions';
import type { BillingFilters } from '@/services/billing/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface BillingShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'pharmacy' | 'admin';
  title?: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  invoiceId?: string;
}

export function BillingShell({
  basePath,
  variant = 'patient',
  title = 'Billing',
  patientId: explicitPatientId,
  providerId: explicitProviderId,
  facilityId: explicitFacilityId,
  invoiceId,
}: BillingShellProps) {
  const [location] = useLocation();
  const perms = useBillingPermissions();
  const patientResolve = useBillingContext();
  const section = getBillingSectionFromPath(location);

  const scopedFilters = useMemo((): BillingFilters => {
    const patientId = explicitPatientId ?? (variant === 'patient' ? patientResolve.data ?? undefined : undefined);
    const providerId = explicitProviderId ?? (variant === 'clinician' ? 'prov-001' : undefined);
    const facilityId = explicitFacilityId ?? (variant === 'facility' ? 'fac-001' : undefined);
    return { ...(patientId ? { patientId } : {}), ...(providerId ? { providerId } : {}), ...(facilityId ? { facilityId } : {}) };
  }, [explicitPatientId, explicitProviderId, explicitFacilityId, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState title="Access denied" description="You do not have permission to view billing." />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading billing…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Revenue cycle management, invoices, insurance claims, payments, and financial analytics."
    >
      <div className="space-y-6">
        <BillingTabs basePath={basePath} variant={variant} />
        <BillingSectionContent section={section} filters={scopedFilters} invoiceId={invoiceId} />
      </div>
    </PageShell>
  );
}
