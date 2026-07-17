import { useState } from 'react';

import {
  PortalActionButton,
  PortalDataTableSection,
  PortalMetricsGrid,
  PortalStatusBadge,
} from '@/features/portal-pages/components/PortalUtilityComponents';
import {
  MOCK_CLINICAL_TASKS,
  type ClinicalTaskRow,
} from '@/features/portal-pages/data/mock-data';
import type { DataTableColumn } from '@/shared/components';
import { PageShell } from '@/shared/components';
import { DropdownMenuItem } from '@/shared/ui/dropdown-menu';

const columns: DataTableColumn<ClinicalTaskRow>[] = [
  { id: 'task', header: 'Task', cell: (row) => row.task },
  { id: 'patient', header: 'Patient', cell: (row) => row.patient },
  { id: 'dueAt', header: 'Due', cell: (row) => row.dueAt },
  {
    id: 'priority',
    header: 'Priority',
    cell: (row) => (
      <PortalStatusBadge
        label={row.priority}
        variant={
          row.priority === 'high'
            ? 'destructive'
            : row.priority === 'medium'
              ? 'secondary'
              : 'outline'
        }
      />
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: (row) => <PortalStatusBadge label={row.status} />,
  },
];

export default function ClinicalTasksPage() {
  const [tasks, setTasks] = useState(MOCK_CLINICAL_TASKS);

  const open = tasks.filter((row) => row.status !== 'done').length;
  const highPriority = tasks.filter(
    (row) => row.priority === 'high' && row.status !== 'done',
  ).length;

  return (
    <PageShell
      title="Clinical Tasks"
      subtitle="Your assigned clinical workflows and follow-ups."
      primaryAction={
        <PortalActionButton label="Add task" successTitle="Task created" />
      }
    >
      <PortalMetricsGrid
        columns={3}
        metrics={[
          { title: 'Open tasks', value: open, status: 'observation' },
          { title: 'High priority', value: highPriority, status: 'critical' },
          { title: 'Completed today', value: 5, status: 'stable' },
        ]}
      />

      <PortalDataTableSection
        title="Task list"
        description="Prioritized by due time and clinical urgency."
        actionLabel="Bulk complete"
        columns={columns}
        data={tasks}
        getRowId={(row) => row.id}
        rowActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() => {
                setTasks((prev) =>
                  prev.map((item) =>
                    item.id === row.id
                      ? { ...item, status: 'done' as const }
                      : item,
                  ),
                );
              }}
            >
              Mark done
            </DropdownMenuItem>
            <DropdownMenuItem>Reassign</DropdownMenuItem>
          </>
        )}
      />
    </PageShell>
  );
}
