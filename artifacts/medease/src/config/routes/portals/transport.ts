import {
  Activity,
  Ambulance,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  History,
  Settings,
  Users,
} from 'lucide-react';

import {
  createTransportVehiclesRoute,
  createTransportDriversRoute,
  createTransportSchedulesRoute,
  createPatientsListRoute,
  createTransportFacilitiesRoute,
  createTransportHistoryRoute,
  createReportsRoute,
  createSettingsRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const transportRouteGroup: PortalRouteGroup = {
  id: 'transport',
  portalTitle: 'Medical Transport Portal',
  roleName: 'Medical Transport',
  userName: 'Dispatch Unit A',
  basePath: ROUTES.transport.root,
  routes: [
    {
      path: '/',
      title: 'Dashboard',
      breadcrumb: 'Live Dispatch',
      lazy: () => import('@/features/transport/pages/Dashboard'),
      nav: { icon: Activity, label: 'Live Dispatch', order: 0 },
    },
    {
      path: '/transfer-requests',
      title: 'Transfer Requests',
      breadcrumb: 'Transfer Requests',
      analyticsName: 'transport_transfer_requests',
      lazy: () => import('@/features/transport/pages/TransferRequests'),
      nav: { icon: CalendarClock, order: 1 },
    },
    createTransportVehiclesRoute('transport', {
      nav: { icon: Ambulance, label: 'Fleet Status', order: 2 },
    }),
    createTransportDriversRoute('transport'),
    createTransportSchedulesRoute('transport', {
      nav: { icon: CalendarClock, label: 'Scheduled Transfers', order: 3 },
    }),
    createPatientsListRoute('transport', { nav: { icon: Users, order: 4 } }),
    createTransportFacilitiesRoute('transport', {
      nav: { icon: Building2, order: 5 },
    }),
    createTransportHistoryRoute('transport', { nav: { icon: History, order: 6 } }),
    createReportsRoute('transport', { nav: { icon: BarChart3, order: 7 } }),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'transport_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, order: 8 },
    },
    createSettingsRoute('transport', {
      nav: { icon: Settings, order: 9 },
    }),
  ],
};

registerPortalRoutes(transportRouteGroup.basePath, transportRouteGroup.routes);
