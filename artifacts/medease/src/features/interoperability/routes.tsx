import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/interoperability/pages/ProfessionalInteroperabilityPage');
const facilityPage = () =>
  import('@/features/interoperability/pages/FacilityInteroperabilityPage');
const adminPage = () =>
  import('@/features/interoperability/pages/AdminInteroperabilityPage');

export function createProfessionalInteropRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/interoperability',
      title: 'Interoperability',
      breadcrumb: 'Interoperability',
      analyticsName: `${analyticsPrefix}_interoperability`,
      lazy: professionalPage,
      nav,
      permission: 'interop.read',
      featureFlag: 'interop',
    },
    {
      path: '/external-records',
      title: 'External Records',
      breadcrumb: 'External Records',
      analyticsName: `${analyticsPrefix}_external_records`,
      lazy: professionalPage,
      permission: 'interop.read',
      featureFlag: 'interop',
    },
    {
      path: '/interop-fhir',
      title: 'FHIR Exchange',
      breadcrumb: 'FHIR',
      analyticsName: `${analyticsPrefix}_interop_fhir`,
      lazy: professionalPage,
      permission: 'interop.fhir',
      featureFlag: 'interop',
    },
    {
      path: '/interop-dicom',
      title: 'DICOM Exchange',
      breadcrumb: 'DICOM',
      analyticsName: `${analyticsPrefix}_interop_dicom`,
      lazy: professionalPage,
      permission: 'interop.dicom',
      featureFlag: 'interop',
    },
  ];
}

export function createFacilityInteropRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/interoperability',
      title: 'Integration Dashboard',
      breadcrumb: 'Interoperability',
      analyticsName: `${analyticsPrefix}_interoperability`,
      lazy: facilityPage,
      nav,
      permission: 'interop.read',
      featureFlag: 'interop',
    },
    {
      path: '/interface-engine',
      title: 'Interface Engine',
      breadcrumb: 'Interface Engine',
      analyticsName: `${analyticsPrefix}_interface_engine`,
      lazy: facilityPage,
      permission: 'interop.mapping',
      featureFlag: 'interop',
    },
    {
      path: '/integration-queue',
      title: 'Queue Monitor',
      breadcrumb: 'Queue',
      analyticsName: `${analyticsPrefix}_integration_queue`,
      lazy: facilityPage,
      permission: 'interop.read',
      featureFlag: 'interop',
    },
    {
      path: '/webhooks',
      title: 'Webhooks',
      breadcrumb: 'Webhooks',
      analyticsName: `${analyticsPrefix}_webhooks`,
      lazy: facilityPage,
      permission: 'interop.api',
      featureFlag: 'interop',
    },
    {
      path: '/api-clients',
      title: 'API Clients',
      breadcrumb: 'API Clients',
      analyticsName: `${analyticsPrefix}_api_clients`,
      lazy: facilityPage,
      permission: 'interop.api',
      featureFlag: 'interop',
    },
  ];
}

export function createAdminInteropRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/interoperability',
      title: 'Integration Hub',
      breadcrumb: 'Interoperability',
      analyticsName: `${analyticsPrefix}_interoperability`,
      lazy: adminPage,
      nav,
      permission: 'interop.read',
      featureFlag: 'interop',
    },
    {
      path: '/fhir-servers',
      title: 'FHIR Servers',
      breadcrumb: 'FHIR Servers',
      analyticsName: `${analyticsPrefix}_fhir_servers`,
      lazy: adminPage,
      permission: 'interop.fhir',
      featureFlag: 'interop',
    },
    {
      path: '/interop-hl7',
      title: 'HL7 Messages',
      breadcrumb: 'HL7',
      analyticsName: `${analyticsPrefix}_interop_hl7`,
      lazy: adminPage,
      permission: 'interop.hl7',
      featureFlag: 'interop',
    },
    {
      path: '/interop-dicom-admin',
      title: 'DICOM',
      breadcrumb: 'DICOM',
      analyticsName: `${analyticsPrefix}_interop_dicom_admin`,
      lazy: adminPage,
      permission: 'interop.dicom',
      featureFlag: 'interop',
    },
    {
      path: '/interop-cda',
      title: 'CDA Documents',
      breadcrumb: 'CDA',
      analyticsName: `${analyticsPrefix}_interop_cda`,
      lazy: adminPage,
      permission: 'interop.read',
      featureFlag: 'interop',
    },
    {
      path: '/smart-apps',
      title: 'SMART Apps',
      breadcrumb: 'SMART Apps',
      analyticsName: `${analyticsPrefix}_smart_apps`,
      lazy: adminPage,
      permission: 'interop.api',
      featureFlag: 'interop',
    },
    {
      path: '/api-gateway',
      title: 'API Gateway',
      breadcrumb: 'API Gateway',
      analyticsName: `${analyticsPrefix}_api_gateway`,
      lazy: adminPage,
      permission: 'interop.api',
      featureFlag: 'interop',
    },
    {
      path: '/terminology',
      title: 'Terminology',
      breadcrumb: 'Terminology',
      analyticsName: `${analyticsPrefix}_terminology`,
      lazy: adminPage,
      permission: 'interop.admin',
      featureFlag: 'interop',
    },
    {
      path: '/integration-audit',
      title: 'Audit Logs',
      breadcrumb: 'Audit',
      analyticsName: `${analyticsPrefix}_integration_audit`,
      lazy: adminPage,
      permission: 'interop.audit',
      featureFlag: 'interop',
    },
    {
      path: '/interoperability-analytics',
      title: 'Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_interop_analytics`,
      lazy: adminPage,
      permission: 'interop.analytics',
      featureFlag: 'interop',
    },
  ];
}
