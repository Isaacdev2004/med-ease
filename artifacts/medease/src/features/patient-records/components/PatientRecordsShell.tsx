import { useEffect } from 'react';
import { useLocation } from 'wouter';

import { MegaProfileSummary } from '@/features/patient-records/components/MegaProfileSummary';
import { MegaProfilesPanel } from '@/features/patient-records/components/MegaProfilesPanel';
import { migrateMegaProfileStorage } from '@/features/patient-records/lib/mega-profile-migrate';
import { useAuth } from '@/services/auth/auth-context';
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
  const { user } = useAuth();
  const resolveQuery = usePatientId(routePatientId);
  const patientId = routePatientId ?? resolveQuery.data ?? undefined;
  const recordQuery = usePatientRecord(patientId);
  const section = getSectionFromPath(location);

  useEffect(() => {
    if (user?.id && patientId) {
      migrateMegaProfileStorage(user.id, patientId);
    }
  }, [user?.id, patientId]);

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

  const record = recordQuery.data!;
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
        <MegaProfileSummary patientId={patientId} />
        {showProfiles ? (
          <MegaProfilesPanel basePath={basePath} patientId={patientId} />
        ) : null}
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
