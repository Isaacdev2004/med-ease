export type CaseStatus =
  'suspected' | 'confirmed' | 'probable' | 'ruled_out' | 'closed';
export type OutbreakStatus =
  'monitoring' | 'investigation' | 'containment' | 'resolved';
export type ContactStatus =
  'identified' | 'notified' | 'monitoring' | 'quarantined' | 'cleared';
export type ImmunizationStatus =
  'scheduled' | 'administered' | 'overdue' | 'declined';
export type ProgramStatus = 'planning' | 'active' | 'completed' | 'paused';
export type InspectionStatus =
  'scheduled' | 'passed' | 'failed' | 'follow_up_required';
export type SdohDomain =
  | 'housing'
  | 'food'
  | 'transportation'
  | 'employment'
  | 'education'
  | 'social_support'
  | 'safety';

export interface PublicHealthFilters {
  q?: string;
  facilityId?: string;
  patientId?: string;
  providerId?: string;
  disease?: string;
  status?: string;
  outbreakId?: string;
  programId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CommunityMember {
  memberId: string;
  patientId: string;
  facilityId: string;
  name: string;
  age: number;
  zipCode: string;
  riskLevel: 'low' | 'moderate' | 'high';
  enrolledPrograms: string[];
}

export interface DiseaseCase {
  caseId: string;
  patientId: string;
  facilityId: string;
  disease: string;
  icd10Code: string;
  status: CaseStatus;
  reportedAt: string;
  investigatedAt?: string;
  outbreakId?: string;
  labResultId?: string;
  providerId?: string;
}

export interface OutbreakInvestigation {
  outbreakId: string;
  name: string;
  disease: string;
  facilityId: string;
  status: OutbreakStatus;
  caseCount: number;
  startedAt: string;
  resolvedAt?: string;
  leadInvestigatorId: string;
}

export interface ContactTracingRecord {
  contactId: string;
  caseId: string;
  patientId: string;
  facilityId: string;
  contactName: string;
  exposureDate: string;
  status: ContactStatus;
  lastContactAt?: string;
  providerId?: string;
}

export interface ImmunizationRecord {
  immunizationId: string;
  patientId: string;
  facilityId: string;
  vaccine: string;
  cvxCode: string;
  doseNumber: number;
  status: ImmunizationStatus;
  administeredAt?: string;
  dueDate?: string;
  medicationId?: string;
  appointmentId?: string;
}

export interface ImmunizationRegistry {
  registryId: string;
  name: string;
  facilityId: string;
  jurisdiction: string;
  memberCount: number;
  coverageRate: number;
}

export interface CommunityProgram {
  programId: string;
  name: string;
  facilityId: string;
  category: string;
  status: ProgramStatus;
  enrolledCount: number;
  targetPopulation: number;
  startDate: string;
  carePlanId?: string;
}

export interface MaternalRecord {
  recordId: string;
  patientId: string;
  facilityId: string;
  gestationalWeeks: number;
  riskLevel: 'low' | 'moderate' | 'high';
  lastVisitAt: string;
  nextVisitAt?: string;
  providerId?: string;
}

export interface ChildHealthRecord {
  recordId: string;
  patientId: string;
  facilityId: string;
  ageMonths: number;
  wellnessStatus: 'on_track' | 'at_risk' | 'referral_needed';
  lastVisitAt: string;
  immunizationUpToDate: boolean;
}

export interface SchoolHealthScreening {
  screeningId: string;
  schoolName: string;
  facilityId: string;
  studentCount: number;
  screenedCount: number;
  referralCount: number;
  screeningDate: string;
}

export interface OccupationalAssessment {
  assessmentId: string;
  employeeId: string;
  patientId: string;
  facilityId: string;
  employer: string;
  assessmentType: string;
  result: 'cleared' | 'restricted' | 'referral';
  assessedAt: string;
}

export interface EnvironmentalInspection {
  inspectionId: string;
  facilityId: string;
  siteName: string;
  inspectionType: string;
  status: InspectionStatus;
  inspectedAt: string;
  score: number;
}

export interface SdohAssessment {
  assessmentId: string;
  patientId: string;
  facilityId: string;
  domain: SdohDomain;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high';
  assessedAt: string;
  interventionNeeded: boolean;
}

export interface PublicHealthAuditLog {
  auditId: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  facilityId?: string;
  outcome: 'success' | 'failure';
}

export interface PublicHealthDashboard {
  activeCases: number;
  activeOutbreaks: number;
  immunizationsDue: number;
  contactsMonitoring: number;
  communityProgramsActive: number;
  sdohHighRisk: number;
  caseTrend: { label: string; value: number }[];
  topDiseases: { label: string; value: number }[];
  recentOutbreaks: OutbreakInvestigation[];
}

export interface PublicHealthAnalytics {
  incidenceRate: number;
  immunizationCoverage: number;
  outbreakResponseTime: number;
  contactTracingCompletion: number;
  sdohInterventionRate: number;
  activePrograms: number;
  caseTrend: { label: string; value: number }[];
  diseaseDistribution: { label: string; value: number }[];
  immunizationTrend: { label: string; value: number }[];
  regionalHeatmap: { label: string; value: number }[];
}

export interface PublicHealthPermissions {
  canView: boolean;
  canWrite: boolean;
  canSurveillance: boolean;
  canOutbreaks: boolean;
  canImmunizations: boolean;
  canCommunity: boolean;
  canSdoh: boolean;
  canAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface PublicHealthFavorite {
  userId: string;
  entityType: 'case' | 'outbreak' | 'program' | 'immunization';
  entityId: string;
  createdAt: string;
}

export interface RegisterCaseInput {
  patientId: string;
  facilityId: string;
  disease: string;
  icd10Code: string;
  outbreakId?: string;
}

export interface CreateOutbreakInput {
  name: string;
  disease: string;
  facilityId: string;
  leadInvestigatorId: string;
}

export interface RecordImmunizationInput {
  patientId: string;
  facilityId: string;
  vaccine: string;
  cvxCode: string;
  doseNumber: number;
  appointmentId?: string;
}

export interface LaunchCampaignInput {
  programId: string;
  facilityId: string;
  name: string;
}

export interface AssignContactTracingInput {
  caseId: string;
  patientId: string;
  facilityId: string;
  contactName: string;
  exposureDate: string;
}

export interface CompleteInvestigationInput {
  outbreakId: string;
}

export interface RecordSdohInput {
  patientId: string;
  facilityId: string;
  domain: SdohDomain;
  score: number;
}

export interface ScheduleOutreachInput {
  programId: string;
  facilityId: string;
  scheduledAt: string;
}

export interface SharePublicHealthInput {
  entityType: PublicHealthFavorite['entityType'];
  entityId: string;
  recipientIds: string[];
}
