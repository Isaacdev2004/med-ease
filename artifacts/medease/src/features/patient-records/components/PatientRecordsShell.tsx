import { useLocation } from 'wouter';

import { PatientBanner } from '@/features/patient-records/components/PatientBanner';
import { RecordSectionContent } from '@/features/patient-records/components/RecordSections';
import { getSectionFromPath, RecordTabs } from '@/features/patient-records/components/RecordTabs';
import { usePatientRecordPermissions } from '@/features/patient-records/hooks/use-patient-record-permissions';
import { usePatientId, usePatientRecord } from '@/features/patient-records/hooks/use-patient-records';
import { LoadingView, PageShell } from '@/shared/components';
import { EmptyState } from '@/shared/ui/empty-state';
import { FileQuestion } from 'lucide-react';

interface PatientRecordsShellProps {
  basePath: string;
  routePatientId?: string;
}

export function PatientRecordsShell({ basePath, routePatientId }: PatientRecordsShellProps) {
  const [location] = useLocation();
  const perms = usePatientRecordPermissions();
  const resolveQuery = usePatientId(routePatientId);
  const patientId = routePatientId ?? resolveQuery.data ?? undefined;
  const recordQuery = usePatientRecord(patientId);
  const section = getSectionFromPath(location);

  if (!perms.canView) {
    return (
      <PageShell title="Health Records">
        <EmptyState title="Access denied" description="You do not have permission to view health records." />
      </PageShell>
    );
  }

  if (resolveQuery.isLoading || recordQuery.isLoading) {
    return (
      <PageShell title="Health Records">
        <LoadingView label="Loading health record…" />
      </PageShell>
    );
  }

  if (!recordQuery.data || !patientId) {
    return (
      <PageShell title="Health Records">
        <EmptyState icon={FileQuestion} title="Record not found" description="Unable to load patient health record." />
      </PageShell>
    );
  }

  const record = recordQuery.data;

  return (
    <PageShell
      title="Patient Health Record"
      subtitle={`Longitudinal record · Updated ${new Date(record.updatedAt).toLocaleString()}`}
    >
      <div className="space-y-6">
        <PatientBanner
          demographics={record.demographics}
          healthScore={record.healthScore}
          alerts={record.alerts}
        />
        <RecordTabs basePath={basePath} medicationsOnly={perms.canViewMedicationsOnly} />
        <RecordSectionContent
          section={perms.canViewMedicationsOnly ? 'medications' : section}
          record={record}
        />
      </div>
    </PageShell>
  );
}
