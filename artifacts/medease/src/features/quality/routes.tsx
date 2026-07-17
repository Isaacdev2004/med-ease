import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/quality/pages/ProfessionalQualityPage');
const facilityPage = () =>
  import('@/features/quality/pages/FacilityQualityPage');
const adminPage = () => import('@/features/quality/pages/AdminQualityPage');

export function createProfessionalQualityRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/quality',
      title: 'Quality',
      breadcrumb: 'Quality',
      analyticsName: `${analyticsPrefix}_quality`,
      lazy: professionalPage,
      nav,
      permission: 'quality.read',
      featureFlag: 'quality',
    },
    {
      path: '/incidents',
      title: 'Incidents',
      breadcrumb: 'Incidents',
      analyticsName: `${analyticsPrefix}_incidents`,
      lazy: professionalPage,
      permission: 'quality.incidents',
      featureFlag: 'quality',
    },
    {
      path: '/policies',
      title: 'Policies',
      breadcrumb: 'Policies',
      analyticsName: `${analyticsPrefix}_policies`,
      lazy: professionalPage,
      permission: 'quality.documents',
      featureFlag: 'quality',
    },
  ];
}

export function createFacilityQualityRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/eqms',
      title: 'Quality',
      breadcrumb: 'Quality',
      analyticsName: `${analyticsPrefix}_eqms`,
      lazy: facilityPage,
      nav,
      permission: 'quality.read',
      featureFlag: 'quality',
    },
    {
      path: '/incidents',
      title: 'Incidents',
      breadcrumb: 'Incidents',
      analyticsName: `${analyticsPrefix}_incidents`,
      lazy: facilityPage,
      permission: 'quality.incidents',
      featureFlag: 'quality',
    },
    {
      path: '/infection-control',
      title: 'Infection Control',
      breadcrumb: 'Infection Control',
      analyticsName: `${analyticsPrefix}_infection_control`,
      lazy: facilityPage,
      permission: 'quality.read',
      featureFlag: 'quality',
    },
    {
      path: '/eqms-audits',
      title: 'Audits',
      breadcrumb: 'Audits',
      analyticsName: `${analyticsPrefix}_eqms_audits`,
      lazy: facilityPage,
      permission: 'quality.audits',
      featureFlag: 'quality',
    },
    {
      path: '/compliance',
      title: 'Compliance',
      breadcrumb: 'Compliance',
      analyticsName: `${analyticsPrefix}_compliance`,
      lazy: facilityPage,
      permission: 'quality.analytics',
      featureFlag: 'quality',
    },
  ];
}

export function createAdminQualityRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/quality',
      title: 'Quality',
      breadcrumb: 'Quality',
      analyticsName: `${analyticsPrefix}_quality`,
      lazy: adminPage,
      nav,
      permission: 'quality.read',
      featureFlag: 'quality',
    },
    {
      path: '/risk-register',
      title: 'Risk Register',
      breadcrumb: 'Risk Register',
      analyticsName: `${analyticsPrefix}_risk_register`,
      lazy: adminPage,
      permission: 'quality.risks',
      featureFlag: 'quality',
    },
    {
      path: '/capa',
      title: 'CAPA',
      breadcrumb: 'CAPA',
      analyticsName: `${analyticsPrefix}_capa`,
      lazy: adminPage,
      permission: 'quality.capa',
      featureFlag: 'quality',
    },
    {
      path: '/accreditation',
      title: 'Accreditation',
      breadcrumb: 'Accreditation',
      analyticsName: `${analyticsPrefix}_accreditation`,
      lazy: adminPage,
      permission: 'quality.accreditation',
      featureFlag: 'quality',
    },
    {
      path: '/document-control',
      title: 'Document Control',
      breadcrumb: 'Document Control',
      analyticsName: `${analyticsPrefix}_document_control`,
      lazy: adminPage,
      permission: 'quality.documents',
      featureFlag: 'quality',
    },
    {
      path: '/regulatory',
      title: 'Regulatory',
      breadcrumb: 'Regulatory',
      analyticsName: `${analyticsPrefix}_regulatory`,
      lazy: adminPage,
      permission: 'quality.analytics',
      featureFlag: 'quality',
    },
    {
      path: '/quality-analytics',
      title: 'Quality Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_quality_analytics`,
      lazy: adminPage,
      permission: 'quality.analytics',
      featureFlag: 'quality',
    },
    {
      path: '/eqms-audits',
      title: 'Audits',
      breadcrumb: 'Audits',
      analyticsName: `${analyticsPrefix}_eqms_audits`,
      lazy: adminPage,
      permission: 'quality.audits',
      featureFlag: 'quality',
    },
  ];
}
