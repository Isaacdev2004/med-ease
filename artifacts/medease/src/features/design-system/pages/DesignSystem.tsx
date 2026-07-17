import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileQuestion,
  Info,
  Users,
} from 'lucide-react';

import { TransferRequestWizardDemo } from '@/features/design-system/components/TransferRequestWizardDemo';
import {
  DirectoryMapPlaceholder,
  ProviderBadges,
  ProviderCard,
} from '@/features/directory';
import {
  MedicationBadges,
  MedicationCard as LibraryMedicationCard,
  MedicationWarnings,
} from '@/features/medical-library';
import {
  AllergiesSection,
  CarePlansSection,
  DocumentsSection,
  EmergencySection,
  LaboratorySection,
  MedicationsSection,
  PatientBanner,
  HealthScoreWidget,
  SummarySection,
  TimelineSection,
} from '@/features/patient-records';
import {
  AppointmentMetrics,
  EnterpriseAppointmentCard,
  QueueCard,
  ReminderCard as AppointmentReminderCard,
  UpcomingAppointmentCard,
  WaitlistCard,
} from '@/features/appointments/components/AppointmentComponents';
import { TimeSlotPicker } from '@/features/appointments/components/BookingWizard';
import {
  CalendarLegend,
  MonthView,
} from '@/features/appointments/components/CalendarComponents';
import {
  ScheduleGrid,
  ProviderSchedule,
} from '@/features/appointments/components/ScheduleComponents';
import { createDemoNotification } from '@/services/notifications';
import { MOCK_DIRECTORY_PROVIDERS } from '@/services/directory';
import { MOCK_MEDICATIONS as LIBRARY_MOCK_MEDICATIONS } from '@/services/medical-library';
import { MOCK_PATIENT_RECORDS } from '@/services/patient-records';
import {
  buildQueueFromAppointments,
  getAllProviderAvailability,
  MOCK_APPOINTMENTS,
  MOCK_WAITLIST,
} from '@/services/appointments';
import {
  MOCK_MEDICATIONS as PATIENT_MOCK_MEDICATIONS,
  MOCK_PRESCRIPTIONS,
  MOCK_REFILL_REQUESTS,
  MOCK_INTERACTIONS,
  MOCK_SCHEDULE,
  MOCK_ADMINISTRATIONS,
  MOCK_DISPENSES,
  MOCK_REMINDERS,
  buildMedicationEducation,
} from '@/services/medications';
import { computeMedicationAnalytics } from '@/services/medications/analytics';
import {
  buildAnalytics,
  buildDashboard,
  buildProgress,
  MOCK_ACTIVITY,
  MOCK_CARE_PLANS,
  MOCK_GOALS,
  MOCK_PATHWAYS,
  MOCK_RISKS,
  MOCK_TASKS,
  MOCK_TEAM,
} from '@/services/care-plans';
import {
  buildAnalytics as buildLabAnalytics,
  buildDashboard as buildLabDashboard,
  buildQualityDashboard,
  buildTrends,
  MOCK_BLOOD_BANK,
  MOCK_INSTRUMENTS,
  MOCK_LAB_ALERTS,
  MOCK_LAB_ORDERS,
  MOCK_LAB_OBSERVATIONS,
  MOCK_LAB_REPORTS,
  MOCK_MICROBIOLOGY,
  MOCK_PATHOLOGY,
  MOCK_SPECIMENS,
  MOCK_TECHNOLOGISTS,
} from '@/services/laboratory';
import {
  BloodBankPanel,
  CriticalAlertCard,
  CriticalValueBanner,
  InstrumentCard,
  LabOrderCard,
  LabResultCard,
  LaboratoryAnalyticsPanel,
  LaboratoryKpiCards,
  MicrobiologyPanel,
  PathologyPanel,
  PreparationCard,
  QualityDashboardPanel,
  ReferenceRangePanel,
  ResultTable,
  ResultViewer,
  SpecimenCard,
  TechnologistCard,
  TrendChart,
} from '@/features/laboratory/components/LaboratoryComponents';
import {
  buildAnalytics as buildRadAnalytics,
  buildDashboard as buildRadDashboard,
  buildStudyTimeline,
  MOCK_DIAGNOSTIC_REPORTS,
  MOCK_IMAGING_DEVICES,
  MOCK_RADIOLOGISTS,
  MOCK_RADIOLOGY_STUDIES,
} from '@/services/radiology';
import {
  CriticalFindingBanner,
  DeviceCard,
  DiagnosticReportPanel,
  ImagingViewer,
  PACSStatusCard,
  RadiologistCard,
  RadiologyAnalyticsPanel,
  RadiologyMetrics,
  RadiologyStudyCard,
  StudyTimeline,
} from '@/features/radiology/components/RadiologyComponents';
import {
  ActivityFeed,
  CareAnalyticsPanel,
  CarePlanCard,
  CarePlanKpiCards,
  CareTeamCard,
  ClinicalPathwayCard,
  CompletionRing,
  GoalCard,
  ProgressChart,
  RiskIndicator,
  TaskCard,
} from '@/features/care-plans/components/CarePlanComponents';
import {
  AdherenceChart,
  AdherenceGauge,
  DispenseCard,
  DoseCard,
  EnterpriseMedicationCard,
  InteractionAlert,
  MedicationAdministrationCard,
  MedicationAnalyticsPanel,
  MedicationEducationPanel,
  MedicationInteractionBanner,
  MedicationKpiCards,
  MedicationReminderCard,
  MedicationStatusBadge,
  MedicationWarningBanner,
  PrescriptionCard,
  RefillCard,
} from '@/features/medications/components/MedicationComponents';
import {
  AlertBanner,
  AlertCard as MonitoringAlertCard,
  ClinicalTrendPanel,
  DeviceCard as MonitoringDeviceCard,
  MEWSCard,
  MonitoringAnalyticsPanel,
  MonitoringKpiCards,
  NEWSScoreCard,
  ObservationTimeline,
  RPMEnrollmentCard,
  VitalCard,
  VitalTrendChart,
} from '@/features/patient-monitoring/components/MonitoringComponents';
import {
  AnalyticsPanel as TelemedicineAnalyticsPanel,
  BandwidthIndicator,
  ChatPanel,
  ConsentCard,
  DeviceCheckCard,
  ParticipantGrid,
  RecordingPanel,
  ScreenSharePanel,
  SessionCard,
  SessionControls,
  SessionHeader,
  SessionTimeline,
  SOAPPanel,
  TelemedicineMetrics,
  VideoWindow,
  VirtualWaitingRoom,
  VisitSummaryCard,
  WhiteboardPanel,
} from '@/features/telemedicine/components/TelemedicineComponents';
import {
  buildDashboard as buildMonitoringDashboard,
  computeMonitoringAnalytics,
  MOCK_ALERTS,
  MOCK_DEVICES,
  MOCK_EARLY_WARNING,
  MOCK_RPM_PROGRAMS,
  MOCK_TRENDS,
  MOCK_VITALS,
  buildTimeline as buildMonitoringTimeline,
} from '@/services/patient-monitoring';
import {
  buildDashboard as buildTelemedicineDashboard,
  buildTimeline as buildTelemedicineTimeline,
  computeTelemedicineAnalytics,
  MOCK_CLINICAL_NOTES,
  MOCK_MESSAGES,
  MOCK_PARTICIPANTS,
  MOCK_RECORDINGS,
  MOCK_SESSIONS,
  MOCK_WAITING_ROOM,
  runDeviceCheck,
} from '@/services/telemedicine';
import {
  AnalyticsPanel as BillingAnalyticsPanel,
  ClaimCard,
  CollectionPanel,
  ExportToolbar,
  FinancialMetrics,
  InsuranceCard,
  InvoiceCard,
  InvoiceDetailPanel,
  OutstandingBalanceCard,
  PaymentCard,
  PaymentMethodCard,
  ReceiptCard,
  RefundCard,
  RevenueChart,
} from '@/features/billing/components/BillingComponents';
import {
  buildDashboard as buildBillingDashboard,
  computeRevenueAnalytics,
  MOCK_CLAIMS,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_POLICIES,
  MOCK_RECEIPTS,
  MOCK_REFUNDS,
  buildOutstandingBalances,
} from '@/services/billing';
import {
  AnalyticsPanel as InventoryAnalyticsPanel,
  AssetCard,
  BarcodeScanner,
  ExpiryBanner,
  ExportToolbar as InventoryExportToolbar,
  ForecastPanel,
  InventoryCard,
  InventoryMetrics,
  PurchaseOrderCard,
  SupplierCard,
  TransferCard as InventoryTransferCard,
  WarehouseCard,
} from '@/features/inventory/components/InventoryComponents';
import {
  buildDashboard as buildInventoryDashboard,
  computeInventoryAnalytics,
  forecastDemand,
  MOCK_ASSETS,
  MOCK_EXPIRY_ALERTS,
  MOCK_INVENTORY,
  MOCK_PURCHASE_ORDERS,
  MOCK_SUPPLIERS,
  MOCK_TRANSFERS,
  MOCK_WAREHOUSES,
} from '@/services/inventory';
import {
  AnalyticsPanel as ProcurementAnalyticsPanel,
  ApprovalCard,
  ApprovalTimeline,
  BudgetCard,
  ContractCard,
  DeliveryCard,
  ExportToolbar as ProcurementExportToolbar,
  ForecastChart,
  GoodsReceiptCard,
  InvoiceMatchingCard,
  ProcurementMetrics,
  PurchaseOrderCard as ProcPurchaseOrderCard,
  PurchaseRequestCard,
  RFQCard,
  RFQComparisonPanel,
  SpendDashboard,
  SupplierCard as ProcSupplierCard,
  SupplierPerformanceCard,
} from '@/features/procurement/components/ProcurementComponents';
import {
  buildProcurementDashboard,
  computeProcurementAnalytics,
  computeSpendAnalysis,
  forecastProcurementDemand,
  rankSuppliers,
  MOCK_APPROVALS,
  MOCK_BUDGETS,
  MOCK_CONTRACTS,
  MOCK_DELIVERIES,
  MOCK_GOODS_RECEIPTS,
  MOCK_INVOICES as MOCK_PROC_INVOICES,
  MOCK_PURCHASE_ORDERS as MOCK_PROC_ORDERS,
  MOCK_PURCHASE_REQUESTS,
  MOCK_RFQS,
  MOCK_SUPPLIERS as MOCK_PROC_SUPPLIERS,
} from '@/services/procurement';
import {
  AnalyticsPanel as WorkforceAnalyticsPanel,
  AttendanceCard,
  CertificationCard,
  ClockInPanel,
  CoverageDashboard,
  DepartmentCard,
  EmployeeCard,
  ExportToolbar as WorkforceExportToolbar,
  LeaveRequestCard,
  OrganizationChart,
  PayrollSummaryCard,
  PerformanceCard,
  RosterBoard,
  ScheduleGrid as WorkforceScheduleGrid,
  ShiftCard,
  StaffDirectory,
  TrainingCard,
  WorkforceMetrics,
} from '@/features/workforce/components/WorkforceComponents';
import {
  buildWorkforceDashboard,
  computeCoverage,
  computeWorkforceAnalytics,
  MOCK_ATTENDANCE,
  MOCK_DEPARTMENTS,
  MOCK_EMPLOYEES,
  MOCK_LEAVE_REQUESTS,
  MOCK_ORG_UNITS,
  MOCK_PAYROLL,
  MOCK_PERFORMANCE,
  MOCK_ROSTERS,
  MOCK_SHIFTS,
  MOCK_TRAINING,
} from '@/services/workforce';
import {
  AnalyticsPanel as FacilitiesAnalyticsPanel,
  AssetMap,
  BedCard,
  BiomedicalDeviceCard,
  CalibrationCard,
  ContractCard as FacContractCard,
  EnvironmentalCard,
  EquipmentCard,
  ExportToolbar as FacilitiesExportToolbar,
  FacilityCard,
  FleetCard,
  MaintenanceCalendar,
  MetricsDashboard as FacilitiesMetricsDashboard,
  PreventiveMaintenanceCard,
  RoomCard,
  UtilityCard,
  VendorCard,
  WorkOrderCard,
} from '@/features/facilities/components/FacilitiesComponents';
import {
  buildFacilitiesDashboard,
  computeFacilitiesAnalytics,
  MOCK_BEDS,
  MOCK_BIOMEDICAL_DEVICES,
  MOCK_BUILDINGS,
  MOCK_CALIBRATION,
  MOCK_CONTRACTS as MOCK_FAC_CONTRACTS,
  MOCK_ENVIRONMENTAL,
  MOCK_EQUIPMENT,
  MOCK_FACILITY_SITES,
  MOCK_PREVENTIVE,
  MOCK_ROOMS,
  MOCK_UTILITIES,
  MOCK_VENDORS,
  MOCK_VEHICLES,
  MOCK_WORK_ORDERS,
} from '@/services/facilities';
import {
  AccountCard,
  APInvoiceCard,
  ARInvoiceCard,
  AssetCard as FinanceAssetCard,
  BankAccountCard,
  BudgetCard as FinanceBudgetCard,
  BudgetVarianceChart,
  CashAccountCard,
  DepreciationSchedule,
  ExportToolbar as FinanceExportToolbar,
  FinanceAnalyticsPanel,
  FinancialDashboard,
  FinancialStatementViewer,
  JournalCard,
  KPICards,
  LedgerViewer,
  ReconciliationPanel,
  RevenueChart as FinanceRevenueChart,
  ExpenseChart as FinanceExpenseChart,
  TrialBalanceTable,
} from '@/features/finance/components/FinanceComponents';
import {
  buildFinanceDashboard,
  buildTrialBalance,
  computeFinanceAnalytics,
  MOCK_BANK_ACCOUNTS,
  MOCK_BUDGETS as MOCK_FIN_BUDGETS,
  MOCK_CASH_ACCOUNTS,
  MOCK_CHART_OF_ACCOUNTS,
  MOCK_DEPRECIATION,
  MOCK_FIXED_ASSETS,
  MOCK_JOURNALS,
  MOCK_RECEIVABLES,
  MOCK_VENDOR_BILLS,
} from '@/services/finance';
import {
  AccreditationCard,
  AnalyticsPanel as QualityAnalyticsPanel,
  AuditCard as QualityAuditCard,
  CAPACard,
  ComplianceScoreCard,
  ExecutiveDashboard as QualityExecutiveDashboard,
  ExportToolbar as QualityExportToolbar,
  FishbonePanel,
  FiveWhysPanel,
  HeatMap,
  IncidentCard,
  InfectionDashboard,
  PolicyCard as QualityPolicyCard,
  QualityMetrics,
  RiskCard,
} from '@/features/quality/components/QualityComponents';
import {
  buildQualityDashboard as buildEqmsDashboard,
  computeQualityAnalytics,
  MOCK_ACCREDITATION,
  MOCK_AUDITS as MOCK_EQMS_AUDITS,
  MOCK_CAPA,
  MOCK_COMPLIANCE as MOCK_EQMS_COMPLIANCE,
  MOCK_INCIDENTS,
  MOCK_INFECTIONS,
  MOCK_POLICIES as MOCK_EQMS_POLICIES,
  MOCK_QUALITY_INDICATORS,
  MOCK_RISKS as MOCK_EQMS_RISKS,
} from '@/services/quality';
import {
  CareGapCard,
  CohortBuilder,
  OutreachCampaignCard,
  PhmExportToolbar,
  PhmRiskCard,
  PopulationAnalyticsPanel,
  PopulationDashboard,
  RegistryCard,
  RiskDistributionPanel,
} from '@/features/population-health/components/PhmComponents';
import {
  buildPhmDashboard,
  computePopulationAnalytics,
  MOCK_CAMPAIGNS,
  MOCK_CARE_GAPS,
  MOCK_COHORTS,
  MOCK_REGISTRIES,
  MOCK_RISK_SCORES,
} from '@/services/population-health';
import {
  AllergyBanner,
  CDSDashboard,
  ClinicalAlertCard,
  ClinicalPathwayCard as CdssPathwayCard,
  ContraindicationBanner,
  DecisionTreeViewer,
  DrugInteractionBanner,
  GuidelineViewer,
  OrderSetCard,
  PreventiveReminderCard,
  RecommendationCard,
  RiskCalculatorCard,
  CdssAnalyticsPanel,
  CdssExportToolbar,
} from '@/features/cdss/components/CdssComponents';
import {
  buildCdssDashboard,
  computeCdssAnalytics,
  MOCK_ALERTS as MOCK_CDSS_ALERTS,
  MOCK_DECISION_TREES,
  MOCK_GUIDELINES as MOCK_CDSS_GUIDELINES,
  MOCK_ORDER_SETS,
  MOCK_PATHWAYS as MOCK_CDSS_PATHWAYS,
  MOCK_PREVENTIVE as MOCK_CDSS_PREVENTIVE,
  MOCK_RECOMMENDATIONS,
} from '@/services/cdss';
import {
  ApiClientCard,
  AuditCard as InteropAuditCard,
  DicomStudyCard,
  EndpointCard,
  FhirServerCard,
  HealthDashboard,
  Hl7MessageCard,
  InteropAnalyticsPanel,
  InteropExportToolbar,
  InteropQueueCard,
  MappingCard,
  SmartAppCard,
  WebhookCard,
} from '@/features/interoperability/components/InteropComponents';
import {
  buildInteropDashboard,
  computeInteropAnalytics,
  MOCK_DICOM_STUDIES,
  MOCK_ENDPOINTS,
  MOCK_FHIR_SERVERS,
  MOCK_HL7_MESSAGES,
  MOCK_MAPPINGS,
  MOCK_AUDIT as MOCK_INTEROP_AUDIT,
  MOCK_QUEUES,
  MOCK_SMART_APPS,
  MOCK_WEBHOOKS,
} from '@/services/interoperability';
import {
  AdverseEventCard,
  AnalyticsPanel as ResearchAnalyticsPanel,
  BiospecimenCard,
  ExportToolbar as ResearchExportToolbar,
  InnovationCard,
  PublicationCard,
  SafetyBoard,
  StudyDashboard,
  TrialCard,
  VisitTimeline,
  ParticipantCard as ResearchParticipantCard,
} from '@/features/research/components/ResearchComponents';
import {
  buildResearchDashboard,
  computeResearchAnalytics,
  MOCK_ADVERSE_EVENTS,
  MOCK_BIOSPECIMENS,
  MOCK_INNOVATION,
  MOCK_PARTICIPANTS as MOCK_RESEARCH_PARTICIPANTS,
  MOCK_PUBLICATIONS,
  MOCK_TRIALS,
  MOCK_VISITS,
} from '@/services/research';
import {
  AnalyticsPanel as PhAnalyticsPanel,
  CommunityProgramCard,
  ContactTracingBoard,
  DiseaseCaseCard,
  EpidemiologyDashboard,
  ExportToolbar as PhExportToolbar,
  ImmunizationCard,
  OutbreakCard,
  SDOHCard,
} from '@/features/public-health/components/PublicHealthComponents';
import {
  buildPublicHealthDashboard,
  computePublicHealthAnalytics,
  MOCK_COMMUNITY_PROGRAMS,
  MOCK_CONTACT_TRACING,
  MOCK_DISEASE_CASES,
  MOCK_IMMUNIZATIONS,
  MOCK_OUTBREAKS,
  MOCK_SDOH,
} from '@/services/public-health';
import {
  AIAnalyticsPanel as AiAnalyticsPanel,
  AiDashboardPanel,
  BiasDashboard,
  ClinicalSummaryCard,
  CopilotChatPanel,
  ExplainabilityPanel,
  ExportToolbar as AiExportToolbar,
  ModelPerformanceCard,
  OperationalForecastPanel,
  PredictionCard,
  RecommendationCard as AiRecommendationCard,
  RiskScoreCard,
} from '@/features/ai-intelligence/components/AiIntelligenceComponents';
import {
  buildAiDashboard,
  computeAiAnalytics,
  MOCK_CLINICAL_SUMMARIES,
  MOCK_COPILOT_SESSIONS,
  MOCK_EXPLAINABILITY,
  MOCK_FORECASTS,
  MOCK_MODEL_VERSIONS,
  MOCK_PREDICTIONS,
  MOCK_RECOMMENDATIONS as MOCK_AI_RECOMMENDATIONS,
  MOCK_RISK_ASSESSMENTS as MOCK_AI_RISK_ASSESSMENTS,
  MOCK_BIAS_METRICS,
} from '@/services/ai-intelligence';
import {
  BenchmarkPanel as ExBenchmarkPanel,
  ClinicalQualityDashboard as ExClinicalQualityDashboard,
  EnterpriseAlertCenter,
  ExecutiveAnalyticsPanel as ExExecutiveAnalyticsPanel,
  ExecutiveDashboard as ExExecutiveDashboard,
  ExecutiveKpiCard,
  ExportToolbar as ExExportToolbar,
  ForecastPanel as ExForecastPanel,
  HospitalOperationsBoard,
  PatientFlowPanel,
  PopulationHealthDashboard as ExPopulationHealthDashboard,
  RevenueDashboardPanel,
  ScorecardPanel,
  StrategicInitiativeCard,
  WorkforceDashboardPanel,
} from '@/features/executive/components/ExecutiveComponents';
import {
  buildExecutiveCommandCenter,
  computeExecutiveAnalytics,
  MOCK_BENCHMARK_REPORTS,
  MOCK_CAPACITY_SNAPSHOTS,
  MOCK_DEPARTMENT_SCORECARDS,
  MOCK_ENTERPRISE_ALERTS,
  MOCK_ENTERPRISE_KPIS,
  MOCK_EXECUTIVE_FORECASTS,
  MOCK_STRATEGIC_INITIATIVES,
} from '@/services/executive';
import {
  ApiKeyCard as IamApiKeyCard,
  AuditTimeline as IamAuditTimeline,
  BreakGlassPanel as IamBreakGlassPanel,
  ExportToolbar as IamExportToolbar,
  IamConsentCard,
  MFASetupCard as IamMfaSetupCard,
  OAuthClientCard as IamOAuthClientCard,
  PermissionMatrix as IamPermissionMatrix,
  RiskScoreCard as IamRiskScoreCard,
  RoleCard as IamRoleCard,
  SecurityAnalyticsPanel as IamSecurityAnalyticsPanel,
  SecurityDashboard as IamSecurityDashboard,
  SecurityIncidentCard as IamSecurityIncidentCard,
  SessionCard as IamSessionCard,
  UserCard as IamUserCard,
  ZeroTrustDashboard as IamZeroTrustDashboard,
} from '@/features/iam/components/SecurityComponents';
import {
  buildIamDashboard,
  computeIamAnalytics,
  MOCK_API_KEYS,
  MOCK_BREAK_GLASS,
  MOCK_CONSENTS,
  MOCK_IAM_AUDIT,
  MOCK_IAM_PERMISSIONS,
  MOCK_IAM_ROLES,
  MOCK_IAM_SESSIONS,
  MOCK_IAM_USERS,
  MOCK_MFA_DEVICES,
  MOCK_OAUTH_CLIENTS,
  MOCK_RISK_SCORES as MOCK_IAM_RISK_SCORES,
  MOCK_SECURITY_INCIDENTS,
} from '@/services/iam';
import {
  ActivityTimeline as DocActivityTimeline,
  ArchiveCard as DocArchiveCard,
  DocumentAnalyticsPanel as DocAnalyticsPanel,
  DocumentCard as DocDocumentCard,
  DocumentDashboardPanel as DocDashboardPanel,
  ExportToolbar as DocExportToolbar,
  LegalHoldCard as DocLegalHoldCard,
  OCRPanel as DocOcrPanel,
  SharedLinkCard as DocSharedLinkCard,
  SignatureCard as DocSignatureCard,
  SignatureRequestCard as DocSignatureRequestCard,
  TemplateCard as DocTemplateCard,
  VersionTimeline as DocVersionTimeline,
} from '@/features/documents/components/DocumentComponents';
import {
  buildDocumentDashboard,
  computeDocumentAnalytics,
  MOCK_ARCHIVE_JOBS,
  MOCK_DOCUMENTS,
  MOCK_LEGAL_HOLDS,
  MOCK_OCR_RESULTS,
  MOCK_RETENTION_POLICIES,
  MOCK_SHARED_LINKS,
  MOCK_SIGNATURE_REQUESTS,
  MOCK_SIGNATURES,
  MOCK_TEMPLATES,
  MOCK_VERSIONS,
} from '@/services/documents';
import {
  WorkflowDashboardPanel as WfDashboardPanel,
  WorkflowDesigner as WfDesigner,
  BPMNCanvas as WfBpmnCanvas,
  WorkflowCard as WfWorkflowCard,
  ProcessCard as WfProcessCard,
  TaskBoard as WfTaskBoard,
  ApprovalQueue as WfApprovalQueue,
  ApprovalCard as WfApprovalCard,
  RuleBuilder as WfRuleBuilder,
  EventTimeline as WfEventTimeline,
  SchedulerCard as WfSchedulerCard,
  JobQueue as WfJobQueue,
  SLAWidget as WfSlaWidget,
  EscalationPanel as WfEscalationPanel,
  AutomationCard as WfAutomationCard,
  WorkflowMonitor as WfMonitor,
  WorkflowAnalyticsPanel as WfAnalyticsPanel,
  ProcessHeatmap as WfProcessHeatmap,
  ProcessTemplateCard as WfProcessTemplateCard,
  ExportToolbar as WfExportToolbar,
} from '@/features/workflows/components/WorkflowComponents';
import {
  buildWorkflowDashboard,
  computeWorkflowAnalytics,
  MOCK_WORKFLOW_DEFINITIONS,
  MOCK_WORKFLOW_INSTANCES,
  MOCK_WORKFLOW_TASKS,
  MOCK_APPROVALS as MOCK_WF_APPROVALS,
  MOCK_BUSINESS_RULES,
  MOCK_BACKGROUND_JOBS,
  MOCK_WORKFLOW_EVENTS,
  MOCK_SCHEDULES,
  MOCK_SLAS,
  MOCK_ESCALATIONS,
  MOCK_PROCESS_TEMPLATES,
  MOCK_EVENT_QUEUES,
} from '@/services/workflows';
import {
  DashboardPanel as MsgDashboardPanel,
  InboxPanel as MsgInboxPanel,
  AnnouncementCard as MsgAnnouncementCard,
  ChatPanel as MsgChatPanel,
  SecureMessageCard as MsgSecureMessageCard,
  BroadcastPanel as MsgBroadcastPanel,
  ChannelCard as MsgChannelCard,
  TemplateCard as MsgTemplateCard,
  CampaignCard as MsgCampaignCard,
  DeliveryTimeline as MsgDeliveryTimeline,
  MessagingAnalyticsPanel as MsgAnalyticsPanel,
  IntegrationCard as MsgIntegrationCard,
  MessageCard as MsgMessageCard,
  ExportToolbar as MsgExportToolbar,
} from '@/features/messaging/components/MessagingComponents';
import {
  buildMessagingDashboard,
  computeMessagingAnalytics,
  MOCK_INBOX,
  MOCK_ANNOUNCEMENTS,
  MOCK_THREADS,
  MOCK_CHAT_MESSAGES,
  MOCK_SECURE_MESSAGES,
  MOCK_BROADCASTS,
  MOCK_TEMPLATES as MOCK_MSG_TEMPLATES,
  MOCK_CAMPAIGNS as MOCK_MSG_CAMPAIGNS,
  MOCK_DELIVERIES as MOCK_MSG_DELIVERIES,
  MOCK_CHANNELS,
  MOCK_INTEGRATIONS,
  MOCK_MESSAGES as MOCK_MSG_MESSAGES,
} from '@/services/messaging';
import {
  DeveloperPortal as ApiDeveloperPortal,
  ApiKeyCard as ApiKeyCard,
  OAuthAppCard as ApiOAuthAppCard,
  WebhookCard as ApiWebhookCard,
  SdkCard as ApiSdkCard,
  RateLimitPanel as ApiRateLimitPanel,
  ApiAnalyticsPanel as ApiAnalyticsPanel,
  MarketplaceCard as ApiMarketplaceCard,
  OpenApiViewer as ApiOpenApiViewer,
  SandboxCard as ApiSandboxCard,
  ExportToolbar as ApiExportToolbar,
} from '@/features/api-platform/components/ApiPlatformComponents';
import {
  buildApiDashboard,
  computeApiPlatformAnalytics,
  MOCK_API_KEYS as MOCK_API_PLATFORM_KEYS,
  MOCK_OAUTH_APPS,
  MOCK_WEBHOOKS as MOCK_API_PLATFORM_WEBHOOKS,
  MOCK_SDK_PACKAGES,
  MOCK_RATE_LIMIT_POLICIES,
  MOCK_API_PARTNERS,
  MOCK_SANDBOX_ENVIRONMENTS,
  MOCK_OPENAPI_SPECS,
} from '@/services/api-platform';
import {
  ReportDashboardPanel as RptDashboardPanel,
  ReportCard as RptReportCard,
  ReportDesigner as RptDesigner,
  ScheduleCard as RptScheduleCard,
  ExportPanel as RptExportPanel,
  CategoryBrowser as RptCategoryBrowser,
  ReportAnalyticsPanel as RptAnalyticsPanel,
  TemplateCard as RptTemplateCard,
  CompliancePanel as RptCompliancePanel,
  ReportMonitor as RptMonitor,
} from '@/features/reporting/components/ReportingComponents';
import {
  buildReportDashboard,
  computeReportAnalytics,
  MOCK_REPORT_DEFINITIONS,
  MOCK_REPORT_INSTANCES,
  MOCK_REPORT_TEMPLATES,
  MOCK_REPORT_SCHEDULES,
  MOCK_REPORT_EXPORTS,
  MOCK_COMPLIANCE_REPORTS,
} from '@/services/reporting';
import {
  PlatformDashboardPanel as PlatDashboardPanel,
  TenantCard as PlatTenantCard,
  HospitalSetupPanel as PlatHospitalPanel,
  FacilitySetupPanel as PlatFacilityPanel,
  LocalizationPanel as PlatLocalizationPanel,
  BrandingPanel as PlatBrandingPanel,
  LicenseCard as PlatLicenseCard,
  FeatureFlagPanel as PlatFeatureFlagPanel,
  SystemJobQueue as PlatJobQueue,
  HealthDashboard as PlatHealthDashboard,
  BackupPanel as PlatBackupPanel,
  MaintenancePanel as PlatMaintenancePanel,
  AuditTimeline as PlatAuditTimeline,
  PlatformAnalyticsPanel as PlatAnalyticsPanel,
  ExportToolbar as PlatExportToolbar,
} from '@/features/platform-admin/components/PlatformAdminComponents';
import {
  buildPlatformDashboard,
  computePlatformAnalytics,
  MOCK_TENANTS,
  MOCK_HOSPITALS,
  MOCK_FACILITIES,
  MOCK_LOCALIZATION,
  MOCK_BRANDING,
  MOCK_LICENSES,
  MOCK_FEATURE_FLAGS,
  MOCK_SYSTEM_JOBS,
  MOCK_SYSTEM_HEALTH,
  MOCK_BACKUPS,
  MOCK_MAINTENANCE,
  MOCK_PLATFORM_AUDITS,
} from '@/services/platform-admin';
import { buildHospitalOperations } from '@/services/executive/operational-intelligence';
import { MOCK_OPERATIONAL_METRICS } from '@/services/executive/mock-data';
import {
  buildMonthGrid,
  appointmentsToEvents,
} from '@/services/appointments/calendar';
import {
  AlertCard,
  NotificationItem,
  RealtimeStatus,
  ReminderCard,
  SystemBanner,
} from '@/shared/notifications';
import { appToast } from '@/services/api/toast';
import {
  ConfirmationDialog,
  DataPagination,
  DataTable,
  DataToolbar,
  ErrorView,
  ExportMenu,
  FilterChips,
  KpiDashboardGrid,
  LoadingButton,
  LoadingView,
  MetricCard,
  PageShell,
  SearchBar,
  SectionHeader,
  SortableColumnHeader,
  StatCard,
  StatusBadge,
} from '@/shared/components';
import {
  BarChartPanel,
  DonutChartPanel,
  SparklineChart,
  ChartPanel,
} from '@/shared/charts';
import {
  AppointmentCard,
  BedStatusCard,
  DirectoryCard as MedicalDirectoryCard,
  MedicationCard,
  PatientCard,
  TimelineEvent,
  TransferCard,
  VitalsCard,
} from '@/shared/medical';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { EmptyState } from '@/shared/ui/empty-state';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const demoRows = [
  { id: '1', name: 'Sarah Jenkins', status: 'Active' },
  { id: '2', name: 'James Wilson', status: 'Active' },
];

