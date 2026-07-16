import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/reporting/pages/ProfessionalReportingPage');
const facilityPage = () => import('@/features/reporting/pages/FacilityReportingPage');
const adminPage = () => import('@/features/reporting/pages/AdminReportingPage');

export function createProfessionalReportingRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/reports', title: 'Reports', breadcrumb: 'Reports', analyticsName: `${analyticsPrefix}_reports`, lazy: professionalPage, nav, permission: 'reporting.read', featureFlag: 'reporting' },
    { path: '/my-reports', title: 'My Reports', breadcrumb: 'My Reports', analyticsName: `${analyticsPrefix}_my_reports`, lazy: professionalPage, permission: 'reporting.read', featureFlag: 'reporting' },
  ];
}

export function createFacilityReportingRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/reports', title: 'Reports', breadcrumb: 'Reports', analyticsName: `${analyticsPrefix}_reports`, lazy: facilityPage, nav, permission: 'reporting.read', featureFlag: 'reporting' },
    { path: '/scheduled-reports', title: 'Scheduled Reports', breadcrumb: 'Scheduled', analyticsName: `${analyticsPrefix}_scheduled_reports`, lazy: facilityPage, permission: 'reporting.schedule', featureFlag: 'reporting' },
  ];
}

export function createAdminReportingRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  const page = adminPage;
  const flag = 'reporting' as const;
  return [
    { path: '/reports', title: 'Report Hub', breadcrumb: 'Reports', analyticsName: `${analyticsPrefix}_reports`, lazy: page, nav, permission: 'reporting.read', featureFlag: flag },
    { path: '/report-designer', title: 'Report Designer', breadcrumb: 'Designer', analyticsName: `${analyticsPrefix}_report_designer`, lazy: page, permission: 'reporting.design', featureFlag: flag },
    { path: '/report-library', title: 'Report Library', breadcrumb: 'Library', analyticsName: `${analyticsPrefix}_report_library`, lazy: page, permission: 'reporting.read', featureFlag: flag },
    { path: '/report-schedules', title: 'Report Schedules', breadcrumb: 'Schedules', analyticsName: `${analyticsPrefix}_report_schedules`, lazy: page, permission: 'reporting.schedule', featureFlag: flag },
    { path: '/report-exports', title: 'Report Exports', breadcrumb: 'Exports', analyticsName: `${analyticsPrefix}_report_exports`, lazy: page, permission: 'reporting.export', featureFlag: flag },
    { path: '/report-analytics', title: 'Report Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_report_analytics`, lazy: page, permission: 'reporting.analytics', featureFlag: flag },
    { path: '/compliance-reports', title: 'Compliance Reports', breadcrumb: 'Compliance', analyticsName: `${analyticsPrefix}_compliance_reports`, lazy: page, permission: 'reporting.admin', featureFlag: flag },
  ];
}
