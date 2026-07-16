import {
  PortalActionButton,
  PortalListCard,
  PortalMetricsGrid,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell } from '@/shared/components';

const docs = [
  { id: 'd1', primary: 'Discharge summary — Jan 2026', secondary: 'PDF · 420 KB', badge: 'Clinical' },
  { id: 'd2', primary: 'Insurance authorization', secondary: 'PDF · 180 KB', badge: 'Administrative' },
  { id: 'd3', primary: 'Lab report — Chemistry panel', secondary: 'PDF · 95 KB', badge: 'Laboratory' },
  { id: 'd4', primary: 'Consent — Telemedicine', secondary: 'Signed · PDF', badge: 'Consent' },
];

export default function PatientDocumentsPage() {
  return (
    <PageShell
      title="Documents"
      subtitle="Download and share documents from your care journey."
      primaryAction={<PortalActionButton label="Upload document" successTitle="Document uploaded" />}
      secondaryActions={<PortalActionButton label="Request records" variant="outline" successTitle="Request submitted" />}
    >
      <PortalMetricsGrid
        metrics={[
          { title: 'Available documents', value: String(docs.length), status: 'stable' },
          { title: 'Pending signatures', value: '1', status: 'observation' },
          { title: 'Shared links', value: '2', status: 'stable' },
        ]}
      />
      <PortalListCard title="Your documents" items={docs} actionLabel="Download all" />
    </PageShell>
  );
}
