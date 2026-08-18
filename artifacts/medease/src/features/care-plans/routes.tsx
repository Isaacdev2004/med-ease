import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () =>
  import('@/features/care-plans/pages/PatientCarePlanPage');
const professionalPage = () =>
  import('@/features/care-plans/pages/ProfessionalCarePlansPage');
const facilityPage = () =>
  import('@/features/care-plans/pages/FacilityCarePlansPage');
const adminPage = () =>
  import('@/features/care-plans/pages/AdminCareAnalyticsPage');

const PATIENT_SECTIONS = [
  { segment: 'goals', label: 'Objectifs' },
  { segment: 'tasks', label: 'Tâches' },
  { segment: 'timeline', label: 'Timeline' },
  { segment: 'team', label: 'Équipe' },
  { segment: 'progress', label: 'Progrès' },
  { segment: 'education', label: 'Éducation' },
] as const;

export function createPatientCarePlanRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;

  const sectionRoutes: RouteDefinition[] = PATIENT_SECTIONS.map((section) => ({
    path: `/care-plan/${section.segment}`,
    title: `E-Parcours — ${section.label}`,
    breadcrumb: section.label,
    analyticsName: `${analyticsPrefix}_care_plan_${section.segment}`,
    lazy: patientPage,
    permission: 'care-plans.read',
  }));

  return [
    ...sectionRoutes,
    {
      path: '/care-plan',
      title: 'Mon E-Parcours',
      breadcrumb: 'E-Parcours',
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
      title: 'Plans de soins',
      breadcrumb: 'Plans de soins',
      analyticsName: `${analyticsPrefix}_care_plans`,
      lazy: professionalPage,
      permission: 'care-plans.read',
      nav,
    },
    {
      path: '/patient/:patientId/care-plan',
      title: 'E-Parcours patient',
      breadcrumb: 'E-Parcours',
      analyticsName: `${analyticsPrefix}_patient_care_plan`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
    {
      path: '/patient/:patientId/tasks',
      title: 'Tâches patient',
      breadcrumb: 'Tâches',
      analyticsName: `${analyticsPrefix}_patient_tasks`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
    {
      path: '/patient/:patientId/goals',
      title: 'Objectifs patient',
      breadcrumb: 'Objectifs',
      analyticsName: `${analyticsPrefix}_patient_goals`,
      lazy: professionalPage,
      permission: 'care-plans.read',
    },
    {
      path: '/pathways',
      title: 'Parcours cliniques',
      breadcrumb: 'Parcours',
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
      title: 'Plans de soins',
      breadcrumb: 'Plans de soins',
      analyticsName: `${analyticsPrefix}_care_plans`,
      lazy: facilityPage,
      permission: 'care-plans.read',
      nav,
    },
    {
      path: '/coordination',
      title: 'Coordination clinique',
      breadcrumb: 'Coordination',
      analyticsName: `${analyticsPrefix}_coordination`,
      lazy: facilityPage,
      permission: 'care-plans.read',
    },
    {
      path: '/ward-care',
      title: 'Soins en service',
      breadcrumb: 'Service',
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
      title: 'Plans de soins',
      breadcrumb: 'Plans de soins',
      analyticsName: `${analyticsPrefix}_care_plans`,
      lazy: adminPage,
      permission: 'care-plans.read',
      nav,
    },
    {
      path: '/care-quality',
      title: 'Qualité des soins',
      breadcrumb: 'Qualité',
      analyticsName: `${analyticsPrefix}_care_quality`,
      lazy: adminPage,
      permission: 'care-plans.read',
    },
    {
      path: '/population-health',
      title: 'Santé populationnelle',
      breadcrumb: 'Population',
      analyticsName: `${analyticsPrefix}_population_health`,
      lazy: adminPage,
      permission: 'care-plans.read',
    },
    {
      path: '/care-analytics',
      title: 'Analytique soins',
      breadcrumb: 'Analytique',
      analyticsName: `${analyticsPrefix}_care_analytics`,
      lazy: adminPage,
      permission: 'care-plans.read',
    },
  ];
}
