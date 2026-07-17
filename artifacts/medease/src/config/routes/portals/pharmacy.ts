import {
  BarChart3,
  Bell,
  ClipboardList,
  FileText,
  Package,
  Pill,
  Settings,
  ShoppingCart,
  Users,
} from 'lucide-react';

import { createMedicalLibraryRoutes } from '@/features/medical-library/routes';
import { createPharmacyMedicationRoutes } from '@/features/medications/routes';
import { createPharmacyBillingRoutes } from '@/features/billing/routes';
import { createPharmacyInventoryRoutes } from '@/features/inventory/routes';
import { createPharmacyProcurementRoutes } from '@/features/procurement/routes';
import {
  createMedicationRequestsRoute,
  createPatientsListRoute,
  createReportsRoute,
  createProfileRoute,
  createSettingsRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const pharmacyRouteGroup: PortalRouteGroup = {
  id: 'pharmacy',
  portalTitle: 'Pharmacy Portal',
  roleName: 'Pharmacy Dispensing',
  userName: 'David Chen, PharmD',
  basePath: ROUTES.pharmacy.root,
  routes: [
    {
      path: '/',
      title: 'Dashboard',
      breadcrumb: 'Queue',
      lazy: () => import('@/features/pharmacy/pages/Dashboard'),
      nav: { icon: FileText, label: 'Queue', order: 0 },
    },
    ...createPharmacyMedicationRoutes('pharmacy', {
      icon: ClipboardList,
      order: 2,
    }),
    ...createPharmacyBillingRoutes('pharmacy'),
    ...createPharmacyInventoryRoutes('pharmacy', {
      icon: Package,
      label: 'Inventory',
      order: 3,
    }),
    ...createPharmacyProcurementRoutes('pharmacy', {
      icon: ShoppingCart,
      label: 'Procurement',
      order: 4,
    }),
    createMedicationRequestsRoute('pharmacy', {
      nav: { icon: Pill, order: 5 },
    }),
    createPatientsListRoute('pharmacy', { nav: { icon: Users, order: 6 } }),
    ...createMedicalLibraryRoutes({
      analyticsPrefix: 'pharmacy',
      nav: { icon: Pill, label: 'Medical Library', order: 5 },
    }),
    createReportsRoute('pharmacy', { nav: { icon: BarChart3, order: 6 } }),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'pharmacy_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, order: 6 },
    },
    createProfileRoute('pharmacy'),
    createSettingsRoute('pharmacy', {
      nav: { icon: Settings, order: 7 },
    }),
  ],
};

registerPortalRoutes(pharmacyRouteGroup.basePath, pharmacyRouteGroup.routes);
