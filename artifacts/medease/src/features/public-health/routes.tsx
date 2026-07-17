import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/public-health/pages/ProfessionalPublicHealthPage');
const facilityPage = () =>
  import('@/features/public-health/pages/FacilityPublicHealthPage');
const adminPage = () =>
  import('@/features/public-health/pages/AdminPublicHealthPage');

export function createProfessionalPublicHealthRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/public-health',
      title: 'Public Health',
      breadcrumb: 'Public Health',
      analyticsName: `${analyticsPrefix}_public_health`,
      lazy: professionalPage,
      nav,
      permission: 'publicHealth.read',
      featureFlag: 'publicHealth',
    },
    {
      path: '/disease-surveillance',
      title: 'Disease Surveillance',
      breadcrumb: 'Surveillance',
      analyticsName: `${analyticsPrefix}_disease_surveillance`,
      lazy: professionalPage,
      permission: 'publicHealth.surveillance',
      featureFlag: 'publicHealth',
    },
    {
      path: '/immunizations',
      title: 'Immunizations',
      breadcrumb: 'Immunizations',
      analyticsName: `${analyticsPrefix}_immunizations`,
      lazy: professionalPage,
      permission: 'publicHealth.immunizations',
      featureFlag: 'publicHealth',
    },
    {
      path: '/community-programs',
      title: 'Community Programs',
      breadcrumb: 'Programs',
      analyticsName: `${analyticsPrefix}_community_programs`,
      lazy: professionalPage,
      permission: 'publicHealth.community',
      featureFlag: 'publicHealth',
    },
    {
      path: '/sdoh',
      title: 'SDOH',
      breadcrumb: 'SDOH',
      analyticsName: `${analyticsPrefix}_sdoh`,
      lazy: professionalPage,
      permission: 'publicHealth.sdoh',
      featureFlag: 'publicHealth',
    },
  ];
}

export function createFacilityPublicHealthRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/public-health',
      title: 'Public Health',
      breadcrumb: 'Public Health',
      analyticsName: `${analyticsPrefix}_public_health`,
      lazy: facilityPage,
      nav,
      permission: 'publicHealth.read',
      featureFlag: 'publicHealth',
    },
    {
      path: '/outbreaks',
      title: 'Outbreaks',
      breadcrumb: 'Outbreaks',
      analyticsName: `${analyticsPrefix}_outbreaks`,
      lazy: facilityPage,
      permission: 'publicHealth.outbreaks',
      featureFlag: 'publicHealth',
    },
    {
      path: '/contact-tracing',
      title: 'Contact Tracing',
      breadcrumb: 'Contact Tracing',
      analyticsName: `${analyticsPrefix}_contact_tracing`,
      lazy: facilityPage,
      permission: 'publicHealth.outbreaks',
      featureFlag: 'publicHealth',
    },
    {
      path: '/environmental-health',
      title: 'Environmental Health',
      breadcrumb: 'Environmental',
      analyticsName: `${analyticsPrefix}_environmental_health`,
      lazy: facilityPage,
      permission: 'publicHealth.read',
      featureFlag: 'publicHealth',
    },
    {
      path: '/community-outreach',
      title: 'Community Outreach',
      breadcrumb: 'Outreach',
      analyticsName: `${analyticsPrefix}_community_outreach`,
      lazy: facilityPage,
      permission: 'publicHealth.community',
      featureFlag: 'publicHealth',
    },
  ];
}

export function createAdminPublicHealthRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/public-health',
      title: 'Public Health Hub',
      breadcrumb: 'Public Health',
      analyticsName: `${analyticsPrefix}_public_health`,
      lazy: adminPage,
      nav,
      permission: 'publicHealth.read',
      featureFlag: 'publicHealth',
    },
    {
      path: '/epidemiology',
      title: 'Epidemiology',
      breadcrumb: 'Epidemiology',
      analyticsName: `${analyticsPrefix}_epidemiology`,
      lazy: adminPage,
      permission: 'publicHealth.surveillance',
      featureFlag: 'publicHealth',
    },
    {
      path: '/immunization-registry',
      title: 'Immunization Registry',
      breadcrumb: 'Registry',
      analyticsName: `${analyticsPrefix}_immunization_registry`,
      lazy: adminPage,
      permission: 'publicHealth.immunizations',
      featureFlag: 'publicHealth',
    },
    {
      path: '/maternal-child-health',
      title: 'Maternal & Child Health',
      breadcrumb: 'Maternal & Child',
      analyticsName: `${analyticsPrefix}_maternal_child_health`,
      lazy: adminPage,
      permission: 'publicHealth.community',
      featureFlag: 'publicHealth',
    },
    {
      path: '/school-health',
      title: 'School Health',
      breadcrumb: 'School Health',
      analyticsName: `${analyticsPrefix}_school_health`,
      lazy: adminPage,
      permission: 'publicHealth.community',
      featureFlag: 'publicHealth',
    },
    {
      path: '/occupational-health',
      title: 'Occupational Health',
      breadcrumb: 'Occupational',
      analyticsName: `${analyticsPrefix}_occupational_health`,
      lazy: adminPage,
      permission: 'publicHealth.read',
      featureFlag: 'publicHealth',
    },
    {
      path: '/public-health-analytics',
      title: 'Public Health Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_public_health_analytics`,
      lazy: adminPage,
      permission: 'publicHealth.analytics',
      featureFlag: 'publicHealth',
    },
    {
      path: '/community-health-dashboard',
      title: 'Community Dashboard',
      breadcrumb: 'Community',
      analyticsName: `${analyticsPrefix}_community_health_dashboard`,
      lazy: adminPage,
      permission: 'publicHealth.analytics',
      featureFlag: 'publicHealth',
    },
  ];
}
