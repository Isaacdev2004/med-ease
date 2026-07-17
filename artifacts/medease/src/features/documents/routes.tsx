import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () =>
  import('@/features/documents/pages/ProfessionalDocumentsPage');
const facilityPage = () =>
  import('@/features/documents/pages/FacilityDocumentsPage');
const adminPage = () => import('@/features/documents/pages/AdminDocumentsPage');

export function createProfessionalDocumentRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/documents',
      title: 'Documents',
      breadcrumb: 'Documents',
      analyticsName: `${analyticsPrefix}_documents`,
      lazy: professionalPage,
      nav,
      permission: 'documents.read',
      featureFlag: 'documents',
    },
    {
      path: '/my-documents',
      title: 'My Documents',
      breadcrumb: 'My Documents',
      analyticsName: `${analyticsPrefix}_my_documents`,
      lazy: professionalPage,
      permission: 'documents.read',
      featureFlag: 'documents',
    },
    {
      path: '/templates',
      title: 'Templates',
      breadcrumb: 'Templates',
      analyticsName: `${analyticsPrefix}_document_templates`,
      lazy: professionalPage,
      permission: 'documents.read',
      featureFlag: 'documents',
    },
    {
      path: '/signatures',
      title: 'Signatures',
      breadcrumb: 'Signatures',
      analyticsName: `${analyticsPrefix}_signatures`,
      lazy: professionalPage,
      permission: 'documents.signatures',
      featureFlag: 'documents',
    },
  ];
}

export function createFacilityDocumentRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/documents',
      title: 'Documents',
      breadcrumb: 'Documents',
      analyticsName: `${analyticsPrefix}_documents`,
      lazy: facilityPage,
      nav,
      permission: 'documents.read',
      featureFlag: 'documents',
    },
    {
      path: '/shared-documents',
      title: 'Shared Documents',
      breadcrumb: 'Shared',
      analyticsName: `${analyticsPrefix}_shared_documents`,
      lazy: facilityPage,
      permission: 'documents.share',
      featureFlag: 'documents',
    },
    {
      path: '/scanning',
      title: 'Scanning & OCR',
      breadcrumb: 'Scanning',
      analyticsName: `${analyticsPrefix}_scanning`,
      lazy: facilityPage,
      permission: 'documents.upload',
      featureFlag: 'documents',
    },
    {
      path: '/archive',
      title: 'Archive',
      breadcrumb: 'Archive',
      analyticsName: `${analyticsPrefix}_archive`,
      lazy: facilityPage,
      permission: 'documents.archive',
      featureFlag: 'documents',
    },
  ];
}

export function createAdminDocumentRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  const page = adminPage;
  const flag = 'documents' as const;
  return [
    {
      path: '/documents',
      title: 'Document Hub',
      breadcrumb: 'Documents',
      analyticsName: `${analyticsPrefix}_documents`,
      lazy: page,
      nav,
      permission: 'documents.read',
      featureFlag: flag,
    },
    {
      path: '/document-library',
      title: 'Document Library',
      breadcrumb: 'Library',
      analyticsName: `${analyticsPrefix}_document_library`,
      lazy: page,
      permission: 'documents.read',
      featureFlag: flag,
    },
    {
      path: '/document-templates',
      title: 'Document Templates',
      breadcrumb: 'Templates',
      analyticsName: `${analyticsPrefix}_document_templates`,
      lazy: page,
      permission: 'documents.write',
      featureFlag: flag,
    },
    {
      path: '/document-categories',
      title: 'Document Categories',
      breadcrumb: 'Categories',
      analyticsName: `${analyticsPrefix}_document_categories`,
      lazy: page,
      permission: 'documents.admin',
      featureFlag: flag,
    },
    {
      path: '/records-management',
      title: 'Records Management',
      breadcrumb: 'Records',
      analyticsName: `${analyticsPrefix}_records_management`,
      lazy: page,
      permission: 'documents.records',
      featureFlag: flag,
    },
    {
      path: '/retention-policies',
      title: 'Retention Policies',
      breadcrumb: 'Retention',
      analyticsName: `${analyticsPrefix}_retention_policies`,
      lazy: page,
      permission: 'documents.retention',
      featureFlag: flag,
    },
    {
      path: '/legal-holds',
      title: 'Legal Holds',
      breadcrumb: 'Legal Holds',
      analyticsName: `${analyticsPrefix}_legal_holds`,
      lazy: page,
      permission: 'documents.admin',
      featureFlag: flag,
    },
    {
      path: '/document-search',
      title: 'Document Search',
      breadcrumb: 'Search',
      analyticsName: `${analyticsPrefix}_document_search`,
      lazy: page,
      permission: 'documents.read',
      featureFlag: flag,
    },
    {
      path: '/document-analytics',
      title: 'Document Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_document_analytics`,
      lazy: page,
      permission: 'documents.analytics',
      featureFlag: flag,
    },
    {
      path: '/signature-center',
      title: 'Signature Center',
      breadcrumb: 'Signatures',
      analyticsName: `${analyticsPrefix}_signature_center`,
      lazy: page,
      permission: 'documents.signatures',
      featureFlag: flag,
    },
  ];
}
