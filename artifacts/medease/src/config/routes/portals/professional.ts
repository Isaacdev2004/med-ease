import {
  Activity,
  Bell,
  ClipboardList,
  Clock,
  FlaskConical,
  MessageSquare,
  Pill,
  Route,
  Scan,
  Settings,
  ShoppingCart,
  Stethoscope,
  User,
  Users,
  UserCog,
  Video,
  Building,
  CreditCard,
  Landmark,
  Shield,
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
  Code2,
  FileBarChart,
} from 'lucide-react';

import { createProfessionalAppointmentsRoutes } from '@/features/appointments/routes';
import { createProfessionalRadiologyRoutes } from '@/features/radiology/routes';
import { createProfessionalMonitoringRoutes } from '@/features/patient-monitoring/routes';
import { createProfessionalTelemedicineRoutes } from '@/features/telemedicine/routes';
import { createProfessionalBillingRoutes } from '@/features/billing/routes';
import { createProfessionalProcurementRoutes } from '@/features/procurement/routes';
import { createProfessionalWorkforceRoutes } from '@/features/workforce/routes';
import { createProfessionalFacilitiesRoutes } from '@/features/facilities/routes';
import { createProfessionalFinanceRoutes } from '@/features/finance/routes';
import { createProfessionalQualityRoutes } from '@/features/quality/routes';
import { createProfessionalPhmRoutes } from '@/features/population-health/routes';
import { createProfessionalCdssRoutes } from '@/features/cdss/routes';
import { createProfessionalInteropRoutes } from '@/features/interoperability/routes';
import { createProfessionalResearchRoutes } from '@/features/research/routes';
import { createProfessionalPublicHealthRoutes } from '@/features/public-health/routes';
import { createProfessionalAiRoutes } from '@/features/ai-intelligence/routes';
import { createProfessionalExecutiveRoutes } from '@/features/executive/routes';
import { createProfessionalIamRoutes } from '@/features/iam/routes';
import { createProfessionalDocumentRoutes } from '@/features/documents/routes';
import { createProfessionalWorkflowRoutes } from '@/features/workflows/routes';
import { createProfessionalMessagingRoutes } from '@/features/messaging/routes';
import { createProfessionalApiPlatformRoutes } from '@/features/api-platform/routes';
import { createProfessionalReportingRoutes } from '@/features/reporting/routes';
import { createPlatformSettingsRoutes } from '@/features/platform-admin/routes';
import { createProfessionalLaboratoryRoutes } from '@/features/laboratory/routes';
import { createProfessionalCarePlanRoutes } from '@/features/care-plans/routes';
import { createProfessionalMedicationRoutes } from '@/features/medications/routes';
import { createClinicianPatientRecordRoutes } from '@/features/patient-records/routes';
import { createMedicalLibraryRoutes } from '@/features/medical-library/routes';
import { createDirectoryRoutes } from '@/features/directory/routes';
import { createLaboratoryInventoryRoutes, createRadiologyInventoryRoutes } from '@/features/inventory/routes';
import {
  createConsultationsRoute,
  createMedicalRecordsRoute,
  createTransfersRoute,
  createAdmissionsRoute,
  createClinicalTasksRoute,
  createProfileRoute,
  createSettingsRoute,
} from '@/features/portal-pages/routes';
import { ROUTES } from '@/config/routes';
import { registerPortalRoutes } from '@/config/routes/metadata';
import type { PortalRouteGroup } from '@/config/routes/types';

