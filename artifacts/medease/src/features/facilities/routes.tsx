import type { RouteDefinition } from '@/config/routes/types';

const professionalPage = () => import('@/features/facilities/pages/ProfessionalFacilitiesPage');
const facilityPage = () => import('@/features/facilities/pages/FacilityFacilitiesPage');
const adminPage = () => import('@/features/facilities/pages/AdminFacilitiesPage');

export function createProfessionalFacilitiesRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/facilities', title: 'Facilities', breadcrumb: 'Facilities', analyticsName: `${analyticsPrefix}_facilities`, lazy: professionalPage, nav, permission: 'facilities.read', featureFlag: 'facilities' },
    { path: '/equipment', title: 'Equipment', breadcrumb: 'Equipment', analyticsName: `${analyticsPrefix}_equipment`, lazy: professionalPage, permission: 'facilities.read', featureFlag: 'facilities' },
    { path: '/maintenance', title: 'Maintenance', breadcrumb: 'Maintenance', analyticsName: `${analyticsPrefix}_maintenance`, lazy: professionalPage, permission: 'facilities.maintenance', featureFlag: 'facilities' },
  ];
}

export function createFacilityFacilitiesRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/facilities', title: 'Facilities', breadcrumb: 'Facilities', analyticsName: `${analyticsPrefix}_facilities`, lazy: facilityPage, nav, permission: 'facilities.read', featureFlag: 'facilities' },
    { path: '/buildings', title: 'Buildings', breadcrumb: 'Buildings', analyticsName: `${analyticsPrefix}_buildings`, lazy: facilityPage, permission: 'facilities.read', featureFlag: 'facilities' },
    { path: '/facility-assets', title: 'Assets', breadcrumb: 'Assets', analyticsName: `${analyticsPrefix}_facility_assets`, lazy: facilityPage, permission: 'facilities.assets', featureFlag: 'facilities' },
    { path: '/maintenance', title: 'Maintenance', breadcrumb: 'Maintenance', analyticsName: `${analyticsPrefix}_maintenance`, lazy: facilityPage, permission: 'facilities.maintenance', featureFlag: 'facilities' },
    { path: '/utilities', title: 'Utilities', breadcrumb: 'Utilities', analyticsName: `${analyticsPrefix}_utilities`, lazy: facilityPage, permission: 'facilities.utilities', featureFlag: 'facilities' },
    { path: '/environment', title: 'Environment', breadcrumb: 'Environment', analyticsName: `${analyticsPrefix}_environment`, lazy: facilityPage, permission: 'facilities.utilities', featureFlag: 'facilities' },
    { path: '/housekeeping', title: 'Housekeeping', breadcrumb: 'Housekeeping', analyticsName: `${analyticsPrefix}_housekeeping`, lazy: facilityPage, permission: 'facilities.write', featureFlag: 'facilities' },
    { path: '/fleet', title: 'Fleet', breadcrumb: 'Fleet', analyticsName: `${analyticsPrefix}_fleet`, lazy: facilityPage, permission: 'facilities.read', featureFlag: 'facilities' },
  ];
}

export function createAdminFacilitiesRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/facilities', title: 'Facilities', breadcrumb: 'Facilities', analyticsName: `${analyticsPrefix}_facilities`, lazy: adminPage, nav, permission: 'facilities.read', featureFlag: 'facilities' },
    { path: '/buildings', title: 'Buildings', breadcrumb: 'Buildings', analyticsName: `${analyticsPrefix}_buildings`, lazy: adminPage, permission: 'facilities.admin', featureFlag: 'facilities' },
    { path: '/facilities-assets', title: 'Assets', breadcrumb: 'Assets', analyticsName: `${analyticsPrefix}_facilities_assets`, lazy: adminPage, permission: 'facilities.assets', featureFlag: 'facilities' },
    { path: '/work-orders', title: 'Work Orders', breadcrumb: 'Work Orders', analyticsName: `${analyticsPrefix}_work_orders`, lazy: adminPage, permission: 'facilities.maintenance', featureFlag: 'facilities' },
    { path: '/calibration', title: 'Calibration', breadcrumb: 'Calibration', analyticsName: `${analyticsPrefix}_calibration`, lazy: adminPage, permission: 'facilities.calibration', featureFlag: 'facilities' },
    { path: '/vendors', title: 'Vendors', breadcrumb: 'Vendors', analyticsName: `${analyticsPrefix}_vendors`, lazy: adminPage, permission: 'facilities.admin', featureFlag: 'facilities' },
    { path: '/contracts', title: 'Contracts', breadcrumb: 'Contracts', analyticsName: `${analyticsPrefix}_contracts`, lazy: adminPage, permission: 'facilities.admin', featureFlag: 'facilities' },
    { path: '/facilities-analytics', title: 'Facilities Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_facilities_analytics`, lazy: adminPage, permission: 'facilities.analytics', featureFlag: 'facilities' },
    { path: '/system-health', title: 'System Health', breadcrumb: 'System Health', analyticsName: `${analyticsPrefix}_system_health`, lazy: adminPage, permission: 'facilities.utilities', featureFlag: 'facilities' },
  ];
}
