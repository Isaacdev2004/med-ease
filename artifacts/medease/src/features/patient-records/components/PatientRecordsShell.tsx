import { useLocation } from 'wouter';

import { PatientBanner } from '@/features/patient-records/components/PatientBanner';
import { MegaProfilesPanel } from '@/features/patient-records/components/MegaProfilesPanel';
import { RecordSectionContent } from '@/features/patient-records/components/RecordSections';
import {
  getSectionFromPath,
  RecordTabs,
} from '@/features/patient-records/components/RecordTabs';
import { usePatientRecordPermissions } from '@/features/patient-records/hooks/use-patient-record-permissions';
import {
  usePatientId,
  usePatientRecord,
} from '@/features/patient-records/hooks/use-patient-records';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { FileQuestion } from 'lucide-react';

interface PatientRecordsShellProps {
  basePath: string;
  routePatientId?: string;
}

export function PatientRecordsShell({
  basePath,
  routePatientId,
}: PatientRecordsShellProps) {
  const [location] = useLocation();
  const perms = usePatientRecordPermissions();
  const resolveQuery = usePatientId(routePatientId);
  const patientId = routePatientId ?? resolveQuery.data ?? undefined;
  const recordQuery = usePatientRecord(patientId);
  const section = getSectionFromPath(location);

  if (!perms.canView) {
    return (
      <PageShell title="Mega carnet">
        <EmptyState
          title="Accès refusé"
          description="Vous n’avez pas l’autorisation de consulter le carnet de santé."
        />
      </PageShell>
    );
  }

  if (resolveQuery.isLoading || recordQuery.isLoading) {
    return (
      <PageShell title="Mega carnet">
        <LoadingView label="Chargement du carnet…" />
      </PageShell>
    );
  }

  if (!recordQuery.data || !patientId) {
    return (
      <PageShell title="Mega carnet">
        <EmptyState
          icon={FileQuestion}
          title="Carnet introuvable"
          description="Impossible de charger le dossier patient."
        />
      </PageShell>
    );
  }

  const record = recordQuery.data;
  const showProfiles =
    section === 'dashboard' ||
    location === basePath ||
    location.endsWith('/records');

  return (
    <PageShell
      title="Mega carnet de santé"
      subtitle={`Dossier longitudinal · Mis à jour ${new Date(record.updatedAt).toLocaleString('fr-FR')}`}
    >
      <div className="space-y-6">
        <PatientBanner
          demographics={record.demographics}
          healthScore={record.healthScore}
          alerts={record.alerts}
        />
        {showProfiles ? <MegaProfilesPanel basePath={basePath} /> : null}
        <RecordTabs
          basePath={basePath}
          medicationsOnly={perms.canViewMedicationsOnly}
        />
        <RecordSectionContent
          section={perms.canViewMedicationsOnly ? 'medications' : section}
          record={record}
        />
      </div>
    </PageShell>
  );
}
