import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/workflows/pages/ProfessionalWorkflowsPage');
const facilityPage = () =>
  import('@/features/workflows/pages/FacilityWorkflowsPage');
const adminPage = () => import('@/features/workflows/pages/AdminWorkflowsPage');

export function createProfessionalWorkflowRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/workflows',
      title: 'Workflows',
      breadcrumb: 'Workflows',
      analyticsName: `${analyticsPrefix}_workflows`,
      lazy: professionalPage,
      nav,
      permission: 'workflow.read',
      featureFlag: 'workflows',
    },
    {
      path: '/my-tasks',
      title: 'My Tasks',
      breadcrumb: 'My Tasks',
      analyticsName: `${analyticsPrefix}_my_tasks`,
      lazy: professionalPage,
      permission: 'workflow.read',
      featureFlag: 'workflows',
    },
    {
      path: '/approvals',
      title: 'Approvals',
      breadcrumb: 'Approvals',
      analyticsName: `${analyticsPrefix}_approvals`,
      lazy: professionalPage,
      permission: 'workflow.approvals',
      featureFlag: 'workflows',
    },
    {
      path: '/processes',
      title: 'Processes',
      breadcrumb: 'Processes',
      analyticsName: `${analyticsPrefix}_processes`,
      lazy: professionalPage,
      permission: 'workflow.execute',
      featureFlag: 'workflows',
    },
  ];
}

export function createFacilityWorkflowRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/workflows',
      title: 'Workflows',
      breadcrumb: 'Workflows',
      analyticsName: `${analyticsPrefix}_workflows`,
      lazy: facilityPage,
      nav,
      permission: 'workflow.read',
      featureFlag: 'workflows',
    },
    {
      path: '/work-queues',
      title: 'Work Queues',
      breadcrumb: 'Queues',
      analyticsName: `${analyticsPrefix}_work_queues`,
      lazy: facilityPage,
      permission: 'workflow.read',
      featureFlag: 'workflows',
    },
    {
      path: '/sla-monitor',
      title: 'SLA Monitor',
      breadcrumb: 'SLA',
      analyticsName: `${analyticsPrefix}_sla_monitor`,
      lazy: facilityPage,
      permission: 'workflow.analytics',
      featureFlag: 'workflows',
    },
    {
      path: '/automation',
      title: 'Automation',
      breadcrumb: 'Automation',
      analyticsName: `${analyticsPrefix}_automation`,
      lazy: facilityPage,
      permission: 'workflow.execute',
      featureFlag: 'workflows',
    },
  ];
}

export function createAdminWorkflowRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  const page = adminPage;
  const flag = 'workflows' as const;
  return [
    {
      path: '/workflows',
      title: 'Workflow Hub',
      breadcrumb: 'Workflows',
      analyticsName: `${analyticsPrefix}_workflows`,
      lazy: page,
      nav,
      permission: 'workflow.read',
      featureFlag: flag,
    },
    {
      path: '/workflow-designer',
      title: 'Workflow Designer',
      breadcrumb: 'Designer',
      analyticsName: `${analyticsPrefix}_workflow_designer`,
      lazy: page,
      permission: 'workflow.write',
      featureFlag: flag,
    },
    {
      path: '/process-library',
      title: 'Process Library',
      breadcrumb: 'Library',
      analyticsName: `${analyticsPrefix}_process_library`,
      lazy: page,
      permission: 'workflow.read',
      featureFlag: flag,
    },
    {
      path: '/workflow-instances',
      title: 'Workflow Instances',
      breadcrumb: 'Instances',
      analyticsName: `${analyticsPrefix}_workflow_instances`,
      lazy: page,
      permission: 'workflow.execute',
      featureFlag: flag,
    },
    {
      path: '/business-rules',
      title: 'Business Rules',
      breadcrumb: 'Rules',
      analyticsName: `${analyticsPrefix}_business_rules`,
      lazy: page,
      permission: 'workflow.rules',
      featureFlag: flag,
    },
    {
      path: '/event-bus',
      title: 'Event Bus',
      breadcrumb: 'Events',
      analyticsName: `${analyticsPrefix}_event_bus`,
      lazy: page,
      permission: 'workflow.admin',
      featureFlag: flag,
    },
    {
      path: '/background-jobs',
      title: 'Background Jobs',
      breadcrumb: 'Jobs',
      analyticsName: `${analyticsPrefix}_background_jobs`,
      lazy: page,
      permission: 'workflow.scheduler',
      featureFlag: flag,
    },
    {
      path: '/schedulers',
      title: 'Schedulers',
      breadcrumb: 'Schedulers',
      analyticsName: `${analyticsPrefix}_schedulers`,
      lazy: page,
      permission: 'workflow.scheduler',
      featureFlag: flag,
    },
    {
      path: '/workflow-analytics',
      title: 'Workflow Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_workflow_analytics`,
      lazy: page,
      permission: 'workflow.analytics',
      featureFlag: flag,
    },
    {
      path: '/process-monitor',
      title: 'Process Monitor',
      breadcrumb: 'Monitor',
      analyticsName: `${analyticsPrefix}_process_monitor`,
      lazy: page,
      permission: 'workflow.admin',
      featureFlag: flag,
    },
  ];
}