const demoPatientRecord = MOCK_PATIENT_RECORDS[0];
const demoAppointment = MOCK_APPOINTMENTS[0];
const demoCalendarGrid = buildMonthGrid(
  new Date(),
  appointmentsToEvents(MOCK_APPOINTMENTS.slice(0, 80)),
);
const demoAvailability = getAllProviderAvailability(
  new Date().toISOString().split('T')[0]!,
  'fac-001',
)[0];
const demoQueue = buildQueueFromAppointments(MOCK_APPOINTMENTS).slice(0, 3);
const demoAnalytics = {
  todayCount: 18,
  upcomingCount: 124,
  completedCount: 210,
  cancelledCount: 14,
  noShowCount: 6,
  averageWaitMinutes: 22,
  utilizationPercent: 78,
  bookingRatePercent: 91,
  queueLength: demoQueue.length,
  telemedicineCount: 12,
  dailyAppointments: [
    { label: 'Mon', value: 14 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 16 },
    { label: 'Thu', value: 20 },
    { label: 'Fri', value: 17 },
    { label: 'Sat', value: 8 },
    { label: 'Sun', value: 4 },
  ],
  weeklyTrend: [
    { label: 'W1', value: 80 },
    { label: 'W2', value: 92 },
    { label: 'W3', value: 88 },
    { label: 'W4', value: 95 },
  ],
  monthlyUtilization: [
    { label: 'Jan', value: 72 },
    { label: 'Feb', value: 75 },
    { label: 'Mar', value: 78 },
    { label: 'Apr', value: 81 },
  ],
  providerWorkload: [
    { label: 'Dr. Chen', value: 8 },
    { label: 'Dr. Martin', value: 6 },
  ],
  facilityOccupancy: [
    { label: 'Pitié-Salpêtrière', value: 12 },
    { label: 'Herriot', value: 6 },
  ],
};

