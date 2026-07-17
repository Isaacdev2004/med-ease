import type { RouteDefinition } from '@/config/routes/types';

const pharmacyPage = () =>
  import('@/features/procurement/pages/PharmacyProcurementPage');
const professionalPage = () =>
  import('@/features/procurement/pages/ProfessionalProcurementPage');
const facilityPage = () =>
  import('@/features/procurement/pages/FacilityProcurementPage');
const adminPage = () =>
  import('@/features/procurement/pages/AdminProcurementPage');

export function createPharmacyProcurementRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/procurement',
      title: 'Procurement',
      breadcrumb: 'Procurement',
      analyticsName: `${analyticsPrefix}_procurement`,
      lazy: pharmacyPage,
      nav,
      permission: 'procurement.read',
      featureFlag: 'procurement',
    },
    {
      path: '/purchase-orders',
      title: 'Purchase Orders',
      breadcrumb: 'POs',
      analyticsName: `${analyticsPrefix}_purchase_orders`,
      lazy: pharmacyPage,
      permission: 'procurement.purchaseOrders',
      featureFlag: 'procurement',
    },
    {
      path: '/suppliers',
      title: 'Suppliers',
      breadcrumb: 'Suppliers',
      analyticsName: `${analyticsPrefix}_suppliers`,
      lazy: pharmacyPage,
      permission: 'procurement.suppliers',
      featureFlag: 'procurement',
    },
  ];
}

export function createProfessionalProcurementRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/procurement',
      title: 'Procurement',
      breadcrumb: 'Procurement',
      analyticsName: `${analyticsPrefix}_procurement`,
      lazy: professionalPage,
      nav,
      permission: 'procurement.read',
      featureFlag: 'procurement',
    },
    {
      path: '/requests',
      title: 'Requests',
      breadcrumb: 'Requests',
      analyticsName: `${analyticsPrefix}_requests`,
      lazy: professionalPage,
      permission: 'procurement.write',
      featureFlag: 'procurement',
    },
  ];
}

export function createFacilityProcurementRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/procurement',
      title: 'Procurement',
      breadcrumb: 'Procurement',
      analyticsName: `${analyticsPrefix}_procurement`,
      lazy: facilityPage,
      nav,
      permission: 'procurement.read',
      featureFlag: 'procurement',
    },
    {
      path: '/receiving',
      title: 'Receiving',
      breadcrumb: 'Receiving',
      analyticsName: `${analyticsPrefix}_receiving`,
      lazy: facilityPage,
      permission: 'procurement.write',
      featureFlag: 'procurement',
    },
    {
      path: '/deliveries',
      title: 'Deliveries',
      breadcrumb: 'Deliveries',
      analyticsName: `${analyticsPrefix}_deliveries`,
      lazy: facilityPage,
      permission: 'procurement.read',
      featureFlag: 'procurement',
    },
  ];
}

export function createAdminProcurementRoutes(
  analyticsPrefix: string,
  nav?: RouteDefinition['nav'],
): RouteDefinition[] {
  return [
    {
      path: '/procurement',
      title: 'Procurement',
      breadcrumb: 'Procurement',
      analyticsName: `${analyticsPrefix}_procurement`,
      lazy: adminPage,
      nav,
      permission: 'procurement.read',
      featureFlag: 'procurement',
    },
    {
      path: '/purchase-orders',
      title: 'Purchase Orders',
      breadcrumb: 'POs',
      analyticsName: `${analyticsPrefix}_purchase_orders`,
      lazy: adminPage,
      permission: 'procurement.purchaseOrders',
      featureFlag: 'procurement',
    },
    {
      path: '/rfqs',
      title: 'RFQs',
      breadcrumb: 'RFQs',
      analyticsName: `${analyticsPrefix}_rfqs`,
      lazy: adminPage,
      permission: 'procurement.rfq',
      featureFlag: 'procurement',
    },
    {
      path: '/contracts',
      title: 'Contracts',
      breadcrumb: 'Contracts',
      analyticsName: `${analyticsPrefix}_contracts`,
      lazy: adminPage,
      permission: 'procurement.contracts',
      featureFlag: 'procurement',
    },
    {
      path: '/suppliers',
      title: 'Suppliers',
      breadcrumb: 'Suppliers',
      analyticsName: `${analyticsPrefix}_suppliers`,
      lazy: adminPage,
      permission: 'procurement.suppliers',
      featureFlag: 'procurement',
    },
    {
      path: '/budgets',
      title: 'Budgets',
      breadcrumb: 'Budgets',
      analyticsName: `${analyticsPrefix}_budgets`,
      lazy: adminPage,
      permission: 'procurement.analytics',
      featureFlag: 'procurement',
    },
    {
      path: '/approvals',
      title: 'Approvals',
      breadcrumb: 'Approvals',
      analyticsName: `${analyticsPrefix}_approvals`,
      lazy: adminPage,
      permission: 'procurement.approve',
      featureFlag: 'procurement',
    },
    {
      path: '/analytics',
      title: 'Procurement Analytics',
      breadcrumb: 'Analytics',
      analyticsName: `${analyticsPrefix}_procurement_analytics`,
      lazy: adminPage,
      permission: 'procurement.analytics',
      featureFlag: 'procurement',
    },
  ];
}
