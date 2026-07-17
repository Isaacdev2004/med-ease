import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/population-health/pages/ProfessionalPhmPage');
const facilityPage = () =>
  import('@/features/population-health/pages/FacilityPhmPage');
const adminPage = () =>
  import('@/features/population-health/pages/AdminPhmPage');

export function createProfessionalPhmRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/phm',
      title: 'Population Health',
      breadcrumb: 'Population Health',
      analyticsName: `${analyticsPrefix}_phm`,
      lazy: professionalPage,
      nav,
      permission: 'phm.read',
      featureFlag: 'phm',
    },
    {
      path: '/care-gaps',
      title: 'Care Gaps',
      breadcrumb: 'Care Gaps',
      analyticsName: `${analyticsPrefix}_care_gaps`,
      lazy: professionalPage,
      permission: 'phm.gaps',
      featureFlag: 'phm',
    },
    {
      path: '/registries',
      title: 'Registries',
      breadcrumb: 'Registries',
      analyticsName: `${analyticsPrefix}_registries`,
      lazy: professionalPage,
      permission: 'phm.registries',
      featureFlag: 'phm',
    },
    {
      path: '/high-risk-patients',
      title: 'High Risk Patients',
      breadcrumb: 'High Risk',
      analyticsName: `${analyticsPrefix}_high_risk`,
      lazy: professionalPage,
      permission: 'phm.risk',
      featureFlag: 'phm',
    },
    {
      path: '/outreach',
      title: 'Outreach',
      breadcrumb: 'Outreach',
      analyticsName: `${analyticsPrefix}_outreach`,
      lazy: professionalPage,
      permission: 'phm.outreach',
      featureFlag: 'phm',
    },
  ];
}

export function createFacilityPhmRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/phm',
      title: 'Population Health',
      breadcrumb: 'Population Health',
      analyticsName: `${analyticsPrefix}_phm`,
      lazy: facilityPage,
      nav,
      permission: 'phm.read',
      featureFlag: 'phm',
    },
    {
      path: '/phm-programs',
      title: 'Programs',
      breadcrumb: 'Programs',
      analyticsName: `${analyticsPrefix}_phm_programs`,
      lazy: facilityPage,
      permission: 'phm.read',
      featureFlag: 'phm',
    },
    {
      path: '/registries',
      title: 'Registries',
      breadcrumb: 'Registries',
      analyticsName: `${analyticsPrefix}_registries`,
      lazy: facilityPage,
      permission: 'phm.registries',
      featureFlag: 'phm',
    },
    {
      path: '/community-health',
      title: 'Community Health',
      breadcrumb: 'Community Health',
      analyticsName: `${analyticsPrefix}_community_health`,
      lazy: facilityPage,
      permission: 'phm.analytics',
      featureFlag: 'phm',
    },
  ];
}

export function createAdminPhmRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/phm-analytics',
      title: 'Population Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_phm_analytics`,
      lazy: adminPage,
      nav,
      permission: 'phm.analytics',
      featureFlag: 'phm',
    },
    {
      path: '/quality-measures',
      title: 'Quality Measures',
      breadcrumb: 'Quality Measures',
      analyticsName: `${analyticsPrefix}_quality_measures`,
      lazy: adminPage,
      permission: 'phm.analytics',
      featureFlag: 'phm',
    },
    {
      path: '/population-risk',
      title: 'Population Risk',
      breadcrumb: 'Population Risk',
      analyticsName: `${analyticsPrefix}_population_risk`,
      lazy: adminPage,
      permission: 'phm.risk',
      featureFlag: 'phm',
    },
    {
      path: '/phm-executive',
      title: 'Executive Dashboard',
      breadcrumb: 'Executive',
      analyticsName: `${analyticsPrefix}_phm_executive`,
      lazy: adminPage,
      permission: 'phm.analytics',
      featureFlag: 'phm',
    },
    {
      path: '/campaigns',
      title: 'Campaigns',
      breadcrumb: 'Campaigns',
      analyticsName: `${analyticsPrefix}_campaigns`,
      lazy: adminPage,
      permission: 'phm.outreach',
      featureFlag: 'phm',
    },
  ];
}