const demoPatientMedication =
  PATIENT_MOCK_MEDICATIONS.find((m) => m.patientId === 'phr-001') ??
  PATIENT_MOCK_MEDICATIONS[0]!;
const demoPrescription =
  MOCK_PRESCRIPTIONS.find((p) => p.patientId === 'phr-001') ??
  MOCK_PRESCRIPTIONS[0]!;
const demoMedicationDashboard = {
  patientId: 'phr-001',
  todayTotal: 4,
  taken: 2,
  pending: 1,
  missed: 1,
  upcoming: 1,
  refillAlerts: 1,
  interactionAlerts: MOCK_INTERACTIONS.filter((i) => i.patientId === 'phr-001')
    .length,
  prescriptionAlerts: 1,
  medicationScore: 82,
  adherencePercent: 88,
  recentActivity: [],
};
const demoMedicationAdherence = {
  patientId: 'phr-001',
  daily: 92,
  weekly: 88,
  monthly: 85,
  yearly: 83,
  adherencePercent: 88,
  compliancePercent: 86,
  missedDoses: 3,
  lateDoses: 2,
  skippedDoses: 1,
  completedDoses: 42,
  medicationScore: 82,
  healthScoreImpact: 4,
  trend: [
    { label: 'Mon', value: 90 },
    { label: 'Tue', value: 88 },
    { label: 'Wed', value: 92 },
    { label: 'Thu', value: 85 },
  ],
};
const demoMedicationAnalytics = computeMedicationAnalytics(
  MOCK_PRESCRIPTIONS,
  PATIENT_MOCK_MEDICATIONS,
);
const demoMedicationEducation = buildMedicationEducation(
  demoPatientMedication.id,
);
const demoMedicationReminders = MOCK_REMINDERS.filter(
  (r) => r.patientId === 'phr-001',
).slice(0, 3);
const demoPhrInteractions = MOCK_INTERACTIONS.filter(
  (i) => i.patientId === 'phr-001',
);

const demoCarePlan =
  MOCK_CARE_PLANS.find(
    (p) => p.patientId === 'phr-001' && p.status === 'active',
  ) ?? MOCK_CARE_PLANS[0]!;
const demoCareDashboard = buildDashboard('phr-001');
const demoCareProgress = buildProgress('phr-001');
const demoCareAnalytics = buildAnalytics();
const demoCareGoals = MOCK_GOALS.filter((g) => g.patientId === 'phr-001').slice(
  0,
  3,
);
const demoCareTasks = MOCK_TASKS.filter((t) => t.patientId === 'phr-001').slice(
  0,
  3,
);
const demoCareTeam = MOCK_TEAM.filter(
  (m) => m.carePlanId === demoCarePlan.id,
).slice(0, 3);
const demoCareRisks = MOCK_RISKS.filter((r) => r.patientId === 'phr-001').slice(
  0,
  2,
);
const demoCareActivity = MOCK_ACTIVITY.filter(
  (a) => a.carePlanId === demoCarePlan.id,
).slice(0, 4);

const demoLabDashboard = buildLabDashboard('phr-001');
const demoLabAnalytics = buildLabAnalytics();
const demoLabTrends = buildTrends('phr-001');
const demoLabOrders = MOCK_LAB_ORDERS.filter(
  (o) => o.patientId === 'phr-001',
).slice(0, 3);
const demoLabReports = MOCK_LAB_REPORTS.filter(
  (r) => r.patientId === 'phr-001',
).slice(0, 2);
const demoLabObservations = MOCK_LAB_OBSERVATIONS.filter(
  (o) => o.patientId === 'phr-001',
).slice(0, 6);
const demoLabSpecimens = MOCK_SPECIMENS.filter(
  (s) => s.patientId === 'phr-001',
).slice(0, 2);
const demoLabAlerts = MOCK_LAB_ALERTS.filter(
  (a) => a.patientId === 'phr-001',
).slice(0, 2);
const demoLabMicro = MOCK_MICROBIOLOGY.filter(
  (m) => m.patientId === 'phr-001',
).slice(0, 2);
const demoLabPath = MOCK_PATHOLOGY.filter(
  (p) => p.patientId === 'phr-001',
).slice(0, 2);
const demoLabBlood = MOCK_BLOOD_BANK.filter(
  (b) => b.patientId === 'phr-001',
).slice(0, 2);
const demoLabQuality = buildQualityDashboard();
const demoLabInstruments = MOCK_INSTRUMENTS.slice(0, 2);
const demoLabTechs = MOCK_TECHNOLOGISTS.slice(0, 2);
const demoLabObsPhr = demoLabObservations.filter(
  (o) => o.patientId === 'phr-001',
);

const demoRadStudies = MOCK_RADIOLOGY_STUDIES.filter(
  (s) => s.patientId === 'phr-001',
).slice(0, 4);
const demoRadReport =
  MOCK_DIAGNOSTIC_REPORTS.find((r) => r.patientId === 'phr-001') ??
  MOCK_DIAGNOSTIC_REPORTS[0]!;
const demoRadDashboard = buildRadDashboard('phr-001');
const demoRadAnalytics = buildRadAnalytics();
const demoRadTimeline = buildStudyTimeline('phr-001');
const demoRadRadiologists = MOCK_RADIOLOGISTS.slice(0, 2);
const demoRadDevices = MOCK_IMAGING_DEVICES.slice(0, 2);

const demoMonitoringDashboard = buildMonitoringDashboard('phr-001');
const demoMonitoringAnalytics = computeMonitoringAnalytics();
const demoMonitoringVitals = MOCK_VITALS.filter(
  (v) => v.patientId === 'phr-001',
).slice(0, 6);
const demoMonitoringAlerts = MOCK_ALERTS.filter(
  (a) => a.patientId === 'phr-001',
).slice(0, 3);
const demoMonitoringDevices = MOCK_DEVICES.slice(0, 3);
const demoMonitoringRpm = MOCK_RPM_PROGRAMS.filter(
  (r) => r.patientId === 'phr-001',
).slice(0, 2);
const demoMonitoringScores = MOCK_EARLY_WARNING.filter(
  (e) => e.patientId === 'phr-001',
).slice(0, 4);
const demoMonitoringTrends = MOCK_TRENDS.filter(
  (t) => t.patientId === 'phr-001',
).slice(0, 2);
const demoMonitoringTimeline = buildMonitoringTimeline('phr-001');

const demoTelSession =
  MOCK_SESSIONS.find(
    (s) => s.patientId === 'phr-001' && s.status === 'completed',
  ) ?? MOCK_SESSIONS[0]!;
const demoTelDashboard = buildTelemedicineDashboard('phr-001');
const demoTelAnalytics = computeTelemedicineAnalytics();
const demoTelParticipants = MOCK_PARTICIPANTS.filter(
  (p) => p.sessionId === demoTelSession.sessionId,
).slice(0, 4);
const demoTelMessages = MOCK_MESSAGES.filter(
  (m) => m.sessionId === demoTelSession.sessionId,
).slice(0, 6);
const demoTelWaiting = MOCK_WAITING_ROOM.filter(
  (w) => w.status === 'waiting',
).slice(0, 3);
const demoTelNote =
  MOCK_CLINICAL_NOTES.find((n) => n.sessionId === demoTelSession.sessionId) ??
  MOCK_CLINICAL_NOTES[0]!;
const demoTelRecording =
  MOCK_RECORDINGS.find((r) => r.sessionId === demoTelSession.sessionId) ??
  MOCK_RECORDINGS[0]!;
const demoTelTimeline = buildTelemedicineTimeline(demoTelSession.sessionId);
const demoTelDeviceCheck = runDeviceCheck(demoTelSession.sessionId);

const demoBillDashboard = buildBillingDashboard('phr-001');
const demoBillAnalytics = computeRevenueAnalytics();
const demoBillInvoices = MOCK_INVOICES.filter(
  (i) => i.patientId === 'phr-001',
).slice(0, 4);
const demoBillClaims = MOCK_CLAIMS.filter(
  (c) => c.patientId === 'phr-001',
).slice(0, 3);
const demoBillPayments = MOCK_PAYMENTS.filter(
  (p) => p.patientId === 'phr-001',
).slice(0, 3);
const demoBillReceipts = MOCK_RECEIPTS.filter(
  (r) => r.patientId === 'phr-001',
).slice(0, 2);
const demoBillPolicies = MOCK_POLICIES.filter(
  (p) => p.patientId === 'phr-001',
).slice(0, 2);
const demoBillRefunds = MOCK_REFUNDS.slice(0, 2);
const demoBillOutstanding = buildOutstandingBalances().slice(0, 3);
const demoBillInvoice = demoBillInvoices[0] ?? MOCK_INVOICES[0]!;

const demoInvDashboard = buildInventoryDashboard('pharmacy');
const demoInvAnalytics = computeInventoryAnalytics();
const demoInvItems = MOCK_INVENTORY.filter(
  (i) => i.department === 'pharmacy',
).slice(0, 6);
const demoInvAssets = MOCK_ASSETS.slice(0, 4);
const demoInvSuppliers = MOCK_SUPPLIERS.slice(0, 4);
const demoInvOrders = MOCK_PURCHASE_ORDERS.slice(0, 4);
const demoInvWarehouses = MOCK_WAREHOUSES.slice(0, 3);
const demoInvTransfers = MOCK_TRANSFERS.slice(0, 3);
const demoInvExpiry = MOCK_EXPIRY_ALERTS.slice(0, 3);
const demoInvForecast = forecastDemand().slice(0, 4);

const demoProcDashboard = buildProcurementDashboard('pharmacy');
const demoProcAnalytics = computeProcurementAnalytics();
const demoProcSpend = computeSpendAnalysis('pharmacy');
const demoProcRequests = MOCK_PURCHASE_REQUESTS.slice(0, 4);
const demoProcOrders = MOCK_PROC_ORDERS.slice(0, 4);
const demoProcSuppliers = MOCK_PROC_SUPPLIERS.slice(0, 4);
const demoProcRFQs = MOCK_RFQS.slice(0, 3);
const demoProcContracts = MOCK_CONTRACTS.slice(0, 4);
const demoProcBudgets = MOCK_BUDGETS.slice(0, 4);
const demoProcReceipts = MOCK_GOODS_RECEIPTS.slice(0, 3);
const demoProcDeliveries = MOCK_DELIVERIES.slice(0, 3);
const demoProcInvoices = MOCK_PROC_INVOICES.slice(0, 3);
const demoProcApprovals = MOCK_APPROVALS.filter(
  (a) => a.status === 'pending',
).slice(0, 4);
const demoProcForecast = forecastProcurementDemand('pharmacy').slice(0, 4);
const demoProcRFQ = MOCK_RFQS[0]!;

const demoWfDashboard = buildWorkforceDashboard('fac-001');
const demoWfAnalytics = computeWorkforceAnalytics();
const demoWfCoverage = computeCoverage();
const demoWfEmployees = MOCK_EMPLOYEES.slice(0, 6);
const demoWfDepartments = MOCK_DEPARTMENTS.slice(0, 6);
const demoWfShifts = MOCK_SHIFTS.slice(0, 8);
const demoWfAttendance = MOCK_ATTENDANCE.slice(0, 6);
const demoWfLeave = MOCK_LEAVE_REQUESTS.filter(
  (l) => l.status === 'pending',
).slice(0, 4);
const demoWfTraining = MOCK_TRAINING.slice(0, 6);
const demoWfCerts = MOCK_EMPLOYEES.flatMap((e) => e.certifications).slice(0, 6);
const demoWfPerformance = MOCK_PERFORMANCE.slice(0, 4);
const demoWfPayroll = MOCK_PAYROLL.slice(0, 4);
const demoWfRoster = MOCK_ROSTERS[0]!;

const demoFacDashboard = buildFacilitiesDashboard('fac-001');
const demoFacAnalytics = computeFacilitiesAnalytics('fac-001');
const demoFacSites = MOCK_FACILITY_SITES.slice(0, 4);
const demoFacBuildings = MOCK_BUILDINGS.filter(
  (b) => b.facilityId === 'fac-001',
).slice(0, 6);
const demoFacRooms = MOCK_ROOMS.filter((r) => r.facilityId === 'fac-001').slice(
  0,
  6,
);
const demoFacBeds = MOCK_BEDS.filter((b) => b.facilityId === 'fac-001').slice(
  0,
  8,
);
const demoFacEquipment = MOCK_EQUIPMENT.filter(
  (e) => e.facilityId === 'fac-001',
).slice(0, 6);
const demoFacBiomed = MOCK_BIOMEDICAL_DEVICES.filter(
  (d) => d.facilityId === 'fac-001',
).slice(0, 4);
const demoFacWorkOrders = MOCK_WORK_ORDERS.filter(
  (w) => w.facilityId === 'fac-001',
).slice(0, 6);
const demoFacPreventive = MOCK_PREVENTIVE.filter(
  (p) => p.facilityId === 'fac-001',
).slice(0, 4);
const demoFacCalibration = MOCK_CALIBRATION.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 4);
const demoFacUtilities = MOCK_UTILITIES.filter(
  (u) => u.facilityId === 'fac-001',
).slice(0, 4);
const demoFacEnvironmental = MOCK_ENVIRONMENTAL.filter(
  (e) => e.facilityId === 'fac-001',
).slice(0, 6);
const demoFacVendors = MOCK_VENDORS.slice(0, 4);
const demoFacContracts = MOCK_FAC_CONTRACTS.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 4);
const demoFacVehicles = MOCK_VEHICLES.filter(
  (v) => v.facilityId === 'fac-001',
).slice(0, 4);

const demoFinDashboard = buildFinanceDashboard('fac-001');
const demoFinAnalytics = computeFinanceAnalytics('fac-001');
const demoFinAccounts = MOCK_CHART_OF_ACCOUNTS.filter(
  (a) => a.facilityId === 'fac-001',
).slice(0, 8);
const demoFinJournals = MOCK_JOURNALS.filter(
  (j) => j.facilityId === 'fac-001',
).slice(0, 6);
const demoFinTrialBalance = buildTrialBalance('fac-001');
const demoFinAP = MOCK_VENDOR_BILLS.filter(
  (b) => b.facilityId === 'fac-001',
).slice(0, 6);
const demoFinAR = MOCK_RECEIVABLES.filter(
  (r) => r.facilityId === 'fac-001',
).slice(0, 6);
const demoFinBudgets = MOCK_FIN_BUDGETS.filter(
  (b) => b.facilityId === 'fac-001',
).slice(0, 6);
const demoFinCash = MOCK_CASH_ACCOUNTS.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 4);
const demoFinBanks = MOCK_BANK_ACCOUNTS.filter(
  (b) => b.facilityId === 'fac-001',
).slice(0, 4);
const demoFinAssets = MOCK_FIXED_ASSETS.filter(
  (a) => a.facilityId === 'fac-001',
).slice(0, 6);
const demoFinDepreciation = MOCK_DEPRECIATION.slice(0, 8);

