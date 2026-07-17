import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/workforce/pages/ProfessionalWorkforcePage');
const facilityPage = () =>
  import('@/features/workforce/pages/FacilityWorkforcePage');
const adminPage = () => import('@/features/workforce/pages/AdminWorkforcePage');

export function createProfessionalWorkforceRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/workforce',
      title: 'Workforce',
      breadcrumb: 'Workforce',
      analyticsName: `${analyticsPrefix}_workforce`,
      lazy: professionalPage,
      nav,
      permission: 'workforce.read',
      featureFlag: 'workforce',
    },
    {
      path: '/workforce-schedule',
      title: 'My Schedule',
      breadcrumb: 'Schedule',
      analyticsName: `${analyticsPrefix}_workforce_schedule`,
      lazy: professionalPage,
      permission: 'workforce.read',
      featureFlag: 'workforce',
    },
    {
      path: '/attendance',
      title: 'Attendance',
      breadcrumb: 'Attendance',
      analyticsName: `${analyticsPrefix}_attendance`,
      lazy: professionalPage,
      permission: 'workforce.attendance',
      featureFlag: 'workforce',
    },
    {
      path: '/training',
      title: 'Training',
      breadcrumb: 'Training',
      analyticsName: `${analyticsPrefix}_training`,
      lazy: professionalPage,
      permission: 'workforce.training',
      featureFlag: 'workforce',
    },
    {
      path: '/performance',
      title: 'Performance',
      breadcrumb: 'Performance',
      analyticsName: `${analyticsPrefix}_performance`,
      lazy: professionalPage,
      permission: 'workforce.performance',
      featureFlag: 'workforce',
    },
  ];
}

export function createFacilityWorkforceRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/workforce',
      title: 'Workforce',
      breadcrumb: 'Workforce',
      analyticsName: `${analyticsPrefix}_workforce`,
      lazy: facilityPage,
      nav,
      permission: 'workforce.read',
      featureFlag: 'workforce',
    },
    {
      path: '/staff',
      title: 'Staff',
      breadcrumb: 'Staff',
      analyticsName: `${analyticsPrefix}_staff`,
      lazy: facilityPage,
      permission: 'workforce.read',
      featureFlag: 'workforce',
    },
    {
      path: '/scheduling',
      title: 'Scheduling',
      breadcrumb: 'Scheduling',
      analyticsName: `${analyticsPrefix}_scheduling`,
      lazy: facilityPage,
      permission: 'workforce.schedule',
      featureFlag: 'workforce',
    },
    {
      path: '/attendance',
      title: 'Attendance',
      breadcrumb: 'Attendance',
      analyticsName: `${analyticsPrefix}_attendance`,
      lazy: facilityPage,
      permission: 'workforce.attendance',
      featureFlag: 'workforce',
    },
    {
      path: '/leave',
      title: 'Leave',
      breadcrumb: 'Leave',
      analyticsName: `${analyticsPrefix}_leave`,
      lazy: facilityPage,
      permission: 'workforce.write',
      featureFlag: 'workforce',
    },
    {
      path: '/training',
      title: 'Training',
      breadcrumb: 'Training',
      analyticsName: `${analyticsPrefix}_training`,
      lazy: facilityPage,
      permission: 'workforce.training',
      featureFlag: 'workforce',
    },
  ];
}

export function createAdminWorkforceRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/workforce',
      title: 'Workforce',
      breadcrumb: 'Workforce',
      analyticsName: `${analyticsPrefix}_workforce`,
      lazy: adminPage,
      nav,
      permission: 'workforce.read',
      featureFlag: 'workforce',
    },
    {
      path: '/employees',
      title: 'Employees',
      breadcrumb: 'Employees',
      analyticsName: `${analyticsPrefix}_employees`,
      lazy: adminPage,
      permission: 'workforce.admin',
      featureFlag: 'workforce',
    },
    {
      path: '/workforce-departments',
      title: 'Departments',
      breadcrumb: 'Departments',
      analyticsName: `${analyticsPrefix}_departments`,
      lazy: adminPage,
      permission: 'workforce.admin',
      featureFlag: 'workforce',
    },
    {
      path: '/organization',
      title: 'Organization',
      breadcrumb: 'Organization',
      analyticsName: `${analyticsPrefix}_organization`,
      lazy: adminPage,
      permission: 'workforce.admin',
      featureFlag: 'workforce',
    },
    {
      path: '/schedules',
      title: 'Schedules',
      breadcrumb: 'Schedules',
      analyticsName: `${analyticsPrefix}_schedules`,
      lazy: adminPage,
      permission: 'workforce.schedule',
      featureFlag: 'workforce',
    },
    {
      path: '/payroll',
      title: 'Payroll',
      breadcrumb: 'Payroll',
      analyticsName: `${analyticsPrefix}_payroll`,
      lazy: adminPage,
      permission: 'workforce.payroll',
      featureFlag: 'workforce',
    },
    {
      path: '/performance',
      title: 'Performance',
      breadcrumb: 'Performance',
      analyticsName: `${analyticsPrefix}_performance`,
      lazy: adminPage,
      permission: 'workforce.performance',
      featureFlag: 'workforce',
    },
    {
      path: '/credentials',
      title: 'Credentials',
      breadcrumb: 'Credentials',
      analyticsName: `${analyticsPrefix}_credentials`,
      lazy: adminPage,
      permission: 'workforce.admin',
      featureFlag: 'workforce',
    },
    {
      path: '/workforce-analytics',
      title: 'Workforce Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_workforce_analytics`,
      lazy: adminPage,
      permission: 'workforce.analytics',
      featureFlag: 'workforce',
    },
  ];
}
