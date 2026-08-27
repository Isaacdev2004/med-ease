import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';

import {
  AddBiologicalDataDialog,
  loadBiologicalEntries,
} from '@/features/laboratory/components/AddBiologicalDataDialog';
import { LaboratorySectionContent } from '@/features/laboratory/components/LaboratorySections';
import {
  LaboratoryTabs,
  getLaboratorySectionFromPath,
} from '@/features/laboratory/components/LaboratoryTabs';
import { useLaboratoryPermissions } from '@/features/laboratory/hooks/use-laboratory-permissions';
import { usePatientLaboratoryContext } from '@/features/laboratory/hooks/use-laboratory';
import type { LabOrderFilters } from '@/services/laboratory/types';
import { LoadingView, PageShell } from '@/shared/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { EmptyState } from '@/shared/ui/empty-state';

interface LaboratoryShellProps {
  basePath: string;
  variant?: 'patient' | 'clinician' | 'facility' | 'admin';
  title?: string;
  patientId?: string;
}

export function LaboratoryShell({
  basePath,
  variant = 'patient',
  title = 'Laboratoire',
  patientId: explicitPatientId,
}: LaboratoryShellProps) {
  const [location] = useLocation();
  const perms = useLaboratoryPermissions();
  const patientResolve = usePatientLaboratoryContext();
  const section = getLaboratorySectionFromPath(location);
  const [, setTick] = useState(0);

  const patientId =
    explicitPatientId ??
    (variant === 'patient' ? (patientResolve.data ?? undefined) : undefined);

  const scopedFilters = useMemo((): LabOrderFilters => {
    return patientId ? { patientId } : {};
  }, [patientId]);

  const localBio = patientId ? loadBiologicalEntries(patientId) : [];

  if (!perms.canView) {
    return (
      <PageShell title={title}>
        <EmptyState
          title="Accès refusé"
          description="Vous n’avez pas l’autorisation de consulter le laboratoire."
        />
      </PageShell>
    );
  }

  if (variant === 'patient' && patientResolve.isLoading) {
    return (
      <PageShell title={title}>
        <LoadingView label="Chargement du laboratoire…" />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={title}
      subtitle="Demandes d’analyses, résultats biologiques, tendances et alertes."
    >
      <div className="space-y-6">
        {patientId && perms.canOrder ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Données biologiques</h2>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos résultats d’examens (Formulaire Studio).
              </p>
            </div>
            <AddBiologicalDataDialog
              patientId={patientId}
              onSaved={() => setTick((t) => t + 1)}
            />
          </div>
        ) : null}
        {localBio.length > 0 ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Saisies récentes</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {localBio.slice(0, 6).map((e) => (
                <div
                  key={e.id}
                  className="rounded-lg border border-border/60 p-3 text-sm"
                >
                  <p className="font-medium">{e.examName}</p>
                  <p className="text-muted-foreground">
                    {e.value} {e.unit} · {e.collectedAt}
                  </p>
                  <p className="text-xs text-muted-foreground">{e.labName}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
        <LaboratoryTabs basePath={basePath} variant={variant} />
        <LaboratorySectionContent section={section} filters={scopedFilters} />
      </div>
    </PageShell>
  );
}
