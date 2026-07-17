import {
  Activity,
  BarChart3,
  BedDouble,
  Bell,
  Building2,
  FileText,
  FlaskConical,
  Home,
  Landmark,
  Network,
  Package,
  Pill,
  Scan,
  Settings,
  Shield,
  ShoppingCart,
  Stethoscope,
  Users,
  HeartPulse,
  Brain,
  Microscope,
  HeartHandshake,
  Sparkles,
  LayoutDashboard,
  Lock,
  GitBranch,
  MessageSquare,
  Code2,
  FileBarChart,
} from 'lucide-react';

import { createFacilityScheduleRoutes } from '@/features/appointments/routes';
import { createFacilityRadiologyRoutes } from '@/features/radiology/routes';
import { createFacilityMonitoringRoutes } from '@/features/patient-monitoring/routes';
import { createFacilityTelemedicineRoutes } from '@/features/telemedicine/routes';
import { createFacilityBillingRoutes } from '@/features/billing/routes';
import { createFacilityInventoryRoutes } from '@/features/inventory/routes';
import { createFacilityProcurementRoutes } from '@/features/procurement/routes';
import { createFacilityWorkforceRoutes } from '@/features/workforce/routes';
import { createFacilityFacilitiesRoutes } from '@/features/facilities/routes';
import { createFacilityFinanceRoutes } from '@/features/finance/routes';
import { createFacilityQualityRoutes } from '@/features/quality/routes';
import { createFacilityPhmRoutes } from '@/features/population-health/routes';
import { createFacilityCdssRoutes } from '@/features/cdss/routes';
import { createFacilityInteropRoutes } from '@/features/interoperability/routes';
import { createFacilityResearchRoutes } from '@/features/research/routes';
import { createFacilityPublicHealthRoutes } from '@/features/public-health/routes';
import { createFacilityAiRoutes } from '@/features/ai-intelligence/routes';
import { createFacilityExecutiveRoutes } from '@/features/executive/routes';
import { createFacilityIamRoutes } from '@/features/iam/routes';
import { createFacilityDocumentRoutes } from '@/features/documents/routes';
import { createFacilityWorkflowRoutes } from '@/features/workflows/routes';
import { createFacilityMessagingRoutes } from '@/features/messaging/routes';
import { createFacilityApiPlatformRoutes } from '@/features/api-platform/routes';
import { createFacilityReportingRoutes } from '@/features/reporting/routes';
import { createPlatformSettingsRoutes } from '@/features/platform-admin/routes';
import { createFacilityLaboratoryRoutes } from '@/features/laboratory/routes';
import { createFacilityCarePlanRoutes } from '@/features/care-plans/routes';
import { createFacilityMedicationRoutes } from '@/features/medications/routes';
import { createClinicianPatientRecordRoutes } from '@/features/patient-records/routes';
import { createMedicalLibraryRoutes } from '@/features/medical-library/routes';
import { createDirectoryRoutes } from '@/features/directory/routes';
import {
  createBedManagementRoute,
  createAdmissionsRoute,
  createTransfersRoute,
  createCapacityRoute,
  createResourcesRoute,
  createPatientsListRoute,
  createAnalyticsRoute,
  createSettingsRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const facilityRouteGroup: PortalRouteGroup = {
  id: 'facility',
  portalTitle: 'Facility Portal',
  roleName: 'Facility Admin',
  userName: 'Robert Vance',
  basePath: ROUTES.facility.root,
  routes: [
    {
      path: '/',
      title: 'Dashboard',
      breadcrumb: 'Overview',
      lazy: () => import('@/features/facility/pages/Dashboard'),
      nav: { icon: Home, label: 'Overview', order: 0 },
    },
    createBedManagementRoute('facility', {
      nav: { icon: BedDouble, order: 1 },
      permission: 'beds.manage',
    }),
    createAdmissionsRoute('facility', { nav: { icon: Building2, order: 2 } }),
    createTransfersRoute('facility', { nav: { icon: Network, order: 3 } }),
    ...createFacilityWorkforceRoutes('facility', {
      icon: Users,
      label: 'Workforce',
      order: 4,
    }),
    ...createFacilityFacilitiesRoutes('facility', {
      icon: Building2,
      label: 'Facilities',
      order: 5,
    }),
    createCapacityRoute('facility'),
    createResourcesRoute('facility', {
      nav: { icon: Network, label: 'Resource & Beds', order: 5 },
    }),
    createPatientsListRoute('facility'),
    createAnalyticsRoute('facility', {
      nav: { icon: BarChart3, order: 6 },
    }),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'facility_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, order: 7 },
    },
    ...createDirectoryRoutes({
      analyticsPrefix: 'facility',
      nav: { icon: Stethoscope, label: 'Directory', order: 10 },
    }),
    ...createClinicianPatientRecordRoutes('facility'),
    ...createFacilityScheduleRoutes('facility'),
    ...createFacilityMedicationRoutes('facility'),
    ...createFacilityCarePlanRoutes('facility', {
      icon: Activity,
      label: 'Care Plans',
      order: 6,
    }),
    ...createFacilityLaboratoryRoutes('facility', {
      icon: FlaskConical,
      label: 'Laboratory',
      order: 7,
    }),
    ...createFacilityRadiologyRoutes('facility', {
      icon: Scan,
      label: 'Radiology',
      order: 8,
    }),
    ...createFacilityMonitoringRoutes('facility'),
    ...createFacilityTelemedicineRoutes('facility'),
    ...createFacilityBillingRoutes('facility'),
    ...createFacilityInventoryRoutes('facility', {
      icon: Package,
      label: 'Inventory',
      order: 9,
    }),
    ...createFacilityProcurementRoutes('facility', {
      icon: ShoppingCart,
      label: 'Procurement',
      order: 10,
    }),
    ...createFacilityFinanceRoutes('facility', {
      icon: Landmark,
      label: 'Finance',
      order: 11,
    }),
    ...createFacilityQualityRoutes('facility', {
      icon: Shield,
      label: 'Quality',
      order: 12,
    }),
    ...createFacilityPhmRoutes('facility', {
      icon: HeartPulse,
      label: 'Population Health',
      order: 13,
    }),
    ...createFacilityCdssRoutes('facility', {
      icon: Brain,
      label: 'Clinical Decision Support',
      order: 14,
    }),
    ...createFacilityInteropRoutes('facility', {
      icon: Network,
      label: 'Interoperability',
      order: 15,
    }),
    ...createFacilityResearchRoutes('facility', {
      icon: Microscope,
      label: 'Clinical Research',
      order: 16,
    }),
    ...createFacilityPublicHealthRoutes('facility', {
      icon: HeartHandshake,
      label: 'Public Health',
      order: 17,
    }),
    ...createFacilityAiRoutes('facility', {
      icon: Sparkles,
      label: 'AI Intelligence',
      order: 18,
    }),
    ...createFacilityExecutiveRoutes('facility', {
      icon: LayoutDashboard,
      label: 'Executive',
      order: 19,
    }),
    ...createFacilityIamRoutes('facility', {
      icon: Lock,
      label: 'Identity & Security',
      order: 20,
    }),
    ...createFacilityDocumentRoutes('facility', {
      icon: FileText,
      label: 'Documents',
      order: 21,
    }),
    ...createFacilityWorkflowRoutes('facility', {
      icon: GitBranch,
      label: 'Workflows',
      order: 22,
    }),
    ...createFacilityMessagingRoutes('facility', {
      icon: MessageSquare,
      label: 'Messaging',
      order: 23,
    }),
    ...createFacilityReportingRoutes('facility', {
      icon: FileBarChart,
      label: 'Reports',
      order: 24,
    }),
    ...createFacilityApiPlatformRoutes('facility', {
      icon: Code2,
      label: 'Developer',
      order: 25,
    }),
    ...createPlatformSettingsRoutes('facility'),
    ...createMedicalLibraryRoutes({
      analyticsPrefix: 'facility',
      nav: { icon: Pill, label: 'Medical Library', order: 11 },
    }),
    createSettingsRoute('facility', {
      nav: { icon: Settings, order: 9 },
    }),
  ],
};

registerPortalRoutes(facilityRouteGroup.basePath, facilityRouteGroup.routes);
