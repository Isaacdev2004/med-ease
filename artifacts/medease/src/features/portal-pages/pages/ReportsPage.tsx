import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import { PageShell } from '@/shared/components';
import type { DataTableColumn } from '@/shared/components';

interface ReportRow {
  id: string;
  name: string;
  category: string;
  format: string;
  schedule: string;
}

const reports: ReportRow[] = [
  {
    id: 'r1',
    name: 'Dispensing summary',
    category: 'Operations',
    format: 'PDF',
    schedule: 'Daily',
  },
  {
    id: 'r2',
    name: 'Inventory expiry',
    category: 'Inventory',
    format: 'Excel',
    schedule: 'Weekly',
  },
  {
    id: 'r3',
    name: 'Controlled substance log',
    category: 'Compliance',
    format: 'PDF',
    schedule: 'Monthly',
  },
];

const columns: DataTableColumn<ReportRow>[] = [
  { id: 'name', header: 'Report', cell: (row) => row.name },
  { id: 'category', header: 'Category', cell: (row) => row.category },
  { id: 'format', header: 'Format', cell: (row) => row.format },
  { id: 'schedule', header: 'Schedule', cell: (row) => row.schedule },
];

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports"
      subtitle="Operational and compliance reports for pharmacy operations."
      primaryAction={
        <PortalActionButton
          label="Generate report"
          successTitle="Report queued"
        />
      }
      secondaryActions={
        <PortalActionButton
          label="Schedule export"
          variant="outline"
          successTitle="Schedule saved"
        />
      }
    >
      <PortalMetricsGrid
        metrics={[
          { title: 'Reports this month', value: '48', status: 'stable' },
          { title: 'Scheduled jobs', value: '6', status: 'stable' },
          { title: 'Failed exports', value: '0', status: 'stable' },
        ]}
      />
      <PortalDataTableSection
        title="Report library"
        columns={columns}
        data={reports}
        getRowId={(row) => row.id}
        rowActions={() => (
          <PortalActionButton
            label="Run"
            variant="outline"
            successTitle="Report generated"
          />
        )}
      />
    </PageShell>
  );
}