const demoQualDashboard = buildEqmsDashboard('fac-001');
const demoQualAnalytics = computeQualityAnalytics('fac-001');
const demoQualIncidents = MOCK_INCIDENTS.filter(
  (i) => i.facilityId === 'fac-001',
).slice(0, 6);
const demoQualRisks = MOCK_EQMS_RISKS.filter(
  (r) => r.facilityId === 'fac-001',
).slice(0, 6);
const demoQualCapa = MOCK_CAPA.filter((c) => c.facilityId === 'fac-001').slice(
  0,
  6,
);
const demoQualAudits = MOCK_EQMS_AUDITS.filter(
  (a) => a.facilityId === 'fac-001',
).slice(0, 6);
const demoQualPolicies = MOCK_EQMS_POLICIES.filter(
  (p) => !p.facilityId || p.facilityId === 'fac-001',
).slice(0, 6);
const demoQualAccreditation = MOCK_ACCREDITATION.slice(0, 6);
const demoQualCompliance = MOCK_EQMS_COMPLIANCE.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 6);
const demoQualInfections = MOCK_INFECTIONS.filter(
  (i) => i.facilityId === 'fac-001',
).slice(0, 20);
const demoQualIndicators = MOCK_QUALITY_INDICATORS.filter(
  (i) => i.facilityId === 'fac-001',
);

const demoPhmDashboard = buildPhmDashboard('fac-001');
const demoPhmAnalytics = computePopulationAnalytics('fac-001');
const demoPhmGaps = MOCK_CARE_GAPS.filter(
  (g) => g.facilityId === 'fac-001',
).slice(0, 6);
const demoPhmRegistries = MOCK_REGISTRIES.filter(
  (r) => !r.facilityId || r.facilityId === 'fac-001',
).slice(0, 6);
const demoPhmScores = MOCK_RISK_SCORES.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 6);
const demoPhmCohorts = MOCK_COHORTS.filter(
  (c) => !c.facilityId || c.facilityId === 'fac-001',
).slice(0, 4);
const demoPhmCampaigns = MOCK_CAMPAIGNS.filter(
  (c) => !c.facilityId || c.facilityId === 'fac-001',
).slice(0, 6);

const demoCdssDashboard = buildCdssDashboard('fac-001');
const demoCdssAnalytics = computeCdssAnalytics('fac-001');
const demoCdssAlerts = MOCK_CDSS_ALERTS.filter(
  (a) => a.facilityId === 'fac-001',
).slice(0, 6);
const demoCdssRecs = MOCK_RECOMMENDATIONS.filter(
  (r) => r.facilityId === 'fac-001',
).slice(0, 6);
const demoCdssGuidelines = MOCK_CDSS_GUIDELINES.filter(
  (g) => !g.facilityId || g.facilityId === 'fac-001',
).slice(0, 4);
const demoCdssOrderSets = MOCK_ORDER_SETS.filter(
  (o) => !o.facilityId || o.facilityId === 'fac-001',
).slice(0, 6);
const demoCdssPreventive = MOCK_CDSS_PREVENTIVE.filter(
  (p) => p.facilityId === 'fac-001',
).slice(0, 6);
const demoCdssPathways = MOCK_CDSS_PATHWAYS.filter(
  (p) => !p.facilityId || p.facilityId === 'fac-001',
).slice(0, 4);

const demoInteropDashboard = buildInteropDashboard('fac-001');
const demoInteropAnalytics = computeInteropAnalytics('fac-001');
const demoInteropEndpoints = MOCK_ENDPOINTS.filter(
  (e) => e.facilityId === 'fac-001',
).slice(0, 6);
const demoInteropFhir = MOCK_FHIR_SERVERS.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 4);
const demoInteropHl7 = MOCK_HL7_MESSAGES.filter(
  (m) => m.facilityId === 'fac-001',
).slice(0, 6);
const demoInteropDicom = MOCK_DICOM_STUDIES.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 6);
const demoInteropWebhooks = MOCK_WEBHOOKS.filter(
  (w) => !w.facilityId || w.facilityId === 'fac-001',
).slice(0, 4);
const demoInteropMappings = MOCK_MAPPINGS.slice(0, 4);
const demoInteropSmart = MOCK_SMART_APPS.slice(0, 4);
const demoInteropAudit = MOCK_INTEROP_AUDIT.filter(
  (a) => a.facilityId === 'fac-001',
).slice(0, 6);

const demoResearchDashboard = buildResearchDashboard('fac-001');
const demoResearchAnalytics = computeResearchAnalytics('fac-001');
const demoResearchTrials = MOCK_TRIALS.filter(
  (t) => t.facilityId === 'fac-001',
).slice(0, 6);
const demoResearchParticipants = MOCK_RESEARCH_PARTICIPANTS.filter(
  (p) => p.facilityId === 'fac-001',
).slice(0, 6);
const demoResearchVisits = MOCK_VISITS.filter(
  (v) => v.facilityId === 'fac-001',
).slice(0, 8);
const demoResearchAE = MOCK_ADVERSE_EVENTS.filter(
  (e) => e.facilityId === 'fac-001',
).slice(0, 6);
const demoResearchSpecimens = MOCK_BIOSPECIMENS.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 6);
const demoResearchPublications = MOCK_PUBLICATIONS.slice(0, 4);
const demoResearchInnovation = MOCK_INNOVATION.filter(
  (p) => p.facilityId === 'fac-001',
).slice(0, 4);

const demoPhDashboard = buildPublicHealthDashboard('fac-001');
const demoPhAnalytics = computePublicHealthAnalytics('fac-001');
const demoPhCases = MOCK_DISEASE_CASES.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 6);
const demoPhOutbreaks = MOCK_OUTBREAKS.filter(
  (o) => o.facilityId === 'fac-001',
).slice(0, 4);
const demoPhImmunizations = MOCK_IMMUNIZATIONS.filter(
  (i) => i.facilityId === 'fac-001',
).slice(0, 6);
const demoPhContacts = MOCK_CONTACT_TRACING.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 8);
const demoPhPrograms = MOCK_COMMUNITY_PROGRAMS.filter(
  (p) => p.facilityId === 'fac-001',
).slice(0, 4);
const demoPhSdoh = MOCK_SDOH.filter((s) => s.facilityId === 'fac-001').slice(
  0,
  6,
);

const demoAiDashboard = buildAiDashboard('fac-001');
const demoAiAnalytics = computeAiAnalytics('fac-001');
const demoAiPredictions = MOCK_PREDICTIONS.filter(
  (p) => p.facilityId === 'fac-001',
).slice(0, 6);
const demoAiRiskScores = MOCK_AI_RISK_ASSESSMENTS.filter(
  (r) => r.facilityId === 'fac-001',
).slice(0, 6);
const demoAiRecommendations = MOCK_AI_RECOMMENDATIONS.filter(
  (r) => r.facilityId === 'fac-001',
).slice(0, 4);
const demoAiCopilot = MOCK_COPILOT_SESSIONS.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 2);
const demoAiSummaries = MOCK_CLINICAL_SUMMARIES.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 4);
const demoAiForecasts = MOCK_FORECASTS.filter(
  (f) => f.facilityId === 'fac-001',
).slice(0, 4);
const demoAiModels = MOCK_MODEL_VERSIONS.slice(0, 6);
const demoAiExplainability = MOCK_EXPLAINABILITY.filter(
  (e) => e.facilityId === 'fac-001',
).slice(0, 2);
const demoAiBias = MOCK_BIAS_METRICS.slice(0, 6);

const demoExDashboard = buildExecutiveCommandCenter('fac-001');
const demoExAnalytics = computeExecutiveAnalytics('fac-001');
const demoExKpis = MOCK_ENTERPRISE_KPIS.filter(
  (k) => k.facilityId === 'fac-001',
).slice(0, 6);
const demoExScorecards = MOCK_DEPARTMENT_SCORECARDS.filter(
  (s) => s.facilityId === 'fac-001',
).slice(0, 6);
const demoExOperations = buildHospitalOperations(
  'fac-001',
  MOCK_OPERATIONAL_METRICS.filter((m) => m.facilityId === 'fac-001'),
);
const demoExCapacity = MOCK_CAPACITY_SNAPSHOTS.filter(
  (c) => c.facilityId === 'fac-001',
).slice(0, 6);
const demoExAlerts = MOCK_ENTERPRISE_ALERTS.filter(
  (a) => a.facilityId === 'fac-001',
).slice(0, 6);
const demoExBenchmarks = MOCK_BENCHMARK_REPORTS.filter(
  (b) => b.facilityId === 'fac-001',
).slice(0, 4);
const demoExInitiatives = MOCK_STRATEGIC_INITIATIVES.filter(
  (i) => !i.facilityId || i.facilityId === 'fac-001',
).slice(0, 4);
const demoExForecasts = MOCK_EXECUTIVE_FORECASTS.filter(
  (f) => f.facilityId === 'fac-001',
).slice(0, 2);

const demoIamDashboard = buildIamDashboard('tenant-001');
const demoIamAnalytics = computeIamAnalytics('tenant-001');
const demoIamUsers = MOCK_IAM_USERS.slice(0, 6);
const demoIamRoles = MOCK_IAM_ROLES.slice(0, 6);
const demoIamSessions = MOCK_IAM_SESSIONS.slice(0, 4);
const demoIamMfa = MOCK_MFA_DEVICES.slice(0, 4);
const demoIamOAuth = MOCK_OAUTH_CLIENTS.slice(0, 4);
const demoIamApiKeys = MOCK_API_KEYS.slice(0, 4);
const demoIamAudit = MOCK_IAM_AUDIT.slice(0, 8);
const demoIamIncidents = MOCK_SECURITY_INCIDENTS.slice(0, 4);
const demoIamRisk = MOCK_IAM_RISK_SCORES.slice(0, 4);
const demoIamBreakGlass = MOCK_BREAK_GLASS.slice(0, 4);
const demoIamConsents = MOCK_CONSENTS.slice(0, 4);

const demoDocDashboard = buildDocumentDashboard('tenant-001', 'fac-001');
const demoDocAnalytics = computeDocumentAnalytics('tenant-001', 'fac-001');
const demoDocs = MOCK_DOCUMENTS.slice(0, 6);
const demoDocTemplates = MOCK_TEMPLATES.slice(0, 4);
const demoDocVersions = MOCK_VERSIONS.slice(0, 6);
const demoDocSignatures = MOCK_SIGNATURES.slice(0, 4);
const demoDocSigRequests = MOCK_SIGNATURE_REQUESTS.slice(0, 4);
const demoDocShared = MOCK_SHARED_LINKS.slice(0, 4);
const demoDocOcr = MOCK_OCR_RESULTS.slice(0, 4);
const demoDocLegal = MOCK_LEGAL_HOLDS.slice(0, 3);
const demoDocArchives = MOCK_ARCHIVE_JOBS.slice(0, 3);

const demoOrchDashboard = buildWorkflowDashboard('fac-001');
const demoOrchAnalytics = computeWorkflowAnalytics('fac-001');
const demoOrchDefinitions = MOCK_WORKFLOW_DEFINITIONS.slice(0, 6);
const demoOrchInstances = MOCK_WORKFLOW_INSTANCES.slice(0, 6);
const demoOrchTasks = MOCK_WORKFLOW_TASKS.slice(0, 12);
const demoOrchApprovals = MOCK_WF_APPROVALS.slice(0, 6);
const demoOrchRules = MOCK_BUSINESS_RULES.slice(0, 6);
const demoOrchJobs = MOCK_BACKGROUND_JOBS.slice(0, 6);
const demoOrchEvents = MOCK_WORKFLOW_EVENTS.slice(0, 8);
const demoOrchSchedules = MOCK_SCHEDULES.slice(0, 4);
const demoOrchSlas = MOCK_SLAS.slice(0, 4);
const demoOrchEscalations = MOCK_ESCALATIONS.slice(0, 4);
const demoOrchTemplates = MOCK_PROCESS_TEMPLATES.slice(0, 4);

const demoMsgDashboard = buildMessagingDashboard('fac-001');
const demoMsgAnalytics = computeMessagingAnalytics('fac-001');
const demoMsgInbox = MOCK_INBOX.slice(0, 6);
const demoMsgAnnouncements = MOCK_ANNOUNCEMENTS.slice(0, 4);
const demoMsgThreads = MOCK_THREADS.slice(0, 4);
const demoMsgChat = MOCK_CHAT_MESSAGES.slice(0, 8);
const demoMsgSecure = MOCK_SECURE_MESSAGES.slice(0, 4);
const demoMsgBroadcasts = MOCK_BROADCASTS.slice(0, 4);
const demoMsgTemplates = MOCK_MSG_TEMPLATES.slice(0, 4);
const demoMsgCampaigns = MOCK_MSG_CAMPAIGNS.slice(0, 4);
const demoMsgDeliveries = MOCK_MSG_DELIVERIES.slice(0, 8);
const demoMsgChannels = MOCK_CHANNELS.slice(0, 6);
const demoMsgIntegrations = MOCK_INTEGRATIONS.slice(0, 4);
const demoMsgMessages = MOCK_MSG_MESSAGES.slice(0, 4);

const demoApiDashboard = buildApiDashboard();
const demoApiAnalytics = computeApiPlatformAnalytics();
const demoApiKeys = MOCK_API_PLATFORM_KEYS.slice(0, 4);
const demoApiOAuth = MOCK_OAUTH_APPS.slice(0, 4);
const demoApiWebhooks = MOCK_API_PLATFORM_WEBHOOKS.slice(0, 4);
const demoApiSdks = MOCK_SDK_PACKAGES.slice(0, 4);
const demoApiRateLimits = MOCK_RATE_LIMIT_POLICIES.slice(0, 4);
const demoApiPartners = MOCK_API_PARTNERS.slice(0, 4);
const demoApiSandboxes = MOCK_SANDBOX_ENVIRONMENTS.slice(0, 3);
const demoApiOpenApi = MOCK_OPENAPI_SPECS[0]!;

const demoRptDashboard = buildReportDashboard('fac-001');
const demoRptAnalytics = computeReportAnalytics('fac-001');
const demoRptDefinitions = MOCK_REPORT_DEFINITIONS.slice(0, 6);
const demoRptInstances = MOCK_REPORT_INSTANCES.slice(0, 6);
const demoRptTemplates = MOCK_REPORT_TEMPLATES.slice(0, 4);
const demoRptSchedules = MOCK_REPORT_SCHEDULES.slice(0, 4);
const demoRptExports = MOCK_REPORT_EXPORTS.slice(0, 6);
const demoRptCompliance = MOCK_COMPLIANCE_REPORTS.slice(0, 4);

const demoPlatDashboard = buildPlatformDashboard();
const demoPlatAnalytics = computePlatformAnalytics();
const demoPlatTenants = MOCK_TENANTS.slice(0, 4);
const demoPlatHospitals = MOCK_HOSPITALS.slice(0, 4);
const demoPlatFacilities = MOCK_FACILITIES.slice(0, 4);
const demoPlatLicenses = MOCK_LICENSES.slice(0, 3);
const demoPlatFlags = MOCK_FEATURE_FLAGS.slice(0, 6);
const demoPlatJobs = MOCK_SYSTEM_JOBS.slice(0, 6);
const demoPlatHealth = MOCK_SYSTEM_HEALTH.slice(0, 6);
const demoPlatBackups = MOCK_BACKUPS.slice(0, 4);
const demoPlatMaintenance = MOCK_MAINTENANCE.slice(0, 3);
const demoPlatAudits = MOCK_PLATFORM_AUDITS.slice(0, 8);

