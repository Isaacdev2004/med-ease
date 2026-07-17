import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';

import { MedicationSectionContent } from '@/features/medications/components/MedicationSections';
import {
  MedicationTabs,
  getMedicationSectionFromPath,
} from '@/features/medications/components/MedicationTabs';
import { useMedicationPermissions } from '@/features/medications/hooks/use-medication-permissions';
import { usePatientMedicationContext } from '@/features/medications/hooks/use-medications';
import type { MedicationFilters } from '@/services/medications/types';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';

interface MedicationsShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'pharmacy' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
}

export function MedicationsShell({
  basePath,
  variant = 'patient',
  title = 'Medications',
  patientId: explicitPatientId,
}: MedicationsShellProps) {
  const [location] = useLocation();
  const perms = useMedicationPermissions();
  const patientResolve = usePatientMedicationContext();
  const [filters, setFilters] = useState<MedicationFilters>({});
  const section = getMedicationSectionFromPath(location);

  const scopedFilters = useMemo(() => {
    const patientId =
      explicitPatientId ??
      (variant === 'patient'
        ? (patientResolve.data ?? undefined)
        : filters.patientId);
    return { ...filters, ...(patientId ? { patientId } : {}) };
  }, [explicitPatientId, filters, patientResolve.data, variant]);

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Access denied"
          description="You do not have permission to view medications."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Loading medications…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Prescriptions, schedules, adherence, refills, and drug safety — connected across your care team."
      toolbar={
        variant === 'clinician' && !explicitPatientId ? (
          <input
            type="search"
            className="h-9 w-full max-w-xs rounded-md border bg-background px-3 text-sm"
            placeholder="Filter by patient or drug…"
            aria-label="Search medications"
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                q: e.target.value || undefined,
              }))
            }
          />
        ) : undefined
      }
    >
      <div className="space-y-6">
        <MedicationTabs basePath={basePath} variant={variant} />
        <MedicationSectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
