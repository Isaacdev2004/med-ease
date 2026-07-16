import { useLocation } from 'wouter';

import { WorkflowShell } from '@/features/workflows/components/WorkflowShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'workflows' | 'my-tasks' | 'approvals' | 'processes';

function resolveSegment(location: string): Segment {
  if (location.includes('/my-tasks')) return 'my-tasks';
  if (location.includes('/approvals')) return 'approvals';
  if (location.includes('/processes')) return 'processes';
  return 'workflows';
}

const TITLES: Record<Segment, string> = {
  workflows: 'Workflows',
  'my-tasks': 'My Tasks',
  approvals: 'Approvals',
  processes: 'Processes',
};

export default function ProfessionalWorkflowsPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return <WorkflowShell basePath={resolveModuleBasePath(location, segment)} variant="professional" title={TITLES[segment]} />;
}
