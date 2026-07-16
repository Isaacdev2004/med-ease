import {
  ActivitySquare,
  Bell,
  Building2,
  Database,
  Flag,
  Home,
  Package,
  Pill,
  Landmark,
  Shield,
  Settings,
  ShoppingCart,
  Stethoscope,
  Building,
  UserCog,
  Users,
  HeartPulse,
  Brain,
  Network,
  Microscope,
  HeartHandshake,
  Sparkles,
  LayoutDashboard,
  Lock,
  FileText,
  GitBranch,
  MessageSquare,
  Code2,
  FileBarChart,
  Server,
} from 'lucide-react';

import { createAdminSchedulingRoutes } from '@/features/appointments/routes';
import { createAdminRadiologyRoutes } from '@/features/radiology/routes';
import { createAdminMonitoringRoutes } from '@/features/patient-monitoring/routes';
import { createAdminTelemedicineRoutes } from '@/features/telemedicine/routes';
import { createAdminBillingRoutes } from '@/features/billing/routes';
import { createAdminInventoryRoutes } from '@/features/inventory/routes';
import { createAdminProcurementRoutes } from '@/features/procurement/routes';
import { createAdminWorkforceRoutes } from '@/features/workforce/routes';
import { createAdminFacilitiesRoutes } from '@/features/facilities/routes';
import { createAdminFinanceRoutes } from '@/features/finance/routes';
import { createAdminQualityRoutes } from '@/features/quality/routes';
import { createAdminPhmRoutes } from '@/features/population-health/routes';
import { createAdminCdssRoutes } from '@/features/cdss/routes';
import { createAdminInteropRoutes } from '@/features/interoperability/routes';
import { createAdminResearchRoutes } from '@/features/research/routes';
import { createAdminPublicHealthRoutes } from '@/features/public-health/routes';
import { createAdminAiRoutes } from '@/features/ai-intelligence/routes';
import { createAdminExecutiveRoutes } from '@/features/executive/routes';
import { createAdminIamRoutes } from '@/features/iam/routes';
import { createAdminDocumentRoutes } from '@/features/documents/routes';
import { createAdminWorkflowRoutes } from '@/features/workflows/routes';
import { createAdminMessagingRoutes } from '@/features/messaging/routes';
import { createAdminApiPlatformRoutes } from '@/features/api-platform/routes';
import { createAdminReportingRoutes } from '@/features/reporting/routes';
import { createAdminPlatformRoutes } from '@/features/platform-admin/routes';
import { createAdminLaboratoryRoutes } from '@/features/laboratory/routes';
import { createAdminCarePlanRoutes } from '@/features/care-plans/routes';
import { createAdminMedicationRoutes } from '@/features/medications/routes';
import { createClinicianPatientRecordRoutes } from '@/features/patient-records/routes';
import { createMedicalLibraryRoutes } from '@/features/medical-library/routes';
import { createDirectoryRoutes } from '@/features/directory/routes';
import {
  createAdminPlatformAliasRoutes,
  createAdminSecurityAliasRoutes,
  createHealthcareProfessionalsRoute,
  createPatientsListRoute,
  createSettingsRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const adminRouteGroup: PortalRouteGroup = {
  id: 'admin',
  portalTitle: 'Administrator Portal',
  roleName: 'Platform Admin',
  userName: 'System Administrator',
  basePath: ROUTES.admin.root,
  routes: [
    {
      path: '/',
      title: 'Dashboard',
      breadcrumb: 'System Health',
      lazy: () => import('@/features/admin/pages/Dashboard'),
      nav: { icon: ActivitySquare, label: 'System Health', order: 0 },
    },
    ...createAdminSecurityAliasRoutes('admin').map((route) =>
      route.path === '/users'
        ? { ...route, nav: { icon: Users, label: 'User Management', order: 1 } }
        : route.path === '/audit-logs'
          ? { ...route, nav: { icon: Database, label: 'Audit Logs', order: 5 } }
          : route,
    ),
    ...createAdminFacilitiesRoutes('admin', { icon: Building, label: 'Facilities', order: 3 }),
    createHealthcareProfessionalsRoute('admin', {
      nav: { icon: Stethoscope, order: 4 },
    }),
    createPatientsListRoute('admin'),
    ...createAdminPlatformAliasRoutes('admin').map((route, i) => ({
      ...route,
      nav: i === 0 ? { icon: Flag, order: 6 } : { icon: Home, order: 7 },
    })),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'admin_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, order: 9 },
    },
    ...createDirectoryRoutes({
      analyticsPrefix: 'admin',
      nav: { icon: Stethoscope, label: 'Directory', order: 11 },
    }),
    ...createClinicianPatientRecordRoutes('admin'),
    ...createAdminSchedulingRoutes('admin'),
    ...createAdminMedicationRoutes('admin'),
    ...createAdminCarePlanRoutes('admin', {
      icon: ActivitySquare,
      label: 'Care Plans',
      order: 8,
    }),
    ...createAdminLaboratoryRoutes('admin', {
      icon: ActivitySquare,
      label: 'Laboratory',
      order: 9,
    }),
    ...createAdminRadiologyRoutes('admin', {
      icon: ActivitySquare,
      label: 'Radiology',
      order: 10,
    }),
    ...createAdminMonitoringRoutes('admin'),
    ...createAdminTelemedicineRoutes('admin'),
    ...createAdminBillingRoutes('admin'),
    ...createAdminInventoryRoutes('admin', { icon: Package, label: 'Inventory', order: 8 }),
    ...createAdminProcurementRoutes('admin', { icon: ShoppingCart, label: 'Procurement', order: 9 }),
    ...createAdminWorkforceRoutes('admin', { icon: UserCog, label: 'Workforce', order: 10 }),
    ...createAdminFinanceRoutes('admin', { icon: Landmark, label: 'Finance', order: 11 }),
    ...createAdminQualityRoutes('admin', { icon: Shield, label: 'Quality', order: 12 }),
    ...createAdminPhmRoutes('admin', { icon: HeartPulse, label: 'Population Health', order: 13 }),
    ...createAdminCdssRoutes('admin', { icon: Brain, label: 'Clinical Decision Support', order: 14 }),
    ...createAdminInteropRoutes('admin', { icon: Network, label: 'Interoperability', order: 15 }),
    ...createAdminResearchRoutes('admin', { icon: Microscope, label: 'Clinical Research', order: 16 }),
    ...createAdminPublicHealthRoutes('admin', { icon: HeartHandshake, label: 'Public Health', order: 17 }),
    ...createAdminAiRoutes('admin', { icon: Sparkles, label: 'AI Intelligence', order: 18 }),
    ...createAdminExecutiveRoutes('admin', { icon: LayoutDashboard, label: 'Executive', order: 19 }),
    ...createAdminIamRoutes('admin', { icon: Lock, label: 'Identity & Security', order: 20 }),
    ...createAdminDocumentRoutes('admin', { icon: FileText, label: 'Documents', order: 21 }),
    ...createAdminWorkflowRoutes('admin', { icon: GitBranch, label: 'Workflows', order: 22 }),
    ...createAdminMessagingRoutes('admin', { icon: MessageSquare, label: 'Messaging', order: 23 }),
    ...createAdminApiPlatformRoutes('admin', { icon: Code2, label: 'API Platform', order: 24 }),
    ...createAdminReportingRoutes('admin', { icon: FileBarChart, label: 'Reporting', order: 25 }),
    ...createAdminPlatformRoutes('admin', { icon: Server, label: 'Platform Admin', order: 26 }),
    ...createMedicalLibraryRoutes({
      analyticsPrefix: 'admin',
      nav: { icon: Pill, label: 'Medical Library', order: 12 },
    }),
    createSettingsRoute('admin', {
      nav: { icon: Settings, label: 'Platform Settings', order: 10 },
    }),
  ],
};

registerPortalRoutes(adminRouteGroup.basePath, adminRouteGroup.routes);
