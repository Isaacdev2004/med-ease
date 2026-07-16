import type { RouteDefinition } from '@/config/routes/types';

const pharmacyPage = () => import('@/features/inventory/pages/PharmacyInventoryPage');
const laboratoryPage = () => import('@/features/inventory/pages/LaboratoryInventoryPage');
const radiologyPage = () => import('@/features/inventory/pages/RadiologyInventoryPage');
const facilityPage = () => import('@/features/inventory/pages/FacilityInventoryPage');
const adminPage = () => import('@/features/inventory/pages/AdminInventoryPage');

export function createPharmacyInventoryRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/inventory', title: 'Inventory', breadcrumb: 'Inventory', analyticsName: `${analyticsPrefix}_inventory`, lazy: pharmacyPage, nav, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/stock', title: 'Stock', breadcrumb: 'Stock', analyticsName: `${analyticsPrefix}_stock`, lazy: pharmacyPage, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/expiry', title: 'Expiry', breadcrumb: 'Expiry', analyticsName: `${analyticsPrefix}_expiry`, lazy: pharmacyPage, permission: 'inventory.read', featureFlag: 'inventory' },
  ];
}

export function createLaboratoryInventoryRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    { path: '/laboratory/inventory', title: 'Lab Inventory', breadcrumb: 'Inventory', analyticsName: `${analyticsPrefix}_lab_inventory`, lazy: laboratoryPage, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/laboratory/reagents', title: 'Reagents', breadcrumb: 'Reagents', analyticsName: `${analyticsPrefix}_reagents`, lazy: laboratoryPage, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/laboratory/consumables', title: 'Consumables', breadcrumb: 'Consumables', analyticsName: `${analyticsPrefix}_consumables`, lazy: laboratoryPage, permission: 'inventory.read', featureFlag: 'inventory' },
  ];
}

export function createRadiologyInventoryRoutes(analyticsPrefix: string): RouteDefinition[] {
  return [
    { path: '/radiology/inventory', title: 'Imaging Inventory', breadcrumb: 'Inventory', analyticsName: `${analyticsPrefix}_rad_inventory`, lazy: radiologyPage, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/radiology/equipment', title: 'Equipment', breadcrumb: 'Equipment', analyticsName: `${analyticsPrefix}_rad_equipment`, lazy: radiologyPage, permission: 'inventory.read', featureFlag: 'inventory' },
  ];
}

export function createFacilityInventoryRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/inventory', title: 'Inventory', breadcrumb: 'Inventory', analyticsName: `${analyticsPrefix}_inventory`, lazy: facilityPage, nav, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/assets', title: 'Assets', breadcrumb: 'Assets', analyticsName: `${analyticsPrefix}_assets`, lazy: facilityPage, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/warehouse', title: 'Warehouse', breadcrumb: 'Warehouse', analyticsName: `${analyticsPrefix}_warehouse`, lazy: facilityPage, permission: 'inventory.transfer', featureFlag: 'inventory' },
  ];
}

export function createAdminInventoryRoutes(analyticsPrefix: string, nav?: RouteDefinition['nav']): RouteDefinition[] {
  return [
    { path: '/inventory', title: 'Inventory', breadcrumb: 'Inventory', analyticsName: `${analyticsPrefix}_inventory`, lazy: adminPage, nav, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/assets', title: 'Assets', breadcrumb: 'Assets', analyticsName: `${analyticsPrefix}_assets`, lazy: adminPage, permission: 'inventory.read', featureFlag: 'inventory' },
    { path: '/inventory-analytics', title: 'Inventory Analytics', breadcrumb: 'Analytics', analyticsName: `${analyticsPrefix}_inventory_analytics`, lazy: adminPage, permission: 'inventory.analytics', featureFlag: 'inventory' },
  ];
}