export const professionalRouteGroup: PortalRouteGroup = {
  id: 'professional',
  portalTitle: 'Healthcare Professional Portal',
  roleName: 'Healthcare Professional',
  userName: 'Dr. Emily Chen',
  basePath: ROUTES.professional.root,
  routes: [
    {
      path: '/',
      title: 'Dashboard',
      breadcrumb: 'Schedule',
      lazy: () => import('@/features/professional/pages/Dashboard'),
      nav: { icon: Clock, label: 'Schedule', order: 0 },
    },
    {
      path: '/patients',
      title: 'Patients',
      breadcrumb: 'Patients',
      analyticsName: 'professional_patients',
      lazy: () => import('@/features/professional/pages/Patients'),
      nav: { icon: Users, order: 1 },
    },
    ...createProfessionalMedicationRoutes('professional'),
    ...createProfessionalCarePlanRoutes('professional', {
      icon: Activity,
      label: 'Care Plans',
      order: 2,
    }),
    ...createProfessionalLaboratoryRoutes('professional', {
      icon: FlaskConical,
      label: 'Laboratory',
      order: 3,
    }),
    ...createLaboratoryInventoryRoutes('professional'),
    ...createProfessionalRadiologyRoutes('professional', {
      icon: Scan,
      label: 'Radiology',
      order: 4,
    }),
    ...createRadiologyInventoryRoutes('professional'),
    ...createProfessionalMonitoringRoutes('professional'),
    ...createProfessionalTelemedicineRoutes('professional', {
      icon: Video,
      label: 'Telemedicine',
      order: 5,
    }),
    ...createProfessionalBillingRoutes('professional', {
      icon: CreditCard,
      label: 'Billing',
      order: 6,
    }),
    ...createProfessionalProcurementRoutes('professional', {
      icon: ShoppingCart,
      label: 'Procurement',
      order: 7,
    }),
    ...createProfessionalWorkforceRoutes('professional', {
      icon: UserCog,
      label: 'Workforce',
      order: 8,
    }),
    ...createProfessionalFacilitiesRoutes('professional', {
      icon: Building,
      label: 'Facilities',
      order: 9,
    }),
    ...createProfessionalFinanceRoutes('professional', {
      icon: Landmark,
      label: 'Finance',
      order: 10,
    }),
    ...createProfessionalQualityRoutes('professional', {
      icon: Shield,
      label: 'Quality',
      order: 11,
    }),
    ...createProfessionalPhmRoutes('professional', {
      icon: HeartPulse,
      label: 'Population Health',
      order: 12,
    }),
    ...createProfessionalCdssRoutes('professional', {
      icon: Brain,
      label: 'Clinical Decision Support',
      order: 13,
    }),
    ...createProfessionalInteropRoutes('professional', {
      icon: Network,
      label: 'Interoperability',
      order: 14,
    }),
    ...createProfessionalResearchRoutes('professional', {
      icon: Microscope,
      label: 'Clinical Research',
      order: 15,
    }),
    ...createProfessionalPublicHealthRoutes('professional', {
      icon: HeartHandshake,
      label: 'Public Health',
      order: 16,
    }),
    ...createProfessionalAiRoutes('professional', {
      icon: Sparkles,
      label: 'AI Intelligence',
      order: 17,
    }),
    ...createProfessionalExecutiveRoutes('professional', {
      icon: LayoutDashboard,
      label: 'Executive',
      order: 18,
    }),
    ...createProfessionalIamRoutes('professional', {
      icon: Lock,
      label: 'Identity & Security',
      order: 19,
    }),
    ...createProfessionalDocumentRoutes('professional', {
      icon: FileText,
      label: 'Documents',
      order: 20,
    }),
    ...createProfessionalWorkflowRoutes('professional', {
      icon: GitBranch,
      label: 'Workflows',
      order: 21,
    }),
    ...createProfessionalMessagingRoutes('professional', {
      icon: MessageSquare,
      label: 'Messaging',
      order: 22,
    }),
    ...createProfessionalReportingRoutes('professional', {
      icon: FileBarChart,
      label: 'Reports',
      order: 23,
    }),
    ...createProfessionalApiPlatformRoutes('professional', {
      icon: Code2,
      label: 'Developer',
      order: 24,
    }),
    ...createPlatformSettingsRoutes('professional'),
    ...createClinicianPatientRecordRoutes('professional'),
    ...createProfessionalAppointmentsRoutes('professional'),
    createConsultationsRoute('professional', {
      nav: { icon: Stethoscope, order: 2 },
    }),
    createMedicalRecordsRoute('professional'),
    createTransfersRoute('professional', {
      nav: { icon: Route, order: 3 },
    }),
    createAdmissionsRoute('professional'),
    createClinicalTasksRoute('professional', {
      nav: { icon: ClipboardList, label: 'Clinical Tasks', order: 5 },
    }),
    {
      path: '/notifications',
      title: 'Notifications',
      breadcrumb: 'Notifications',
      analyticsName: 'professional_notifications',
      lazy: () => import('@/features/notifications/pages/NotificationsPage'),
      nav: { icon: Bell, order: 6 },
    },
    createProfileRoute('professional', { nav: { icon: User, order: 9 } }),
    createSettingsRoute('professional', {
      nav: { icon: Settings, order: 10 },
    }),
    ...createDirectoryRoutes({
      analyticsPrefix: 'professional',
      nav: { icon: Stethoscope, label: 'Directory', order: 11 },
    }),
    ...createMedicalLibraryRoutes({
      analyticsPrefix: 'professional',
      nav: { icon: Pill, label: 'Medical Library', order: 12 },
    }),
  ],
};

registerPortalRoutes(
  professionalRouteGroup.basePath,
  professionalRouteGroup.routes,
);
