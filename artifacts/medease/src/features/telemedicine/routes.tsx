import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () => import('@/features/telemedicine/pages/PatientTelemedicinePage');
const sessionPage = () => import('@/features/telemedicine/pages/SessionDetailPage');
const professionalPage = () => import('@/features/telemedicine/pages/ProfessionalTelemedicinePage');
const facilityPage = () => import('@/features/telemedicine/pages/FacilityTelemedicinePage');
const adminPage = () => import('@/features/telemedicine/pages/AdminTelemedicinePage');

export function createPatientTelemedicineRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;
  return [
    {
      path: '/telemedicine/upcoming',
      title: 'Upcoming Visits',
      breadcrumb: 'Upcoming',
      analyticsName: `${analyticsPrefix}_telemedicine_upcoming`,
      lazy: patientPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/telemedicine/history',
      title: 'Visit History',
      breadcrumb: 'History',
      analyticsName: `${analyticsPrefix}_telemedicine_history`,
      lazy: patientPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/telemedicine/device-check',
      title: 'Device Check',
      breadcrumb: 'Device Check',
      analyticsName: `${analyticsPrefix}_telemedicine_device_check`,
      lazy: patientPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/telemedicine/session/:sessionId',
      title: 'Virtual Visit',
      breadcrumb: 'Session',
      analyticsName: `${analyticsPrefix}_telemedicine_session`,
      lazy: sessionPage,
      permission: 'telemedicine.join',
      featureFlag: 'telemedicine',
    },
    {
      path: '/telemedicine',
      title: 'Telemedicine',
      breadcrumb: 'Telemedicine',
      analyticsName: `${analyticsPrefix}_telemedicine`,
      lazy: patientPage,
      nav,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
  ];
}

export function createProfessionalTelemedicineRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/telemedicine',
      title: 'Telemedicine',
      breadcrumb: 'Telemedicine',
      analyticsName: `${analyticsPrefix}_telemedicine`,
      lazy: professionalPage,
      nav,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/waiting-room',
      title: 'Waiting Room',
      breadcrumb: 'Waiting Room',
      analyticsName: `${analyticsPrefix}_waiting_room`,
      lazy: professionalPage,
      permission: 'telemedicine.host',
      featureFlag: 'telemedicine',
    },
    {
      path: '/current-session',
      title: 'Current Session',
      breadcrumb: 'Current Session',
      analyticsName: `${analyticsPrefix}_current_session`,
      lazy: professionalPage,
      permission: 'telemedicine.join',
      featureFlag: 'telemedicine',
    },
    {
      path: '/telemedicine/history',
      title: 'Visit History',
      breadcrumb: 'History',
      analyticsName: `${analyticsPrefix}_telemedicine_history`,
      lazy: professionalPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/availability',
      title: 'Provider Availability',
      breadcrumb: 'Availability',
      analyticsName: `${analyticsPrefix}_availability`,
      lazy: professionalPage,
      permission: 'telemedicine.write',
      featureFlag: 'telemedicine',
    },
    {
      path: '/session/:sessionId',
      title: 'Virtual Session',
      breadcrumb: 'Session',
      analyticsName: `${analyticsPrefix}_session`,
      lazy: sessionPage,
      permission: 'telemedicine.join',
      featureFlag: 'telemedicine',
    },
  ];
}

export function createFacilityTelemedicineRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/telemedicine',
      title: 'Telemedicine',
      breadcrumb: 'Telemedicine',
      analyticsName: `${analyticsPrefix}_telemedicine`,
      lazy: facilityPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/sessions',
      title: 'Virtual Sessions',
      breadcrumb: 'Sessions',
      analyticsName: `${analyticsPrefix}_telemedicine_sessions`,
      lazy: facilityPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/providers',
      title: 'Telehealth Providers',
      breadcrumb: 'Providers',
      analyticsName: `${analyticsPrefix}_telemedicine_providers`,
      lazy: facilityPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/analytics',
      title: 'Telemedicine Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_telemedicine_analytics`,
      lazy: facilityPage,
      permission: 'telemedicine.analytics',
      featureFlag: 'telemedicine',
    },
  ];
}

export function createAdminTelemedicineRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/telemedicine',
      title: 'Telemedicine',
      breadcrumb: 'Telemedicine',
      analyticsName: `${analyticsPrefix}_telemedicine`,
      lazy: adminPage,
      permission: 'telemedicine.read',
      featureFlag: 'telemedicine',
    },
    {
      path: '/telemedicine/analytics',
      title: 'Telemedicine Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_telemedicine_analytics`,
      lazy: adminPage,
      permission: 'telemedicine.analytics',
      featureFlag: 'telemedicine',
    },
    {
      path: '/providers',
      title: 'Provider Management',
      breadcrumb: 'Providers',
      analyticsName: `${analyticsPrefix}_telemedicine_providers`,
      lazy: adminPage,
      permission: 'telemedicine.admin',
      featureFlag: 'telemedicine',
    },
    {
      path: '/platform-health',
      title: 'Platform Health',
      breadcrumb: 'Platform Health',
      analyticsName: `${analyticsPrefix}_platform_health`,
      lazy: adminPage,
      permission: 'telemedicine.admin',
      featureFlag: 'telemedicine',
    },
  ];
}
