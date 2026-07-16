import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () => import('@/features/radiology/pages/PatientRadiologyPage');
const professionalPage = () => import('@/features/radiology/pages/ProfessionalRadiologyPage');
const facilityPage = () => import('@/features/radiology/pages/FacilityRadiologyPage');
const adminPage = () => import('@/features/radiology/pages/AdminRadiologyPage');

export function createPatientRadiologyRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;
  return [
    {
      path: '/radiology/history',
      title: 'Imaging History',
      breadcrumb: 'History',
      analyticsName: `${analyticsPrefix}_radiology_history`,
      lazy: patientPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/radiology/report/:reportId',
      title: 'Diagnostic Report',
      breadcrumb: 'Report',
      analyticsName: `${analyticsPrefix}_radiology_report`,
      lazy: patientPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/radiology/:studyId',
      title: 'Study Details',
      breadcrumb: 'Study',
      analyticsName: `${analyticsPrefix}_radiology_study`,
      lazy: patientPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/radiology',
      title: 'My Imaging',
      breadcrumb: 'Radiology',
      analyticsName: `${analyticsPrefix}_radiology`,
      lazy: patientPage,
      nav,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
  ];
}

export function createProfessionalRadiologyRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/radiology',
      title: 'Radiology',
      breadcrumb: 'Radiology',
      analyticsName: `${analyticsPrefix}_radiology`,
      lazy: professionalPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
      nav,
    },
    {
      path: '/worklist',
      title: 'Worklist',
      breadcrumb: 'Worklist',
      analyticsName: `${analyticsPrefix}_worklist`,
      lazy: professionalPage,
      permission: 'radiology.report',
      featureFlag: 'imaging',
    },
    {
      path: '/reports',
      title: 'Reports',
      breadcrumb: 'Reports',
      analyticsName: `${analyticsPrefix}_radiology_reports`,
      lazy: professionalPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/radiology/critical',
      title: 'Critical Results',
      breadcrumb: 'Critical',
      analyticsName: `${analyticsPrefix}_radiology_critical`,
      lazy: professionalPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/viewer/:studyId',
      title: 'Image Viewer',
      breadcrumb: 'Viewer',
      analyticsName: `${analyticsPrefix}_viewer`,
      lazy: professionalPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/compare',
      title: 'Compare Studies',
      breadcrumb: 'Compare',
      analyticsName: `${analyticsPrefix}_compare`,
      lazy: professionalPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/patient/:patientId/radiology',
      title: 'Patient Imaging',
      breadcrumb: 'Radiology',
      analyticsName: `${analyticsPrefix}_patient_radiology`,
      lazy: professionalPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
  ];
}

export function createFacilityRadiologyRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/radiology',
      title: 'Radiology',
      breadcrumb: 'Radiology',
      analyticsName: `${analyticsPrefix}_radiology`,
      lazy: facilityPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
      nav,
    },
    {
      path: '/dashboard',
      title: 'Imaging Dashboard',
      breadcrumb: 'Dashboard',
      analyticsName: `${analyticsPrefix}_imaging_dashboard`,
      lazy: facilityPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/imaging',
      title: 'Imaging',
      breadcrumb: 'Imaging',
      analyticsName: `${analyticsPrefix}_imaging`,
      lazy: facilityPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
    {
      path: '/devices',
      title: 'Devices',
      breadcrumb: 'Devices',
      analyticsName: `${analyticsPrefix}_devices`,
      lazy: facilityPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
    },
  ];
}

export function createAdminRadiologyRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/radiology',
      title: 'Radiology',
      breadcrumb: 'Radiology',
      analyticsName: `${analyticsPrefix}_radiology`,
      lazy: adminPage,
      permission: 'radiology.read',
      featureFlag: 'imaging',
      nav,
    },
    {
      path: '/radiology/analytics',
      title: 'Radiology Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_radiology_analytics`,
      lazy: adminPage,
      permission: 'radiology.admin',
      featureFlag: 'imaging',
    },
    {
      path: '/radiology/devices',
      title: 'Devices',
      breadcrumb: 'Devices',
      analyticsName: `${analyticsPrefix}_radiology_devices`,
      lazy: adminPage,
      permission: 'radiology.admin',
      featureFlag: 'imaging',
    },
    {
      path: '/radiology/workload',
      title: 'Workload',
      breadcrumb: 'Workload',
      analyticsName: `${analyticsPrefix}_radiology_workload`,
      lazy: adminPage,
      permission: 'radiology.admin',
      featureFlag: 'imaging',
    },
  ];
}
