import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () =>
  import('@/features/laboratory/pages/PatientLaboratoryPage');
const professionalPage = () =>
  import('@/features/laboratory/pages/ProfessionalLaboratoryPage');
const facilityPage = () =>
  import('@/features/laboratory/pages/FacilityLaboratoryPage');
const adminPage = () =>
  import('@/features/laboratory/pages/AdminLaboratoryPage');

export function createPatientLaboratoryRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  return [
    {
      path: '/laboratory/history',
      title: 'Lab History',
      breadcrumb: 'History',
      analyticsName: `${analyticsPrefix}_laboratory_history`,
      lazy: patientPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/laboratory/trends',
      title: 'Lab Trends',
      breadcrumb: 'Trends',
      analyticsName: `${analyticsPrefix}_laboratory_trends`,
      lazy: patientPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/laboratory/:resultId',
      title: 'Lab Result Details',
      breadcrumb: 'Result',
      analyticsName: `${analyticsPrefix}_laboratory_result_detail`,
      lazy: patientPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/laboratory',
      title: 'My Laboratory',
      breadcrumb: 'Laboratory',
      analyticsName: `${analyticsPrefix}_laboratory`,
      lazy: patientPage,
      nav,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
  ];
}

export function createProfessionalLaboratoryRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/laboratory',
      title: 'Laboratory',
      breadcrumb: 'Laboratory',
      analyticsName: `${analyticsPrefix}_laboratory`,
      lazy: professionalPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
      nav,
    },
    {
      path: '/results',
      title: 'Lab Results',
      breadcrumb: 'Results',
      analyticsName: `${analyticsPrefix}_lab_results`,
      lazy: professionalPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/laboratory/critical',
      title: 'Critical Results',
      breadcrumb: 'Critical',
      analyticsName: `${analyticsPrefix}_laboratory_critical`,
      lazy: professionalPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/microbiology',
      title: 'Microbiology',
      breadcrumb: 'Microbiology',
      analyticsName: `${analyticsPrefix}_microbiology`,
      lazy: professionalPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/pathology',
      title: 'Pathology',
      breadcrumb: 'Pathology',
      analyticsName: `${analyticsPrefix}_pathology`,
      lazy: professionalPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/patient/:patientId/laboratory',
      title: 'Patient Laboratory',
      breadcrumb: 'Laboratory',
      analyticsName: `${analyticsPrefix}_patient_laboratory`,
      lazy: professionalPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
  ];
}

export function createFacilityLaboratoryRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/laboratory',
      title: 'Laboratory',
      breadcrumb: 'Laboratory',
      analyticsName: `${analyticsPrefix}_laboratory`,
      lazy: facilityPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
      nav,
    },
    {
      path: '/dashboard',
      title: 'Lab Dashboard',
      breadcrumb: 'Dashboard',
      analyticsName: `${analyticsPrefix}_lab_dashboard`,
      lazy: facilityPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/specimens',
      title: 'Specimens',
      breadcrumb: 'Specimens',
      analyticsName: `${analyticsPrefix}_specimens`,
      lazy: facilityPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
    },
    {
      path: '/quality',
      title: 'Quality Control',
      breadcrumb: 'Quality',
      analyticsName: `${analyticsPrefix}_lab_quality`,
      lazy: facilityPage,
      permission: 'laboratory.verify',
      featureFlag: 'laboratory',
    },
  ];
}

export function createAdminLaboratoryRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/laboratory',
      title: 'Laboratory',
      breadcrumb: 'Laboratory',
      analyticsName: `${analyticsPrefix}_laboratory`,
      lazy: adminPage,
      permission: 'laboratory.read',
      featureFlag: 'laboratory',
      nav,
    },
    {
      path: '/laboratory/analytics',
      title: 'Lab Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_laboratory_analytics`,
      lazy: adminPage,
      permission: 'laboratory.admin',
      featureFlag: 'laboratory',
    },
    {
      path: '/laboratory/instruments',
      title: 'Instruments',
      breadcrumb: 'Instruments',
      analyticsName: `${analyticsPrefix}_laboratory_instruments`,
      lazy: adminPage,
      permission: 'laboratory.admin',
      featureFlag: 'laboratory',
    },
    {
      path: '/laboratory/quality',
      title: 'Lab Quality',
      breadcrumb: 'Quality',
      analyticsName: `${analyticsPrefix}_laboratory_quality`,
      lazy: adminPage,
      permission: 'laboratory.admin',
      featureFlag: 'laboratory',
    },
  ];
}