export default function DesignSystem() {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16 lg:px-6">
        <div className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-serif italic text-lg font-bold leading-none">
              M
            </span>
          </div>
          <span className="text-lg text-foreground">
            Med&apos;ease Design System
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto max-w-6xl w-full space-y-12 motion-preset-entrance">
          <header className="border-b pb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Enterprise UI Standards
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              UI primitives, composite components, healthcare widgets, and state
              patterns for the Med-ease platform.
            </p>
          </header>

          <Tabs defaultValue="composite" className="w-full">
            <TabsList className="mb-8 flex flex-wrap h-auto bg-muted/50 p-1">
              <TabsTrigger value="composite" className="px-4">
                Composite
              </TabsTrigger>
              <TabsTrigger value="components" className="px-4">
                Primitives
              </TabsTrigger>
              <TabsTrigger value="medical" className="px-4">
                Healthcare
              </TabsTrigger>
              <TabsTrigger value="forms" className="px-4">
                Forms
              </TabsTrigger>
              <TabsTrigger value="data" className="px-4">
                Data
              </TabsTrigger>
              <TabsTrigger value="notifications" className="px-4">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="directory" className="px-4">
                Directory
              </TabsTrigger>
              <TabsTrigger value="medical-library" className="px-4">
                Medical Library
              </TabsTrigger>
              <TabsTrigger value="patient-records" className="px-4">
                Patient Records
              </TabsTrigger>
              <TabsTrigger value="appointments" className="px-4">
                Appointments
              </TabsTrigger>
              <TabsTrigger value="medications" className="px-4">
                Medications
              </TabsTrigger>
              <TabsTrigger value="care-plans" className="px-4">
                Care Plans
              </TabsTrigger>
              <TabsTrigger value="laboratory" className="px-4">
                Laboratory
              </TabsTrigger>
              <TabsTrigger value="radiology" className="px-4">
                Radiology
              </TabsTrigger>
              <TabsTrigger value="patient-monitoring" className="px-4">
                Patient Monitoring
              </TabsTrigger>
              <TabsTrigger value="telemedicine" className="px-4">
                Telemedicine
              </TabsTrigger>
              <TabsTrigger value="billing" className="px-4">
                Billing & RCM
              </TabsTrigger>
              <TabsTrigger value="inventory" className="px-4">
                Inventory & Assets
              </TabsTrigger>
              <TabsTrigger value="procurement" className="px-4">
                Procurement & Supply Chain
              </TabsTrigger>
              <TabsTrigger value="workforce" className="px-4">
                Workforce Management
              </TabsTrigger>
              <TabsTrigger value="facilities" className="px-4">
                Facilities Management
              </TabsTrigger>
              <TabsTrigger value="finance" className="px-4">
                Finance & Accounting
              </TabsTrigger>
              <TabsTrigger value="quality" className="px-4">
                Quality, Risk & Compliance
              </TabsTrigger>
              <TabsTrigger value="phm" className="px-4">
                Population Health
              </TabsTrigger>
              <TabsTrigger value="cdss" className="px-4">
                Clinical Decision Support
              </TabsTrigger>
              <TabsTrigger value="interop" className="px-4">
                Interoperability Hub
              </TabsTrigger>
              <TabsTrigger value="research" className="px-4">
                Research & Clinical Trials
              </TabsTrigger>
              <TabsTrigger value="public-health" className="px-4">
                Public Health & Community Health
              </TabsTrigger>
              <TabsTrigger value="ai-intelligence" className="px-4">
                AI Clinical Intelligence
              </TabsTrigger>
              <TabsTrigger value="executive" className="px-4">
                Executive Command Center
              </TabsTrigger>
              <TabsTrigger value="iam" className="px-4">
                Enterprise Identity & Security
              </TabsTrigger>
              <TabsTrigger value="documents" className="px-4">
                Enterprise Documents
              </TabsTrigger>
              <TabsTrigger value="workflows" className="px-4">
                Workflow Automation
              </TabsTrigger>
              <TabsTrigger value="messaging" className="px-4">
                Enterprise Messaging
              </TabsTrigger>
              <TabsTrigger value="api-platform" className="px-4">
                API Platform
              </TabsTrigger>
              <TabsTrigger value="reporting" className="px-4">
                Enterprise Reporting
              </TabsTrigger>
              <TabsTrigger value="platform-admin" className="px-4">
                Platform Administration
              </TabsTrigger>
              <TabsTrigger value="states" className="px-4">
                States
              </TabsTrigger>
            </TabsList>

            <TabsContent value="composite" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Page Shell"
                  description="Standard page scaffold with header and toolbar."
                />
                <PageShell
                  title="Patient Overview"
                  subtitle="Enterprise page header with actions and status."
                  status={<StatusBadge status="stable" />}
                  lastUpdated="Today at 2:30 PM"
                  primaryAction={<Button>Primary Action</Button>}
                  secondaryActions={<Button variant="outline">Export</Button>}
                  toolbar={
                    <DataToolbar
                      search={
                        <SearchBar
                          onSearch={setSearch}
                          placeholder="Search patients…"
                        />
                      }
                      actions={
                        <LoadingButton loading={false}>
                          Add Record
                        </LoadingButton>
                      }
                    />
                  }
                >
                  <p className="text-sm text-muted-foreground">
                    Search query: {search || '(empty)'}
                  </p>
                </PageShell>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Metrics & Tables" />
                <div className="grid md:grid-cols-3 gap-4">
                  <StatCard
                    label="Active Patients"
                    value="1,248"
                    hint="Updated hourly"
                    icon={Users}
                  />
                  <MetricCard
                    title="Bed Occupancy"
                    value="87%"
                    status="warning"
                    description="ICU ward"
                  />
                  <ChartPanel title="Admissions Trend">
                    <SparklineChart
                      data={[
                        { label: 'Mon', value: 12 },
                        { label: 'Tue', value: 15 },
                        { label: 'Wed', value: 9 },
                      ]}
                    />
                  </ChartPanel>
                </div>
                <DataTable
                  caption="Demo patient list"
                  columns={[
                    { id: 'name', header: 'Name', cell: (row) => row.name },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (row) => row.status,
                    },
                  ]}
                  data={demoRows}
                  getRowId={(row) => row.id}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Dialogs & Loading" />
                <div className="flex flex-wrap gap-4">
                  <ConfirmationDialog
                    trigger={
                      <Button variant="destructive">Delete Record</Button>
                    }
                    title="Delete patient record?"
                    description="This action cannot be undone. The record will be archived per policy."
                    confirmLabel="Delete"
                    destructive
                    onConfirm={() => undefined}
                  />
                  <LoadingButton loading={false}>Submit Form</LoadingButton>
                </div>
                <LoadingView variant="skeleton" />
              </section>
            </TabsContent>

            <TabsContent value="components" className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Buttons
                </h2>
                <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-card">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Badges & Status
                </h2>
                <div className="flex flex-wrap gap-4 items-center p-6 border rounded-xl bg-card">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="destructive">Critical</Badge>
                  <StatusBadge status="observation" />
                  <StatusBadge status="transferred" />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Form Controls
                </h2>
                <div className="grid md:grid-cols-2 gap-8 p-6 border rounded-xl bg-card">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ds-input">Standard Input</Label>
                      <Input id="ds-input" placeholder="Enter text…" />
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="medical" className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Patient & Appointments
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <PatientCard
                    fullName="Sarah Jenkins"
                    mrn="MRN-10293"
                    age={34}
                    gender="F"
                    status="stable"
                  />
                  <AppointmentCard
                    providerName="Dr. Emily Chen"
                    specialty="Cardiology"
                    scheduledAt="Tomorrow, 10:00 AM"
                    location="Mount Sinai, Room 402"
                    status="pending"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Vitals & Medications
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <VitalsCard
                    type="heartRate"
                    value={72}
                    unit="bpm"
                    status="normal"
                    timeago="10m ago"
                  />
                  <VitalsCard
                    type="bloodPressure"
                    value="120/80"
                    unit="mmHg"
                    status="warning"
                    timeago="1h ago"
                  />
                  <VitalsCard
                    type="temperature"
                    value={101.2}
                    unit="°F"
                    status="critical"
                    timeago="Just now"
                  />
                </div>
                <MedicationCard
                  name="Atorvastatin"
                  dosage="20mg"
                  frequency="1 pill daily at bedtime"
                  prescribedBy="Emily Chen"
                  status="active"
                  nextDose="Tonight at 10:00 PM"
                  refillsRemaining={3}
                  instructions="Take with a full glass of water."
                />
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Transfers & Beds
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <TransferCard
                    patientName="Sarah Jenkins"
                    fromFacility="Mount Sinai"
                    toFacility="NYU Langone"
                    status="pending"
                  />
                  <BedStatusCard
                    label="A-102"
                    ward="ICU"
                    status="occupied"
                    patientName="Sarah Jenkins"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Care Timeline
                </h2>
                <TimelineEvent
                  items={[
                    {
                      id: '1',
                      title: 'Initial Consultation',
                      description: 'Chest pain evaluation.',
                      date: 'Oct 12, 2023',
                      status: 'completed',
                    },
                    {
                      id: '2',
                      title: 'Lab Results',
                      description: 'Panel processing.',
                      date: 'Today',
                      status: 'current',
                    },
                  ]}
                />
              </section>
            </TabsContent>

            <TabsContent value="forms" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Forms Architecture"
                  description="React Hook Form + Zod + shared field components, wizards, autosave, and draft recovery."
                />
                <TransferRequestWizardDemo />
              </section>
            </TabsContent>

            <TabsContent value="data" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Data Architecture"
                  description="KPIs → toolbar → filters → table → pagination — the standard data page hierarchy."
                />
                <KpiDashboardGrid columns={3}>
                  <StatCard
                    label="Active Patients"
                    value="1,248"
                    icon={Users}
                  />
                  <MetricCard
                    title="Bed Occupancy"
                    value="87%"
                    status="warning"
                  />
                  <ChartPanel title="Admissions Trend">
                    <SparklineChart
                      data={[
                        { label: 'Mon', value: 12 },
                        { label: 'Tue', value: 15 },
                        { label: 'Wed', value: 9 },
                      ]}
                    />
                  </ChartPanel>
                </KpiDashboardGrid>
                <DataToolbar
                  search={
                    <SearchBar
                      onSearch={setSearch}
                      placeholder="Search records…"
                    />
                  }
                  actions={
                    <ExportMenu
                      filename="demo-records"
                      rows={demoRows.map((row) => ({
                        name: row.name,
                        status: row.status,
                      }))}
                      columns={[
                        { key: 'name', label: 'Name' },
                        { key: 'status', label: 'Status' },
                      ]}
                    />
                  }
                />
                <FilterChips
                  filters={
                    search ? [{ key: 'q', label: 'Search', value: search }] : []
                  }
                  onRemove={() => setSearch('')}
                />
                <DataTable
                  caption="Demo enterprise table"
                  data={demoRows.filter((row) =>
                    row.name.toLowerCase().includes(search.toLowerCase()),
                  )}
                  getRowId={(row) => row.id}
                  columns={[
                    {
                      id: 'name',
                      header: (
                        <SortableColumnHeader
                          label="Name"
                          columnId="name"
                          onSort={() => undefined}
                        />
                      ),
                      cell: (row) => row.name,
                    },
                    {
                      id: 'status',
                      header: 'Status',
                      cell: (row) => (
                        <StatusBadge status="stable" label={row.status} />
                      ),
                    },
                  ]}
                  footer={
                    <DataPagination
                      page={1}
                      pageSize={25}
                      total={demoRows.length}
                      onPageChange={() => undefined}
                    />
                  }
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Charts & Directories" />
                <div className="grid gap-6 lg:grid-cols-2">
                  <BarChartPanel
                    title="Weekly Admissions"
                    data={[
                      { label: 'Mon', value: 12 },
                      { label: 'Tue', value: 18 },
                      { label: 'Wed', value: 9 },
                    ]}
                  />
                  <DonutChartPanel
                    title="Transfer Status"
                    data={[
                      { label: 'Pending', value: 4 },
                      { label: 'In Transit', value: 2 },
                      { label: 'Completed', value: 8 },
                    ]}
                  />
                </div>
                <MedicalDirectoryCard
                  type="professional"
                  name="Dr. Emily Chen"
                  subtitle="Cardiology"
                  specialization="Interventional Cardiology"
                  location="Mount Sinai, New York"
                  availability="Available today"
                  status="stable"
                  actions={<Button size="sm">View Profile</Button>}
                />
              </section>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Communication Layer"
                  description="Notification center, banners, reminders, toasts, and realtime indicators."
                />
                <div className="flex flex-wrap items-center gap-4">
                  <RealtimeStatus connected />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appToast.success({
                        title: createDemoNotification().title,
                        description: createDemoNotification().message,
                      })
                    }
                  >
                    Show toast
                  </Button>
                </div>
                <SystemBanner
                  variant="maintenance"
                  title="Scheduled maintenance"
                  message="Platform maintenance tonight 11:00 PM – 1:00 AM EST."
                  dismissible
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <NotificationItem
                    notification={createDemoNotification()}
                    compact
                  />
                  <ReminderCard
                    reminder={{
                      id: 'demo-r',
                      title: 'Medication reminder',
                      description: 'Take Atorvastatin 20mg',
                      dueAt: new Date(Date.now() + 3600000).toISOString(),
                      type: 'medication',
                      priority: 'high',
                    }}
                  />
                </div>
                <AlertCard
                  title="Critical vitals alert"
                  message="Patient requires immediate review."
                  priority="critical"
                />
              </section>
            </TabsContent>

            <TabsContent value="directory" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Healthcare Services Directory"
                  description="Provider cards, badges, search, filters, and map placeholder."
                />
                <ProviderBadges provider={MOCK_DIRECTORY_PROVIDERS[0]} />
                <div className="grid gap-4 lg:grid-cols-2">
                  <ProviderCard
                    provider={MOCK_DIRECTORY_PROVIDERS[0]}
                    portalBase="/patient"
                  />
                  <ProviderCard
                    provider={MOCK_DIRECTORY_PROVIDERS[4]}
                    portalBase="/patient"
                  />
                </div>
                <DirectoryMapPlaceholder />
              </section>
            </TabsContent>

            <TabsContent value="medical-library" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Medical Library"
                  description="Medication cards, badges, warnings, and BDPM-ready reference profiles."
                />
                <MedicationBadges medication={LIBRARY_MOCK_MEDICATIONS[0]} />
                <div className="grid gap-4 lg:grid-cols-2">
                  <LibraryMedicationCard
                    medication={LIBRARY_MOCK_MEDICATIONS[0]}
                    portalBase="/patient"
                  />
                  <LibraryMedicationCard
                    medication={LIBRARY_MOCK_MEDICATIONS[3]}
                    portalBase="/patient"
                  />
                </div>
                <MedicationWarnings medication={LIBRARY_MOCK_MEDICATIONS[0]} />
              </section>
            </TabsContent>

            <TabsContent value="patient-records" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Patient Health Records (PHR)"
                  description="Longitudinal patient record — banner, health score, clinical alerts, vitals, labs, timeline, medications, care plans, and emergency summary."
                />
                <PatientBanner
                  demographics={demoPatientRecord.demographics}
                  healthScore={demoPatientRecord.healthScore}
                  alerts={demoPatientRecord.alerts}
                />
                <HealthScoreWidget score={demoPatientRecord.healthScore} />
                <SummarySection record={demoPatientRecord} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Medications & Allergies" />
                <MedicationsSection record={demoPatientRecord} />
                <AllergiesSection record={demoPatientRecord} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Laboratory & Timeline" />
                <LaboratorySection record={demoPatientRecord} />
                <TimelineSection
                  record={{
                    ...demoPatientRecord,
                    timeline: demoPatientRecord.timeline.slice(0, 6),
                  }}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Care Plans, Documents & Emergency" />
                <CarePlansSection record={demoPatientRecord} />
                <DocumentsSection record={demoPatientRecord} />
                <EmergencySection record={demoPatientRecord} />
              </section>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Appointments & Scheduling"
                  description="Appointment cards, calendar views, booking workflow, queue, waitlist, provider availability, and analytics."
                />
                <AppointmentMetrics analytics={demoAnalytics} />
                <div className="grid gap-4 lg:grid-cols-2">
                  <EnterpriseAppointmentCard appointment={demoAppointment} />
                  <UpcomingAppointmentCard appointment={demoAppointment} />
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Calendar & Schedule" />
                <CalendarLegend />
                <MonthView grid={demoCalendarGrid} />
                <ScheduleGrid appointments={MOCK_APPOINTMENTS.slice(0, 12)} />
                {demoAvailability ? (
                  <ProviderSchedule availability={demoAvailability} />
                ) : null}
              </section>

              <section className="space-y-4">
                <SectionHeader title="Time Slots, Queue & Waitlist" />
                <TimeSlotPicker
                  providerId="prov-001"
                  facilityId="fac-001"
                  date={new Date().toISOString().split('T')[0]!}
                  onChange={() => undefined}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {demoQueue.map((entry) => (
                    <QueueCard key={entry.id} entry={entry} />
                  ))}
                  {MOCK_WAITLIST.slice(0, 2).map((entry) => (
                    <WaitlistCard key={entry.id} entry={entry} />
                  ))}
                </div>
                <AppointmentReminderCard appointment={demoAppointment} />
              </section>
            </TabsContent>

            <TabsContent value="medications" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Medication Management & Adherence"
                  description="Prescription cards, dose scheduling, adherence analytics, refill workflow, and drug interaction alerts."
                />
                <MedicationKpiCards dashboard={demoMedicationDashboard} />
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <AdherenceGauge
                    percent={demoMedicationAdherence.adherencePercent}
                  />
                  <AdherenceChart adherence={demoMedicationAdherence} />
                </div>
                <MedicationAnalyticsPanel analytics={demoMedicationAnalytics} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Prescriptions & Active Medications" />
                <div className="grid gap-4 lg:grid-cols-2">
                  <PrescriptionCard prescription={demoPrescription} />
                  <EnterpriseMedicationCard
                    medication={demoPatientMedication}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <MedicationStatusBadge
                    status={demoPatientMedication.status}
                  />
                  <MedicationStatusBadge status="paused" />
                  <MedicationStatusBadge status="completed" />
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Safety Banners & Reminders" />
                {demoPhrInteractions.slice(0, 1).map((i) => (
                  <MedicationInteractionBanner key={i.id} interaction={i} />
                ))}
                <MedicationWarningBanner
                  title="Renal dosing adjustment"
                  message="Creatinine clearance below 30 mL/min — consider dose reduction for metformin."
                />
                <div className="grid gap-4 md:grid-cols-3">
                  {demoMedicationReminders.map((reminder) => (
                    <MedicationReminderCard
                      key={reminder.id}
                      title={reminder.title}
                      message={reminder.message}
                      dueAt={reminder.dueAt}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Dose Cards, Refills & Interactions" />
                <div className="grid gap-4 md:grid-cols-3">
                  {MOCK_SCHEDULE.slice(0, 3).map((dose) => (
                    <DoseCard key={dose.id} dose={dose} />
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <RefillCard refill={MOCK_REFILL_REQUESTS[0]!} />
                  {MOCK_INTERACTIONS.filter((i) => i.patientId === 'phr-001')
                    .slice(0, 2)
                    .map((i) => (
                      <InteractionAlert key={i.id} interaction={i} />
                    ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Administration, Dispensing & Education" />
                <div className="grid gap-4 md:grid-cols-2">
                  {MOCK_ADMINISTRATIONS.filter((a) => a.patientId === 'phr-001')
                    .slice(0, 2)
                    .map((a) => (
                      <MedicationAdministrationCard key={a.id} record={a} />
                    ))}
                  {MOCK_DISPENSES.filter((d) => d.patientId === 'phr-001')
                    .slice(0, 2)
                    .map((d) => (
                      <DispenseCard key={d.id} dispense={d} />
                    ))}
                </div>
                {demoMedicationEducation ? (
                  <MedicationEducationPanel
                    education={demoMedicationEducation}
                  />
                ) : null}
              </section>
            </TabsContent>

            <TabsContent value="care-plans" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Care Plans & Clinical Coordination"
                  description="Care plan dashboard, goals, tasks, care team, risk assessment, clinical pathways, and population analytics."
                />
                <CarePlanKpiCards dashboard={demoCareDashboard} />
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <CompletionRing
                    percent={demoCareDashboard.completionPercent}
                  />
                  <ProgressChart progress={demoCareProgress} />
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Care Plan, Goals & Tasks" />
                <div className="grid gap-4 lg:grid-cols-2">
                  <CarePlanCard plan={demoCarePlan} />
                  {demoCareGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {demoCareTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Care Team, Risk & Pathways" />
                <div className="grid gap-4 md:grid-cols-3">
                  {demoCareTeam.map((member) => (
                    <CareTeamCard key={member.id} member={member} />
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {demoCareRisks.map((risk) => (
                    <RiskIndicator key={risk.id} risk={risk} />
                  ))}
                  {MOCK_PATHWAYS.slice(0, 2).map((pathway) => (
                    <ClinicalPathwayCard key={pathway.id} pathway={pathway} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Activity Feed & Analytics" />
                <div className="grid gap-4 lg:grid-cols-2">
                  <ActivityFeed items={demoCareActivity} />
                  <CareAnalyticsPanel analytics={demoCareAnalytics} />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="laboratory" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Laboratory Information System (LIS)"
                  description="Enterprise LIS — results, reference ranges, critical values, microbiology, pathology, blood bank, QC, and analytics."
                />
                <LaboratoryKpiCards dashboard={demoLabDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Orders, Results & Specimens" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoLabOrders.map((o) => (
                    <LabOrderCard key={o.id} order={o} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoLabReports.map((r) => (
                    <LabResultCard
                      key={r.id}
                      report={r}
                      observations={demoLabObservations.filter(
                        (o) => o.reportId === r.id,
                      )}
                    />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoLabSpecimens.map((s) => (
                    <SpecimenCard key={s.id} specimen={s} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Critical Values, Trends & Result Viewer" />
                <CriticalValueBanner
                  title="Critical potassium"
                  message="K+ 6.8 mmol/L — immediate clinical review required."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  {demoLabAlerts.map((a) => (
                    <CriticalAlertCard key={a.id} alert={a} />
                  ))}
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {demoLabTrends.slice(0, 2).map((s) => (
                    <TrendChart key={s.testId} series={s} />
                  ))}
                </div>
                {demoLabReports[0] ? (
                  <ResultViewer
                    report={demoLabReports[0]}
                    observations={demoLabObsPhr.filter(
                      (o) => o.reportId === demoLabReports[0]!.id,
                    )}
                  />
                ) : null}
                <ReferenceRangePanel observations={demoLabObsPhr.slice(0, 4)} />
                <ResultTable observations={demoLabObsPhr.slice(0, 6)} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Microbiology, Pathology & Blood Bank" />
                <div className="grid gap-4 md:grid-cols-2">
                  {demoLabMicro.map((m) => (
                    <MicrobiologyPanel key={m.id} result={m} />
                  ))}
                  {demoLabPath.map((p) => (
                    <PathologyPanel key={p.id} result={p} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoLabBlood.map((b) => (
                    <BloodBankPanel key={b.id} record={b} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Quality, Instruments & Analytics" />
                <QualityDashboardPanel dashboard={demoLabQuality} />
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoLabInstruments.map((i) => (
                    <InstrumentCard key={i.id} instrument={i} />
                  ))}
                  {demoLabTechs.map((t) => (
                    <TechnologistCard key={t.id} technologist={t} />
                  ))}
                </div>
                <PreparationCard
                  testName="Fasting Glucose"
                  preparation="Fast 8–12 hours before collection."
                />
                <LaboratoryAnalyticsPanel analytics={demoLabAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="radiology" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Radiology & Medical Imaging"
                  description="Study cards, viewer placeholder, diagnostic reports, timeline, devices, and imaging analytics."
                />
                <RadiologyMetrics dashboard={demoRadDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Studies & Critical Findings" />
                <CriticalFindingBanner
                  title="Critical finding"
                  message="Large pulmonary embolism detected — immediate clinical review recommended."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoRadStudies.map((s) => (
                    <RadiologyStudyCard key={s.id} study={s} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Image Viewer & Diagnostic Report" />
                {demoRadStudies[0] ? (
                  <ImagingViewer study={demoRadStudies[0]} />
                ) : null}
                <DiagnosticReportPanel report={demoRadReport} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Timeline, Team & Devices" />
                <StudyTimeline entries={demoRadTimeline} />
                <div className="grid gap-4 md:grid-cols-2">
                  {demoRadRadiologists.map((r) => (
                    <RadiologistCard key={r.id} radiologist={r} />
                  ))}
                  {demoRadDevices.map((d) => (
                    <DeviceCard key={d.id} device={d} />
                  ))}
                </div>
                <PACSStatusCard />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Analytics" />
                <RadiologyAnalyticsPanel analytics={demoRadAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="patient-monitoring" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Patient Monitoring & RPM"
                  description="Vital cards, trend charts, NEWS2/MEWS scores, alerts, devices, RPM enrollment, and monitoring analytics."
                />
                <MonitoringKpiCards dashboard={demoMonitoringDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Vital Signs & Early Warning Scores" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoMonitoringVitals.map((v) => (
                    <VitalCard key={v.id} vital={v} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoMonitoringScores.map((s) =>
                    s.type === 'NEWS2' ? (
                      <NEWSScoreCard key={s.id} score={s} />
                    ) : (
                      <MEWSCard key={s.id} score={s} />
                    ),
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Alerts, Devices & RPM" />
                {demoMonitoringAlerts.slice(0, 1).map((a) => (
                  <AlertBanner key={a.id} alert={a} />
                ))}
                <div className="grid gap-4 md:grid-cols-3">
                  {demoMonitoringAlerts.map((a) => (
                    <MonitoringAlertCard key={a.id} alert={a} />
                  ))}
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {demoMonitoringDevices.map((d) => (
                    <MonitoringDeviceCard key={d.id} device={d} />
                  ))}
                  {demoMonitoringRpm.map((p) => (
                    <RPMEnrollmentCard key={p.id} program={p} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Trends, Timeline & Analytics" />
                <ClinicalTrendPanel trends={demoMonitoringTrends} />
                <div className="grid gap-4 lg:grid-cols-2">
                  {demoMonitoringTrends.slice(0, 2).map((t) => (
                    <VitalTrendChart key={t.id} trend={t} />
                  ))}
                </div>
                <ObservationTimeline entries={demoMonitoringTimeline} />
                <MonitoringAnalyticsPanel analytics={demoMonitoringAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="telemedicine" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Telemedicine & Virtual Care"
                  description="Session cards, video layouts, waiting room, secure chat, clinical notes, device check, and analytics."
                />
                <TelemedicineMetrics dashboard={demoTelDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Sessions & Video" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoTelDashboard.recentSessions.slice(0, 3).map((s) => (
                    <SessionCard key={s.sessionId} session={s} />
                  ))}
                </div>
                <SessionHeader session={demoTelSession} />
                <VideoWindow session={demoTelSession} />
                <ParticipantGrid participants={demoTelParticipants} />
                <SessionControls />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Waiting Room, Chat & Clinical Documentation" />
                <VirtualWaitingRoom entries={demoTelWaiting} />
                <ChatPanel messages={demoTelMessages} />
                <SOAPPanel note={demoTelNote} />
                <ConsentCard />
                <VisitSummaryCard session={demoTelSession} />
                <SessionTimeline entries={demoTelTimeline} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Recording, Whiteboard & Connection" />
                <RecordingPanel recording={demoTelRecording} />
                <WhiteboardPanel strokeCount={24} />
                <ScreenSharePanel active />
                <DeviceCheckCard result={demoTelDeviceCheck} />
                <BandwidthIndicator
                  mbps={demoTelDeviceCheck.bandwidthMbps}
                  latency={demoTelDeviceCheck.latencyMs}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Analytics" />
                <TelemedicineAnalyticsPanel analytics={demoTelAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="billing" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Billing & Revenue Cycle"
                  description="Revenue KPIs, invoices, claims workflow, payments, receipts, insurance, and financial analytics."
                />
                <FinancialMetrics dashboard={demoBillDashboard} />
                <CollectionPanel
                  rate={demoBillDashboard.collectionRate}
                  outstanding={demoBillDashboard.outstandingBalances}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Invoices, Claims & Payments" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoBillInvoices.map((i) => (
                    <InvoiceCard key={i.invoiceId} invoice={i} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoBillClaims.map((c) => (
                    <ClaimCard key={c.claimId} claim={c} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoBillPayments.map((p) => (
                    <PaymentCard key={p.paymentId} payment={p} />
                  ))}
                </div>
                <InvoiceDetailPanel invoice={demoBillInvoice} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Receipts, Insurance & Refunds" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoBillReceipts.map((r) => (
                    <ReceiptCard key={r.receiptId} receipt={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoBillPolicies.map((p) => (
                    <InsuranceCard key={p.policyId} policy={p} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoBillRefunds.map((r) => (
                    <RefundCard key={r.refundId} refund={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoBillOutstanding.map((b) => (
                    <OutstandingBalanceCard key={b.patientId} balance={b} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Payment Methods & Export" />
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {[
                    'stripe',
                    'paystack',
                    'flutterwave',
                    'card',
                    'insurance',
                  ].map((m, i) => (
                    <PaymentMethodCard key={m} method={m} active={i === 0} />
                  ))}
                </div>
                <ExportToolbar />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Revenue Analytics" />
                <RevenueChart analytics={demoBillAnalytics} />
                <BillingAnalyticsPanel analytics={demoBillAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Inventory & Asset Management"
                  description="Enterprise stock metrics, pharmacy inventory, medical assets, procurement, warehouse operations, expiry alerts, and analytics."
                />
                <InventoryMetrics dashboard={demoInvDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Stock, Expiry & Barcode" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInvItems.map((i) => (
                    <InventoryCard key={i.inventoryId} item={i} />
                  ))}
                </div>
                <div className="space-y-3">
                  {demoInvExpiry.map((a) => (
                    <ExpiryBanner key={a.alertId} alert={a} />
                  ))}
                </div>
                <BarcodeScanner />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Procurement & Warehouse" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInvOrders.map((o) => (
                    <PurchaseOrderCard key={o.purchaseOrderId} order={o} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoInvSuppliers.map((s) => (
                    <SupplierCard key={s.supplierId} supplier={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoInvWarehouses.map((w) => (
                    <WarehouseCard key={w.warehouseId} warehouse={w} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoInvTransfers.map((t) => (
                    <InventoryTransferCard key={t.transferId} transfer={t} />
                  ))}
                </div>
                <InventoryExportToolbar />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Medical Assets & Forecasting" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoInvAssets.map((a) => (
                    <AssetCard key={a.assetId} asset={a} />
                  ))}
                </div>
                <ForecastPanel forecasts={demoInvForecast} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Inventory Analytics" />
                <InventoryAnalyticsPanel analytics={demoInvAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="procurement" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Procurement & Supply Chain"
                  description="Purchase requests, POs, RFQs, approvals, contracts, budgets, receiving, invoice matching, and spend analytics."
                />
                <ProcurementMetrics dashboard={demoProcDashboard} />
                <SpendDashboard analysis={demoProcSpend} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Requests, POs & RFQs" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoProcRequests.map((r) => (
                    <PurchaseRequestCard key={r.requestId} request={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoProcOrders.map((o) => (
                    <ProcPurchaseOrderCard key={o.purchaseOrderId} order={o} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoProcRFQs.map((r) => (
                    <RFQCard key={r.rfqId} rfq={r} />
                  ))}
                </div>
                <RFQComparisonPanel rfq={demoProcRFQ} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Suppliers, Contracts & Budgets" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoProcSuppliers.slice(0, 2).map((s) => (
                    <ProcSupplierCard key={s.supplierId} supplier={s} />
                  ))}
                  {rankSuppliers()
                    .slice(0, 2)
                    .map((s) => (
                      <SupplierPerformanceCard key={s.supplierId} score={s} />
                    ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoProcContracts.map((c) => (
                    <ContractCard key={c.contractId} contract={c} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoProcBudgets.map((b) => (
                    <BudgetCard key={b.budgetId} budget={b} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Approvals, Receiving & Deliveries" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoProcApprovals.map((a) => (
                    <ApprovalCard key={a.workflowId} workflow={a} />
                  ))}
                </div>
                <ApprovalTimeline workflows={demoProcApprovals} />
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoProcReceipts.map((r) => (
                    <GoodsReceiptCard key={r.receiptId} receipt={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoProcDeliveries.map((d) => (
                    <DeliveryCard key={d.deliveryId} delivery={d} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Invoices, Forecast & Analytics" />
                <div className="grid gap-4 sm:grid-cols-3">
                  {demoProcInvoices.map((i) => (
                    <InvoiceMatchingCard key={i.invoiceId} invoice={i} />
                  ))}
                </div>
                <ForecastChart forecasts={demoProcForecast} />
                <ProcurementAnalyticsPanel analytics={demoProcAnalytics} />
                <ProcurementExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="workforce" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Workforce Management"
                  description="Employee directory, shift scheduling, roster boards, attendance, training, credentials, performance, payroll, organization chart, and coverage analytics."
                />
                <WorkforceMetrics dashboard={demoWfDashboard} />
                <CoverageDashboard metrics={demoWfCoverage.slice(0, 6)} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Employees & Departments" />
                <StaffDirectory employees={demoWfEmployees} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfEmployees.slice(0, 3).map((e) => (
                    <EmployeeCard key={e.employeeId} employee={e} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfDepartments.map((d) => (
                    <DepartmentCard key={d.departmentId} department={d} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Scheduling & Roster" />
                <WorkforceScheduleGrid shifts={demoWfShifts} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoWfShifts.slice(0, 4).map((s) => (
                    <ShiftCard key={s.shiftId} shift={s} />
                  ))}
                </div>
                <RosterBoard roster={demoWfRoster} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Attendance & Leave" />
                <ClockInPanel />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfAttendance.map((a) => (
                    <AttendanceCard key={a.attendanceId} record={a} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfLeave.map((l) => (
                    <LeaveRequestCard key={l.leaveId} request={l} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Training, Credentials & Performance" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfTraining.map((t) => (
                    <TrainingCard key={t.trainingId} training={t} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfCerts.map((c) => (
                    <CertificationCard key={c.certificationId} cert={c} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoWfPerformance.map((p) => (
                    <PerformanceCard key={p.reviewId} review={p} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Payroll, Organization & Analytics" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoWfPayroll.map((p) => (
                    <PayrollSummaryCard key={p.payrollId} summary={p} />
                  ))}
                </div>
                <OrganizationChart units={MOCK_ORG_UNITS} />
                <WorkforceAnalyticsPanel analytics={demoWfAnalytics} />
                <WorkforceExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="facilities" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Facilities Management"
                  description="CMMS dashboard, buildings, rooms, beds, biomedical equipment, work orders, preventive maintenance, calibration, utilities, and environmental monitoring."
                />
                <FacilitiesMetricsDashboard dashboard={demoFacDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Facilities & Buildings" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacSites.map((f) => (
                    <FacilityCard key={f.facilityId} facility={f} />
                  ))}
                </div>
                <AssetMap buildings={demoFacBuildings} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Rooms, Beds & Equipment" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFacRooms.map((r) => (
                    <RoomCard key={r.roomId} room={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacBeds.map((b) => (
                    <BedCard key={b.bedId} bed={b} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFacEquipment.map((e) => (
                    <EquipmentCard key={e.equipmentId} equipment={e} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacBiomed.map((d) => (
                    <BiomedicalDeviceCard key={d.equipmentId} device={d} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Maintenance & Calibration" />
                <MaintenanceCalendar orders={demoFacWorkOrders} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFacWorkOrders.map((wo) => (
                    <WorkOrderCard key={wo.workOrderId} order={wo} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacPreventive.map((p) => (
                    <PreventiveMaintenanceCard
                      key={p.scheduleId}
                      schedule={p}
                    />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacCalibration.map((c) => (
                    <CalibrationCard key={c.calibrationId} record={c} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Utilities, Environment & Fleet" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacUtilities.map((u) => (
                    <UtilityCard key={u.utilityId} utility={u} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFacEnvironmental.map((r) => (
                    <EnvironmentalCard key={r.readingId} reading={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacVehicles.map((v) => (
                    <FleetCard key={v.vehicleId} vehicle={v} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Vendors, Contracts & Analytics" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFacVendors.map((v) => (
                    <VendorCard key={v.vendorId} vendor={v} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFacContracts.map((c) => (
                    <FacContractCard key={c.contractId} contract={c} />
                  ))}
                </div>
                <FacilitiesAnalyticsPanel analytics={demoFacAnalytics} />
                <FacilitiesExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="finance" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Finance & Accounting"
                  description="Executive finance dashboard, general ledger, AP/AR, cash management, budgets, fixed assets, and financial reporting."
                />
                <FinancialDashboard dashboard={demoFinDashboard} />
                <KPICards analytics={demoFinAnalytics} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Chart of Accounts & Journals" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFinAccounts.map((a) => (
                    <AccountCard key={a.accountId} account={a} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFinJournals.map((j) => (
                    <JournalCard key={j.journalId} journal={j} />
                  ))}
                </div>
                <LedgerViewer
                  journals={demoFinJournals
                    .filter((j) => j.status === 'posted')
                    .slice(0, 3)}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Trial Balance & Financial Statements" />
                <TrialBalanceTable lines={demoFinTrialBalance} />
                <div className="grid gap-4 md:grid-cols-2">
                  <FinancialStatementViewer
                    statement={{
                      statementId: 'demo-pl',
                      type: 'profit_loss',
                      title: 'Profit & Loss',
                      asOfDate: '2025-06-30',
                      lines: demoFinTrialBalance
                        .filter(
                          (l) =>
                            l.accountType === 'revenue' ||
                            l.accountType === 'expense',
                        )
                        .slice(0, 8)
                        .map((l) => ({
                          label: l.accountName,
                          amount: l.balance,
                          category: l.accountType,
                        })),
                      totals: { netIncome: demoFinDashboard.netIncome },
                    }}
                  />
                  <FinancialStatementViewer
                    statement={{
                      statementId: 'demo-bs',
                      type: 'balance_sheet',
                      title: 'Balance Sheet',
                      asOfDate: '2025-06-30',
                      lines: demoFinTrialBalance
                        .filter((l) =>
                          ['asset', 'liability', 'equity'].includes(
                            l.accountType,
                          ),
                        )
                        .slice(0, 8)
                        .map((l) => ({
                          label: l.accountName,
                          amount: l.balance,
                          category: l.accountType,
                        })),
                      totals: { assets: demoFinDashboard.cashPosition },
                    }}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Accounts Payable & Receivable" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFinAP.map((b) => (
                    <APInvoiceCard key={b.billId} bill={b} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFinAR.map((r) => (
                    <ARInvoiceCard key={r.receivableId} receivable={r} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Budgets, Cash & Fixed Assets" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFinBudgets.map((b) => (
                    <FinanceBudgetCard key={b.budgetId} budget={b} />
                  ))}
                </div>
                <BudgetVarianceChart budgets={demoFinBudgets} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFinCash.map((c) => (
                    <CashAccountCard key={c.cashAccountId} account={c} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {demoFinBanks.map((b) => (
                    <BankAccountCard key={b.bankAccountId} account={b} />
                  ))}
                </div>
                {demoFinBanks[0] ? (
                  <ReconciliationPanel account={demoFinBanks[0]} />
                ) : null}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoFinAssets.map((a) => (
                    <FinanceAssetCard key={a.assetId} asset={a} />
                  ))}
                </div>
                <DepreciationSchedule entries={demoFinDepreciation} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Executive Analytics" />
                <FinanceAnalyticsPanel analytics={demoFinAnalytics} />
                <div className="grid gap-4 md:grid-cols-2">
                  <FinanceRevenueChart analytics={demoFinAnalytics} />
                  <FinanceExpenseChart analytics={demoFinAnalytics} />
                </div>
                <FinanceExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="quality" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Quality, Risk & Compliance"
                  description="Enterprise eQMS — incident management, risk register, CAPA, infection surveillance, audits, accreditation, and regulatory compliance."
                />
                <QualityExecutiveDashboard dashboard={demoQualDashboard} />
                <HeatMap data={demoQualDashboard.riskHeatMap} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Incidents & CAPA" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualIncidents.map((i) => (
                    <IncidentCard key={i.incidentId} incident={i} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualCapa.map((c) => (
                    <CAPACard key={c.capaId} capa={c} />
                  ))}
                </div>
                <FishbonePanel />
                <FiveWhysPanel />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Risk Register & Audits" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualRisks.map((r) => (
                    <RiskCard key={r.riskId} risk={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualAudits.map((a) => (
                    <QualityAuditCard key={a.auditId} audit={a} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Infection Surveillance & Compliance" />
                <InfectionDashboard
                  records={demoQualInfections}
                  outbreaks={[{ outbreakId: 'obk-001', count: 4 }]}
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualCompliance.map((c) => (
                    <ComplianceScoreCard key={c.complianceId} record={c} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Accreditation & Policy Management" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualAccreditation.map((s) => (
                    <AccreditationCard key={s.standardId} standard={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoQualPolicies.map((p) => (
                    <QualityPolicyCard key={p.policyId} policy={p} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Executive Quality Analytics" />
                <QualityAnalyticsPanel analytics={demoQualAnalytics} />
                <QualityMetrics indicators={demoQualIndicators} />
                <QualityExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="phm" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Population Health Management"
                  description="Enterprise PHM — population registries, care gap closure, risk stratification, cohort builder, outreach campaigns, and executive analytics."
                />
                <PopulationDashboard dashboard={demoPhmDashboard} />
                <RiskDistributionPanel
                  distribution={demoPhmDashboard.riskDistribution}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Care Gaps & Registries" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhmGaps.map((g) => (
                    <CareGapCard key={g.gapId} gap={g} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhmRegistries.map((r) => (
                    <RegistryCard key={r.registryId} registry={r} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Risk Stratification & Cohorts" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhmScores.map((s) => (
                    <PhmRiskCard key={s.scoreId} score={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoPhmCohorts.map((c) => (
                    <CohortBuilder key={c.cohortId} cohort={c} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Outreach & Executive Analytics" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhmCampaigns.map((c) => (
                    <OutreachCampaignCard key={c.campaignId} campaign={c} />
                  ))}
                </div>
                <PopulationAnalyticsPanel analytics={demoPhmAnalytics} />
                <PhmExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="cdss" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Clinical Decision Support (CDSS)"
                  description="Enterprise CDSS — real-time clinical alerts, evidence-based recommendations, drug safety, order sets, risk calculators, and clinical pathways."
                />
                <CDSDashboard dashboard={demoCdssDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Alerts & Recommendations" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoCdssAlerts.map((a) => (
                    <ClinicalAlertCard key={a.alertId} alert={a} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoCdssRecs.map((r) => (
                    <RecommendationCard
                      key={r.recommendationId}
                      recommendation={r}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Guidelines, Order Sets & Drug Safety" />
                {demoCdssGuidelines.slice(0, 1).map((g) => (
                  <GuidelineViewer key={g.guidelineId} guideline={g} />
                ))}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoCdssOrderSets.map((o) => (
                    <OrderSetCard key={o.orderSetId} orderSet={o} />
                  ))}
                </div>
                <DrugInteractionBanner
                  alert={{
                    alertId: 'demo-dxi',
                    patientId: 'phr-0001',
                    patientName: 'Patient 1',
                    drugA: 'Warfarin',
                    drugB: 'Aspirin',
                    severity: 'high',
                    mechanism: 'Increased bleeding risk',
                    recommendation: 'Monitor INR closely',
                  }}
                />
                <AllergyBanner
                  alert={{
                    alertId: 'demo-alx',
                    patientId: 'phr-0002',
                    patientName: 'Patient 2',
                    allergen: 'Penicillin',
                    medication: 'Amoxicillin',
                    severity: 'critical',
                    reaction: 'Anaphylaxis',
                  }}
                />
                <ContraindicationBanner
                  alert={{
                    alertId: 'demo-ctx',
                    patientId: 'phr-0003',
                    patientName: 'Patient 3',
                    medication: 'Metformin',
                    condition: 'Renal failure',
                    severity: 'critical',
                    recommendation: 'Do not prescribe',
                  }}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Risk Calculators, Pathways & Preventive Care" />
                <RiskCalculatorCard
                  calculator={{
                    calculatorId: 'calc-001',
                    name: 'CHA2DS2-VASc',
                    type: 'chads_vasc',
                    description: 'Stroke risk in atrial fibrillation',
                    inputs: [],
                    interpretationBands: [],
                  }}
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoCdssPathways.map((p) => (
                    <CdssPathwayCard key={p.pathwayId} pathway={p} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoCdssPreventive.map((p) => (
                    <PreventiveReminderCard key={p.reminderId} reminder={p} />
                  ))}
                </div>
                {MOCK_DECISION_TREES.slice(0, 1).map((t) => (
                  <DecisionTreeViewer key={t.treeId} tree={t} />
                ))}
              </section>

              <section className="space-y-4">
                <SectionHeader title="CDSS Analytics" />
                <CdssAnalyticsPanel analytics={demoCdssAnalytics} />
                <CdssExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="interop" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Interoperability Hub"
                  description="Enterprise integration backbone — FHIR R4/R5, HL7 v2.x, DICOMweb, CDA, IHE profiles, API gateway, SMART on FHIR, and health information exchange."
                />
                <HealthDashboard dashboard={demoInteropDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="FHIR Servers & HL7 Messages" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropFhir.map((s) => (
                    <FhirServerCard key={s.serverId} server={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropHl7.map((m) => (
                    <Hl7MessageCard key={m.messageId} message={m} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="DICOM, Endpoints & Integration Queue" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropDicom.map((s) => (
                    <DicomStudyCard key={s.studyId} study={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropEndpoints.map((e) => (
                    <EndpointCard key={e.endpointId} endpoint={e} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {MOCK_QUEUES.map((q) => (
                    <InteropQueueCard key={q.queueId} queue={q} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="API Gateway, Webhooks & SMART Apps" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropWebhooks.map((w) => (
                    <WebhookCard key={w.webhookId} webhook={w} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropSmart.map((a) => (
                    <SmartAppCard key={a.appId} app={a} />
                  ))}
                </div>
                <ApiClientCard
                  client={{
                    clientId: 'client-demo',
                    name: 'Partner EHR',
                    grantTypes: ['client_credentials'],
                    redirectUris: [],
                    status: 'active',
                  }}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Mapping Profiles & Analytics" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropMappings.map((m) => (
                    <MappingCard key={m.profileId} mapping={m} />
                  ))}
                </div>
                <InteropAnalyticsPanel analytics={demoInteropAnalytics} />
                <InteropExportToolbar />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Audit Timeline" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoInteropAudit.map((log) => (
                    <InteropAuditCard key={log.auditId} log={log} />
                  ))}
                </div>
              </section>
            </TabsContent>

            <TabsContent value="research" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Research & Clinical Trials"
                  description="Enterprise CRMS — clinical trials, participant recruitment, eConsent, protocol compliance, adverse event reporting, biospecimen tracking, and research analytics."
                />
                <StudyDashboard dashboard={demoResearchDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Clinical Trials & Participants" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoResearchTrials.map((t) => (
                    <TrialCard key={t.trialId} trial={t} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoResearchParticipants.map((p) => (
                    <ResearchParticipantCard
                      key={p.participantId}
                      participant={p}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Study Visits, Consent & Safety" />
                <VisitTimeline visits={demoResearchVisits} />
                <SafetyBoard events={demoResearchAE.filter((e) => e.serious)} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoResearchAE.map((e) => (
                    <AdverseEventCard key={e.eventId} event={e} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Biospecimens, Publications & Innovation" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoResearchSpecimens.map((s) => (
                    <BiospecimenCard key={s.specimenId} specimen={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoResearchPublications.map((p) => (
                    <PublicationCard key={p.publicationId} publication={p} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoResearchInnovation.map((p) => (
                    <InnovationCard key={p.projectId} project={p} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Research Analytics" />
                <ResearchAnalyticsPanel analytics={demoResearchAnalytics} />
                <ResearchExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="public-health" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Public Health & Community Health"
                  description="Enterprise public health — disease surveillance, immunization registries, outbreak response, contact tracing, SDOH, and community health analytics."
                />
                <EpidemiologyDashboard dashboard={demoPhDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Disease Surveillance & Outbreaks" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhOutbreaks.map((o) => (
                    <OutbreakCard key={o.outbreakId} outbreak={o} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhCases.map((c) => (
                    <DiseaseCaseCard key={c.caseId} caseRecord={c} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Immunizations, Contact Tracing & SDOH" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhImmunizations.map((r) => (
                    <ImmunizationCard key={r.immunizationId} record={r} />
                  ))}
                </div>
                <ContactTracingBoard contacts={demoPhContacts} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhSdoh.map((a) => (
                    <SDOHCard key={a.assessmentId} assessment={a} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Community Programs & Analytics" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPhPrograms.map((p) => (
                    <CommunityProgramCard key={p.programId} program={p} />
                  ))}
                </div>
                <PhAnalyticsPanel analytics={demoPhAnalytics} />
                <PhExportToolbar />
              </section>
            </TabsContent>

            <TabsContent value="ai-intelligence" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="AI Clinical Intelligence & Predictive Analytics"
                  description="Enterprise AI platform — predictive models, clinical copilot, operational forecasting, model governance, and explainable AI."
                />
                <AiDashboardPanel dashboard={demoAiDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Predictions, Risk Scores & Recommendations" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoAiPredictions.map((p) => (
                    <PredictionCard key={p.predictionId} prediction={p} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoAiRiskScores.map((r) => (
                    <RiskScoreCard key={r.assessmentId} assessment={r} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoAiRecommendations.map((r) => (
                    <AiRecommendationCard
                      key={r.recommendationId}
                      recommendation={r}
                    />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Clinical Copilot & Summaries" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoAiCopilot.map((s) => (
                    <CopilotChatPanel key={s.sessionId} session={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoAiSummaries.map((s) => (
                    <ClinicalSummaryCard key={s.summaryId} summary={s} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Operational Forecasting & Model Governance" />
                <OperationalForecastPanel forecasts={demoAiForecasts} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoAiModels.map((m) => (
                    <ModelPerformanceCard key={m.modelId} model={m} />
                  ))}
                </div>
                {demoAiExplainability.map((r) => (
                  <ExplainabilityPanel key={r.reportId} report={r} />
                ))}
                <BiasDashboard metrics={demoAiBias} />
                <AiAnalyticsPanel analytics={demoAiAnalytics} />
                <AiExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="executive" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Executive Command Center & Enterprise BI"
                  description="Unified enterprise dashboard aggregating KPIs, operational intelligence, scorecards, benchmarking, and strategic initiatives across the entire Med-ease platform."
                />
                <ExExecutiveDashboard dashboard={demoExDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Enterprise KPIs & Scorecards" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoExKpis.map((k) => (
                    <ExecutiveKpiCard key={k.kpiId} kpi={k} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoExScorecards.map((s) => (
                    <ScorecardPanel key={s.scorecardId} scorecard={s} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Hospital Operations, Capacity & Patient Flow" />
                <HospitalOperationsBoard operations={demoExOperations} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoExCapacity.map((c) => (
                    <ScorecardPanel
                      key={c.snapshotId}
                      scorecard={{
                        scorecardId: c.snapshotId,
                        departmentId: c.unit,
                        departmentName: c.unit,
                        facilityId: c.facilityId,
                        overallScore: c.occupancyRate,
                        clinicalScore: c.occupancyRate,
                        operationalScore: c.availableBeds,
                        financialScore: c.totalBeds,
                        qualityScore: c.occupiedBeds,
                        period: 'Current',
                      }}
                    />
                  ))}
                </div>
                <PatientFlowPanel
                  flow={{
                    facilityId: 'fac-001',
                    arrivalsToday: 142,
                    dischargesToday: 118,
                    transfersToday: 14,
                    avgLengthOfStay: 4.3,
                    readmissionRate: 8.7,
                    flowTrend: demoExDashboard.kpiTrend,
                  }}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Revenue, Quality, Workforce & Population Health" />
                <RevenueDashboardPanel
                  revenue={{
                    facilityId: 'fac-001',
                    revenueMtd: demoExDashboard.revenueMtd,
                    revenueYtd: demoExDashboard.revenueMtd * 12,
                    collectionRate: 94,
                    denialRate: 6,
                    netMargin: 8.5,
                    revenueTrend: demoExDashboard.kpiTrend,
                  }}
                />
                <ExClinicalQualityDashboard
                  quality={{
                    facilityId: 'fac-001',
                    overallScore: demoExDashboard.qualityScore,
                    patientSatisfaction: 88,
                    infectionRate: 2.1,
                    mortalityIndex: 0.92,
                    complianceRate: 96,
                    qualityTrend: demoExDashboard.kpiTrend,
                  }}
                />
                <WorkforceDashboardPanel
                  workforce={{
                    facilityId: 'fac-001',
                    totalStaff: 1240,
                    vacancyRate: 6.5,
                    overtimeHours: 420,
                    turnoverRate: 12,
                    satisfactionScore: 85,
                    staffingTrend: demoExDashboard.kpiTrend,
                  }}
                />
                <ExPopulationHealthDashboard
                  population={{
                    facilityId: 'fac-001',
                    attributedLives: 45200,
                    riskScore: 62,
                    gapClosureRate: 74,
                    preventiveCareRate: 68,
                    chronicDiseaseRate: 28,
                    populationTrend: demoExDashboard.kpiTrend,
                  }}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Benchmarking, Initiatives, Forecasting & Alerts" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoExBenchmarks.map((b) => (
                    <ExBenchmarkPanel key={b.reportId} report={b} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoExInitiatives.map((i) => (
                    <StrategicInitiativeCard
                      key={i.initiativeId}
                      initiative={i}
                    />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {demoExForecasts.map((f) => (
                    <ExForecastPanel key={f.forecastId} forecast={f} />
                  ))}
                </div>
                <EnterpriseAlertCenter alerts={demoExAlerts} />
                <ExExecutiveAnalyticsPanel analytics={demoExAnalytics} />
                <ExExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="iam" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Identity, IAM, Security & Governance"
                  description="Multi-tenant identity platform — RBAC/ABAC, MFA, SSO, OAuth, session management, consent, break-glass, and zero-trust governance for the entire Med-ease platform."
                />
                <IamSecurityDashboard dashboard={demoIamDashboard} />
                <IamZeroTrustDashboard dashboard={demoIamDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Users, Roles & Permissions" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamUsers.map((u) => (
                    <IamUserCard key={u.userId} user={u} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamRoles.map((r) => (
                    <IamRoleCard key={r.roleId} role={r} />
                  ))}
                </div>
                <IamPermissionMatrix
                  permissions={MOCK_IAM_PERMISSIONS.slice(0, 12)}
                />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Sessions, MFA & OAuth" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamSessions.map((s) => (
                    <IamSessionCard key={s.sessionId} session={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamMfa.map((d) => (
                    <IamMfaSetupCard key={d.deviceId} device={d} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamOAuth.map((c) => (
                    <IamOAuthClientCard key={c.clientId} client={c} />
                  ))}
                  {demoIamApiKeys.map((k) => (
                    <IamApiKeyCard key={k.keyId} apiKey={k} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Consent & Proxy Access" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamConsents.map((c) => (
                    <IamConsentCard key={c.consentId} consent={c} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Break-Glass, Incidents & Audit" />
                <IamBreakGlassPanel events={demoIamBreakGlass} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoIamIncidents.map((i) => (
                    <IamSecurityIncidentCard key={i.incidentId} incident={i} />
                  ))}
                  {demoIamRisk.map((r) => (
                    <IamRiskScoreCard key={r.userId} risk={r} />
                  ))}
                </div>
                <IamAuditTimeline events={demoIamAudit} />
                <IamSecurityAnalyticsPanel analytics={demoIamAnalytics} />
                <IamExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="documents" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Document & Content Management"
                  description="Centralized document platform — storage, versioning, OCR, e-signatures, records retention, legal hold, and secure sharing across all Med-ease modules."
                />
                <DocDashboardPanel dashboard={demoDocDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Documents, Templates & Versions" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoDocs.map((d) => (
                    <DocDocumentCard key={d.documentId} document={d} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoDocTemplates.map((t) => (
                    <DocTemplateCard key={t.templateId} template={t} />
                  ))}
                </div>
                <DocVersionTimeline versions={demoDocVersions} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="OCR, Signatures & Sharing" />
                <DocOcrPanel results={demoDocOcr} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoDocSigRequests.map((r) => (
                    <DocSignatureRequestCard key={r.requestId} request={r} />
                  ))}
                  {demoDocSignatures.map((s) => (
                    <DocSignatureCard key={s.signatureId} signature={s} />
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoDocShared.map((l) => (
                    <DocSharedLinkCard key={l.linkId} link={l} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Retention, Legal Hold & Archive" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {MOCK_RETENTION_POLICIES.slice(0, 4).map((p) => (
                    <div
                      key={p.policyId}
                      className="rounded-lg border p-4 text-sm"
                    >
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.retentionDays} days · {p.action}
                      </p>
                    </div>
                  ))}
                  {demoDocLegal.map((h) => (
                    <DocLegalHoldCard key={h.holdId} hold={h} />
                  ))}
                  {demoDocArchives.map((j) => (
                    <DocArchiveCard key={j.jobId} job={j} />
                  ))}
                </div>
                <DocActivityTimeline logs={demoDocDashboard.recentActivity} />
                <DocAnalyticsPanel analytics={demoDocAnalytics} />
                <DocExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="workflows" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Workflow Automation & BPM"
                  description="Cross-module process orchestration — visual designer, BPMN execution, approvals, SLAs, escalations, event bus, and background job coordination."
                />
                <WfDashboardPanel dashboard={demoOrchDashboard} />
              </section>

              <section className="space-y-4">
                <SectionHeader title="Designer, Definitions & Process Library" />
                <WfDesigner definitions={demoOrchDefinitions} />
                <WfBpmnCanvas
                  workflowName={
                    demoOrchDefinitions[0]?.name ?? 'Sample Workflow'
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoOrchDefinitions.map((w) => (
                    <WfWorkflowCard key={w.workflowId} workflow={w} />
                  ))}
                  {demoOrchTemplates.map((t) => (
                    <WfProcessTemplateCard key={t.templateId} template={t} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Instances, Tasks & Approvals" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoOrchInstances.map((i) => (
                    <WfProcessCard key={i.instanceId} instance={i} />
                  ))}
                </div>
                <WfTaskBoard tasks={demoOrchTasks} />
                <WfApprovalQueue approvals={demoOrchApprovals} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoOrchApprovals.slice(0, 3).map((a) => (
                    <WfApprovalCard key={a.approvalId} approval={a} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="Rules, Events, Jobs & Schedulers" />
                <WfRuleBuilder rules={demoOrchRules} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {MOCK_EVENT_QUEUES.map((q) => (
                    <div
                      key={q.queueId}
                      className="rounded-lg border p-4 text-sm"
                    >
                      <p className="font-medium">{q.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.pendingCount} pending ·{' '}
                        {q.processedCount.toLocaleString()} processed
                      </p>
                    </div>
                  ))}
                </div>
                <WfEventTimeline events={demoOrchEvents} />
                <WfJobQueue jobs={demoOrchJobs} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoOrchSchedules.map((s) => (
                    <WfSchedulerCard key={s.scheduleId} schedule={s} />
                  ))}
                  {demoOrchJobs.slice(0, 3).map((j) => (
                    <WfAutomationCard key={j.jobId} job={j} />
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeader title="SLA, Escalations & Monitoring" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoOrchSlas.map((s) => (
                    <WfSlaWidget key={s.slaId} sla={s} />
                  ))}
                </div>
                <WfEscalationPanel escalations={demoOrchEscalations} />
                <WfMonitor instances={demoOrchInstances} />
                <WfProcessHeatmap analytics={demoOrchAnalytics} />
                <WfAnalyticsPanel analytics={demoOrchAnalytics} />
                <WfExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="messaging" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Messaging & Notification Center"
                  description="Unified messaging — inbox, announcements, secure chat, broadcasts, multi-channel delivery, templates, and campaigns."
                />
                <MsgDashboardPanel dashboard={demoMsgDashboard} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Inbox, Chat & Secure Messaging" />
                <MsgInboxPanel items={demoMsgInbox} />
                <MsgChatPanel threads={demoMsgThreads} messages={demoMsgChat} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoMsgSecure.map((m) => (
                    <MsgSecureMessageCard key={m.secureMessageId} message={m} />
                  ))}
                  {demoMsgMessages.map((m) => (
                    <MsgMessageCard key={m.messageId} message={m} />
                  ))}
                </div>
              </section>
              <section className="space-y-4">
                <SectionHeader title="Announcements, Broadcasts & Channels" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoMsgAnnouncements.map((a) => (
                    <MsgAnnouncementCard
                      key={a.announcementId}
                      announcement={a}
                    />
                  ))}
                </div>
                <MsgBroadcastPanel broadcasts={demoMsgBroadcasts} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoMsgChannels.map((c) => (
                    <MsgChannelCard key={c.channelId} channel={c} />
                  ))}
                  {demoMsgIntegrations.map((i) => (
                    <MsgIntegrationCard key={i.integrationId} integration={i} />
                  ))}
                </div>
              </section>
              <section className="space-y-4">
                <SectionHeader title="Templates, Campaigns & Delivery" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoMsgTemplates.map((t) => (
                    <MsgTemplateCard key={t.templateId} template={t} />
                  ))}
                  {demoMsgCampaigns.map((c) => (
                    <MsgCampaignCard key={c.campaignId} campaign={c} />
                  ))}
                </div>
                <MsgDeliveryTimeline deliveries={demoMsgDeliveries} />
                <MsgAnalyticsPanel analytics={demoMsgAnalytics} />
                <MsgExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="api-platform" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="API Management & Developer Platform"
                  description="Developer portal, API keys, OAuth apps, webhooks, SDKs, rate limits, analytics, marketplace, and sandbox environments."
                />
                <ApiDeveloperPortal dashboard={demoApiDashboard} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Keys, OAuth & Webhooks" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoApiKeys.map((k) => (
                    <ApiKeyCard key={k.keyId} apiKey={k} />
                  ))}
                  {demoApiOAuth.map((a) => (
                    <ApiOAuthAppCard key={a.appId} app={a} />
                  ))}
                  {demoApiWebhooks.map((w) => (
                    <ApiWebhookCard key={w.webhookId} webhook={w} />
                  ))}
                </div>
              </section>
              <section className="space-y-4">
                <SectionHeader title="SDKs, Rate Limits & Sandbox" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoApiSdks.map((s) => (
                    <ApiSdkCard key={s.sdkId} sdk={s} />
                  ))}
                  {demoApiSandboxes.map((s) => (
                    <ApiSandboxCard key={s.sandboxId} sandbox={s} />
                  ))}
                </div>
                <ApiRateLimitPanel policies={demoApiRateLimits} />
                <ApiOpenApiViewer spec={demoApiOpenApi} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Marketplace & Analytics" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoApiPartners.map((p) => (
                    <ApiMarketplaceCard key={p.partnerId} partner={p} />
                  ))}
                </div>
                <ApiAnalyticsPanel analytics={demoApiAnalytics} />
                <ApiExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="reporting" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Enterprise Reporting & Report Designer"
                  description="JasperReports-style reporting — PDF, Excel, CSV exports, scheduled reports, drag-drop designer, and compliance reports."
                />
                <RptDashboardPanel dashboard={demoRptDashboard} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Report Library & Designer" />
                <RptCategoryBrowser
                  categories={[
                    'clinical',
                    'finance',
                    'audit',
                    'moh',
                    'insurance',
                    'hospital',
                    'patient',
                    'research',
                  ]}
                />
                <RptDesigner definitions={demoRptDefinitions} />
                <RptReportCard report={demoRptDefinitions[0]!} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoRptDefinitions.map((r) => (
                    <RptReportCard key={r.reportId} report={r} />
                  ))}
                  {demoRptTemplates.map((t) => (
                    <RptTemplateCard key={t.templateId} template={t} />
                  ))}
                </div>
              </section>
              <section className="space-y-4">
                <SectionHeader title="Schedules, Exports & Compliance" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoRptSchedules.map((s) => (
                    <RptScheduleCard key={s.scheduleId} schedule={s} />
                  ))}
                </div>
                <RptExportPanel exports={demoRptExports} />
                <RptCompliancePanel reports={demoRptCompliance} />
                <RptMonitor instances={demoRptInstances} />
                <RptAnalyticsPanel analytics={demoRptAnalytics} />
              </section>
            </TabsContent>

            <TabsContent value="platform-admin" className="space-y-12">
              <section className="space-y-4">
                <SectionHeader
                  title="Platform Administration & Multi-Tenant Management"
                  description="Epic/Oracle-style admin console — tenants, hospitals, facilities, localization, branding, licenses, jobs, health, backups, and audit."
                />
                <PlatDashboardPanel dashboard={demoPlatDashboard} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Tenants, Hospitals & Facilities" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPlatTenants.map((t) => (
                    <PlatTenantCard key={t.tenantId} tenant={t} />
                  ))}
                </div>
                <PlatHospitalPanel hospitals={demoPlatHospitals} />
                <PlatFacilityPanel facilities={demoPlatFacilities} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Localization, Branding & Licenses" />
                <PlatLocalizationPanel
                  localization={MOCK_LOCALIZATION[0]!}
                  readOnly
                />
                <PlatBrandingPanel branding={MOCK_BRANDING[0]!} readOnly />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {demoPlatLicenses.map((l) => (
                    <PlatLicenseCard key={l.licenseId} license={l} />
                  ))}
                </div>
                <PlatFeatureFlagPanel flags={demoPlatFlags} />
              </section>
              <section className="space-y-4">
                <SectionHeader title="Jobs, Health, Backups & Audit" />
                <PlatJobQueue jobs={demoPlatJobs} />
                <PlatHealthDashboard services={demoPlatHealth} />
                <PlatBackupPanel backups={demoPlatBackups} />
                <PlatMaintenancePanel maintenance={demoPlatMaintenance} />
                <PlatAuditTimeline audits={demoPlatAudits} />
                <PlatAnalyticsPanel analytics={demoPlatAnalytics} />
                <PlatExportToolbar onExport={() => undefined} />
              </section>
            </TabsContent>

            <TabsContent value="states" className="space-y-12">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Alerts
                </h2>
                <div className="grid gap-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Information</AlertTitle>
                    <AlertDescription>
                      Records updated successfully.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="success">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>
                      Prescription refill approved.
                    </AlertDescription>
                  </Alert>
                  <Alert variant="warning">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      Allergies not verified in 6 months.
                    </AlertDescription>
                  </Alert>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Empty & Error
                </h2>
                <EmptyState
                  icon={FileQuestion}
                  title="No active medications"
                  description="New prescriptions will appear here."
                  action={<Button>Add Medication</Button>}
                />
                <ErrorView onRetry={() => undefined} />
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight border-b pb-2">
                  Loading
                </h2>
                <LoadingView variant="spinner" label="Loading dashboard" />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
