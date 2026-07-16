import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/executive/pages/ProfessionalExecutivePage');
const facilityPage = () => import('@/features/executive/pages/FacilityExecutivePage');
const adminPage = () => import('@/features/executive/pages/AdminExecutivePage');

export function createProfessionalExecutiveRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/executive', title: 'Executive Command Center', breadcrumb: 'Executive', analyticsName: `${analyticsPrefix}_executive`, lazy: professionalPage, nav, permission: 'executive.read', featureFlag: 'executive' },
    { path: '/department-dashboard', title: 'Department Dashboard', breadcrumb: 'Department', analyticsName: `${analyticsPrefix}_department_dashboard`, lazy: professionalPage, permission: 'executive.kpis', featureFlag: 'executive' },
  ];
}

export function createFacilityExecutiveRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/executive', title: 'Executive Command Center', breadcrumb: 'Executive', analyticsName: `${analyticsPrefix}_executive`, lazy: facilityPage, nav, permission: 'executive.read', featureFlag: 'executive' },
    { path: '/operations-center', title: 'Operations Center', breadcrumb: 'Operations', analyticsName: `${analyticsPrefix}_operations_center`, lazy: facilityPage, permission: 'executive.operations', featureFlag: 'executive' },
    { path: '/capacity', title: 'Capacity', breadcrumb: 'Capacity', analyticsName: `${analyticsPrefix}_capacity`, lazy: facilityPage, permission: 'executive.capacity', featureFlag: 'executive' },
    { path: '/patient-flow', title: 'Patient Flow', breadcrumb: 'Patient Flow', analyticsName: `${analyticsPrefix}_patient_flow`, lazy: facilityPage, permission: 'executive.operations', featureFlag: 'executive' },
    { path: '/executive-scorecards', title: 'Executive Scorecards', breadcrumb: 'Scorecards', analyticsName: `${analyticsPrefix}_executive_scorecards`, lazy: facilityPage, permission: 'executive.kpis', featureFlag: 'executive' },
  ];
}

export function createAdminExecutiveRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/executive', title: 'Executive Hub', breadcrumb: 'Executive', analyticsName: `${analyticsPrefix}_executive`, lazy: adminPage, nav, permission: 'executive.read', featureFlag: 'executive' },
    { path: '/enterprise-dashboard', title: 'Enterprise Dashboard', breadcrumb: 'Enterprise', analyticsName: `${analyticsPrefix}_enterprise_dashboard`, lazy: adminPage, permission: 'executive.read', featureFlag: 'executive' },
    { path: '/enterprise-kpis', title: 'Enterprise KPIs', breadcrumb: 'KPIs', analyticsName: `${analyticsPrefix}_enterprise_kpis`, lazy: adminPage, permission: 'executive.kpis', featureFlag: 'executive' },
    { path: '/benchmarking', title: 'Benchmarking', breadcrumb: 'Benchmarking', analyticsName: `${analyticsPrefix}_benchmarking`, lazy: adminPage, permission: 'executive.benchmarking', featureFlag: 'executive' },
    { path: '/strategic-initiatives', title: 'Strategic Initiatives', breadcrumb: 'Initiatives', analyticsName: `${analyticsPrefix}_strategic_initiatives`, lazy: adminPage, permission: 'executive.admin', featureFlag: 'executive' },
    { path: '/executive-analytics', title: 'Executive Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_executive_analytics`, lazy: adminPage, permission: 'executive.analytics', featureFlag: 'executive' },
    { path: '/executive-forecasting', title: 'Executive Forecasting', breadcrumb: 'Forecasting', analyticsName: `${analyticsPrefix}_executive_forecasting`, lazy: adminPage, permission: 'executive.forecasting', featureFlag: 'executive' },
    { path: '/enterprise-alerts', title: 'Enterprise Alerts', breadcrumb: 'Alerts', analyticsName: `${analyticsPrefix}_enterprise_alerts`, lazy: adminPage, permission: 'executive.admin', featureFlag: 'executive' },
  ];
}
