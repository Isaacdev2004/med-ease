import type { RouteDefinition } from '@/config/routes/types';

const patientPage = () => import('@/features/billing/pages/PatientBillingPage');
const professionalPage = () => import('@/features/billing/pages/ProfessionalBillingPage');
const facilityPage = () => import('@/features/billing/pages/FacilityBillingPage');
const pharmacyPage = () => import('@/features/billing/pages/PharmacyBillingPage');
const adminPage = () => import('@/features/billing/pages/AdminBillingPage');

export function createPatientBillingRoutes(options: {
  analyticsPrefix: string;
  nav?: RouteDefinition['nav'];
}): RouteDefinition[] {
  const { analyticsPrefix, nav } = options;
  return [
    {
      path: '/invoices',
      title: 'Invoices',
      breadcrumb: 'Invoices',
      analyticsName: `${analyticsPrefix}_invoices`,
      lazy: patientPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/payments',
      title: 'Payments',
      breadcrumb: 'Payments',
      analyticsName: `${analyticsPrefix}_payments`,
      lazy: patientPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/insurance',
      title: 'Insurance',
      breadcrumb: 'Insurance',
      analyticsName: `${analyticsPrefix}_insurance`,
      lazy: patientPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/receipts',
      title: 'Receipts',
      breadcrumb: 'Receipts',
      analyticsName: `${analyticsPrefix}_receipts`,
      lazy: patientPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/billing',
      title: 'Billing',
      breadcrumb: 'Billing',
      analyticsName: `${analyticsPrefix}_billing`,
      lazy: patientPage,
      nav,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
  ];
}

export function createProfessionalBillingRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/billing',
      title: 'Billing',
      breadcrumb: 'Billing',
      analyticsName: `${analyticsPrefix}_billing`,
      lazy: professionalPage,
      nav,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/claims',
      title: 'Insurance Claims',
      breadcrumb: 'Claims',
      analyticsName: `${analyticsPrefix}_claims`,
      lazy: professionalPage,
      permission: 'billing.claims',
      featureFlag: 'billing',
    },
    {
      path: '/payments',
      title: 'Payments',
      breadcrumb: 'Payments',
      analyticsName: `${analyticsPrefix}_payments`,
      lazy: professionalPage,
      permission: 'billing.payments',
      featureFlag: 'billing',
    },
    {
      path: '/revenue',
      title: 'Revenue',
      breadcrumb: 'Revenue',
      analyticsName: `${analyticsPrefix}_revenue`,
      lazy: professionalPage,
      permission: 'billing.analytics',
      featureFlag: 'billing',
    },
  ];
}

export function createFacilityBillingRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/billing',
      title: 'Billing',
      breadcrumb: 'Billing',
      analyticsName: `${analyticsPrefix}_billing`,
      lazy: facilityPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/revenue',
      title: 'Revenue',
      breadcrumb: 'Revenue',
      analyticsName: `${analyticsPrefix}_revenue`,
      lazy: facilityPage,
      permission: 'billing.analytics',
      featureFlag: 'billing',
    },
    {
      path: '/claims',
      title: 'Claims',
      breadcrumb: 'Claims',
      analyticsName: `${analyticsPrefix}_claims`,
      lazy: facilityPage,
      permission: 'billing.claims',
      featureFlag: 'billing',
    },
    {
      path: '/payments',
      title: 'Payments',
      breadcrumb: 'Payments',
      analyticsName: `${analyticsPrefix}_payments`,
      lazy: facilityPage,
      permission: 'billing.payments',
      featureFlag: 'billing',
    },
  ];
}

export function createPharmacyBillingRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/billing',
      title: 'Billing',
      breadcrumb: 'Billing',
      analyticsName: `${analyticsPrefix}_billing`,
      lazy: pharmacyPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/payments',
      title: 'Payments',
      breadcrumb: 'Payments',
      analyticsName: `${analyticsPrefix}_payments`,
      lazy: pharmacyPage,
      permission: 'billing.payments',
      featureFlag: 'billing',
    },
    {
      path: '/claims',
      title: 'Claims',
      breadcrumb: 'Claims',
      analyticsName: `${analyticsPrefix}_claims`,
      lazy: pharmacyPage,
      permission: 'billing.claims',
      featureFlag: 'billing',
    },
  ];
}

export function createAdminBillingRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    {
      path: '/billing',
      title: 'Billing',
      breadcrumb: 'Billing',
      analyticsName: `${analyticsPrefix}_billing`,
      lazy: adminPage,
      permission: 'billing.read',
      featureFlag: 'billing',
    },
    {
      path: '/revenue',
      title: 'Revenue',
      breadcrumb: 'Revenue',
      analyticsName: `${analyticsPrefix}_revenue`,
      lazy: adminPage,
      permission: 'billing.analytics',
      featureFlag: 'billing',
    },
    {
      path: '/financial-reports',
      title: 'Financial Reports',
      breadcrumb: 'Reports',
      analyticsName: `${analyticsPrefix}_financial_reports`,
      lazy: adminPage,
      permission: 'billing.export',
      featureFlag: 'billing',
    },
    {
      path: '/claims',
      title: 'Claims',
      breadcrumb: 'Claims',
      analyticsName: `${analyticsPrefix}_claims`,
      lazy: adminPage,
      permission: 'billing.claims',
      featureFlag: 'billing',
    },
    {
      path: '/payments',
      title: 'Payments',
      breadcrumb: 'Payments',
      analyticsName: `${analyticsPrefix}_payments`,
      lazy: adminPage,
      permission: 'billing.payments',
      featureFlag: 'billing',
    },
  ];
}
