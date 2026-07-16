import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () => import('@/features/care-plans/pages/PatientCarePlanPage');
const professionalPage = () => import('@/features/care-plans/pages/ProfessionalCarePlansPage');
const facilityPage = () => import('@/features/care-plans/pages/FacilityCarePlansPage');
const adminPage = () => import('@/features/care-plans/pages/AdminCareAnalyticsPage');

const PATIENT_SECTIONS = ['goals', 'tasks', 'timeline', 'team', 'progress', 'education'] as const;

export function createPatientCarePlanRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  const sectionRoutes: RouteDefinition[] = PATIENT_SECTIONS.map((section) => ({
    path: `/care-plan/${section}`,
    title: `Care Plan — ${section}`,
    breadcrumb: section.charAt(0).toUpperCase() + section.slice(1),
    analyticsName: `${analyticsPrefix}_care_plan_${section}`,
    lazy: patientPage,
    permission: 'care-plans.read',
  }));

  return [
    ...sectionRoutes,
    {
      path: '/care-plan',
      title: 'My Care Plan',
      breadcrumb: 'Care Plan',
      analyticsName: `${analyticsPrefix}_care_plan`,
      lazy: patientPage,
      nav,
      permission: 'care-plans.read',
    },
  ];
}

export function createProfessionalCarePlanRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/care-plans',
      title: 'Care Plans',
      breadcrumb: 'Care Plans',
      analyticsName: `${analyticsPrefix}_care_plans`,
      lazy: professionalPage,
      permission: 'care-plans.read',
      nav,
    },
    {
      path: '/patient/:patientId/care-plan',
      title: 'Patient Care Plan',
      breadcrumb: 'Care Plan',
      analyticsName: `${analyticsPrefix}_patient_care_plan`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
    {
      path: '/patient/:patientId/tasks',
      title: 'Patient Tasks',
      breadcrumb: 'Tasks',
      analyticsName: `${analyticsPrefix}_patient_tasks`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
    {
      path: '/patient/:patientId/goals',
      title: 'Patient Goals',
      breadcrumb: 'Goals',
      analyticsName: `${analyticsPrefix}_patient_goals`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
    {
      path: '/pathways',
      title: 'Clinical Pathways',
      breadcrumb: 'Pathways',
      analyticsName: `${analyticsPrefix}_pathways`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
  ];
}

export function createFacilityCarePlanRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/care-plans',
      title: 'Care Plans',
      breadcrumb: 'Care Plans',
      analyticsName: `${analyticsPrefix}_care_plans`,
      lazy: facilityPage,
      permission: 'care-plans.read',
      nav,
    },
    {
      path: '/coordination',
      title: 'Clinical Coordination',
      breadcrumb: 'Coordination',
      analyticsName: `${analyticsPrefix}_coordination`,
      lazy: facilityPage,
      permission: 'care-plans.read',
    },
    {
      path: '/ward-care',
      title: 'Ward Care',
      breadcrumb: 'Ward Care',
      analyticsName: `${analyticsPrefix}_ward_care`,
      lazy: facilityPage,
      permission: 'care-plans.read',
    },
  ];
}

export function createAdminCarePlanRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/care-plans',
      title: 'Care Plans',
      breadcrumb: 'Care Plans',
      analyticsName: `${analyticsPrefix}_care_plans`,
      lazy: adminPage,
      permission: 'care-plans.read',
      nav,
    },
    {
      path: '/care-quality',
      title: 'Care Quality',
      breadcrumb: 'Quality',
      analyticsName: `${analyticsPrefix}_care_quality`,
      lazy: adminPage,
      permission: 'care-plans.read',
    },
    {
      path: '/population-health',
      title: 'Population Health',
      breadcrumb: 'Population',
      analyticsName: `${analyticsPrefix}_population_health`,
      lazy: adminPage,
      permission: 'care-plans.read',
    },
    {
      path: '/care-analytics',
      title: 'Care Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_care_analytics`,
      lazy: adminPage,
      permission: 'care-plans.read',
    },
  ];
}
