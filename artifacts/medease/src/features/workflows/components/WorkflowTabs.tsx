import { Link, useLocation } from 'wouter';

import type { WorkflowSection } from '@/features/workflows/components/WorkflowSections';
import { flatModuleTabHref } from '@/shared/hooks/use-portal-path';
import { cn } from '@/shared/lib/utils';

type Tab = { segment: WorkflowSection; label: string; path: string };

const PROFESSIONAL_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Workflows', path: 'workflows' },
  { segment: 'my-tasks', label: 'My Tasks', path: 'my-tasks' },
  { segment: 'approvals', label: 'Approvals', path: 'approvals' },
  { segment: 'processes', label: 'Processes', path: 'processes' },
];

const FACILITY_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Workflows', path: 'workflows' },
  { segment: 'work-queues', label: 'Work Queues', path: 'work-queues' },
  { segment: 'sla-monitor', label: 'SLA Monitor', path: 'sla-monitor' },
  { segment: 'automation', label: 'Automation', path: 'automation' },
];

const ADMIN_TABS: Tab[] = [
  { segment: 'dashboard', label: 'Workflows', path: 'workflows' },
  { segment: 'workflow-designer', label: 'Designer', path: 'workflow-designer' },
  { segment: 'process-library', label: 'Process Library', path: 'process-library' },
  { segment: 'workflow-instances', label: 'Instances', path: 'workflow-instances' },
  { segment: 'business-rules', label: 'Rules', path: 'business-rules' },
  { segment: 'event-bus', label: 'Event Bus', path: 'event-bus' },
  { segment: 'background-jobs', label: 'Jobs', path: 'background-jobs' },
  { segment: 'schedulers', label: 'Schedulers', path: 'schedulers' },
  { segment: 'workflow-analytics', label: 'Analytics', path: 'workflow-analytics' },
  { segment: 'process-monitor', label: 'Monitor', path: 'process-monitor' },
];

interface WorkflowTabsProps {
  basePath: string;
  variant?: 'professional' | 'facility' | 'admin';
}

function getTabs(variant: WorkflowTabsProps['variant']) {
  if (variant === 'facility') return FACILITY_TABS;
  if (variant === 'admin') return ADMIN_TABS;
  return PROFESSIONAL_TABS;
}

export function WorkflowTabs({ basePath: _basePath, variant = 'professional' }: WorkflowTabsProps) {
  const [location] = useLocation();
  const tabs = getTabs(variant);

  return (
    <nav className="flex flex-wrap gap-1 border-b pb-2" aria-label="Workflow sections">
      {tabs.map((tab) => {
        const href = flatModuleTabHref(tab.path);
        const active = location.includes(`/${tab.path}`);
        return (
          <Link key={tab.path} href={href} className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors', active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')} aria-current={active ? 'page' : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

const PATH_MAP: [string, WorkflowSection][] = [
  ['/workflow-analytics', 'workflow-analytics'],
  ['/process-monitor', 'process-monitor'],
  ['/background-jobs', 'background-jobs'],
  ['/workflow-instances', 'workflow-instances'],
  ['/workflow-designer', 'workflow-designer'],
  ['/process-library', 'process-library'],
  ['/business-rules', 'business-rules'],
  ['/work-queues', 'work-queues'],
  ['/sla-monitor', 'sla-monitor'],
  ['/event-bus', 'event-bus'],
  ['/my-tasks', 'my-tasks'],
  ['/schedulers', 'schedulers'],
  ['/approvals', 'approvals'],
  ['/processes', 'processes'],
  ['/automation', 'automation'],
];

export function getWorkflowSectionFromPath(pathname: string): WorkflowSection {
  for (const [path, section] of PATH_MAP) {
    if (pathname.includes(path)) return section;
  }
  return 'dashboard';
}
