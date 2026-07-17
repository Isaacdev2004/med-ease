import { useLocation } from 'wouter';

import { WorkflowShell } from '@/features/workflows/components/WorkflowShell';
import { resolveModuleBasePath } from '@/shared/hooks/use-portal-path';

type Segment = 'workflows' | 'work-queues' | 'sla-monitor' | 'automation';

function resolveSegment(location: string): Segment {
  if (location.includes('/work-queues')) return 'work-queues';
  if (location.includes('/sla-monitor')) return 'sla-monitor';
  if (location.includes('/automation')) return 'automation';
  return 'workflows';
}

const TITLES: Record<Segment, string> = {
  workflows: 'Workflows',
  'work-queues': 'Work Queues',
  'sla-monitor': 'SLA Monitor',
  automation: 'Automation',
};

export default function FacilityWorkflowsPage() {
  const [location] = useLocation();
  const segment = resolveSegment(location);
  return (
    <WorkflowShell
      basePath={resolveModuleBasePath(location, segment)}
      variant="facility"
      title={TITLES[segment]}
    />
  );
}
