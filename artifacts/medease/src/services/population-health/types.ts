export type RiskTier = 'high' | 'rising' | 'moderate' | 'low';
export type CareGapType =
  | 'annual_checkup'
  | 'vaccination'
  | 'colonoscopy'
  | 'mammogram'
  | 'pap_smear'
  | 'eye_exam'
  | 'hba1c'
  | 'lipid_profile'
  | 'medication_review'
  | 'follow_up';
export type CareGapStatus = 'open' | 'in_progress' | 'closed' | 'overdue';
export type RegistryType =
  | 'diabetes'
  | 'hypertension'
  | 'chf'
  | 'copd'
  | 'oncology'
  | 'pregnancy'
  | 'pediatrics'
  | 'mental_health'
  | 'high_risk';
export type RiskScoreType =
  'charlson' | 'hcc' | 'lace' | 'readmission' | 'mortality';
export type OutreachChannel = 'sms' | 'email' | 'push' | 'whatsapp' | 'phone';
export type CampaignStatus =
  'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
export type ChronicProgramType =
  'diabetes' | 'hypertension' | 'heart_failure' | 'ckd' | 'asthma' | 'copd';

export interface PhmFilters {
  q?: string;
  facilityId?: string;
  registryType?: RegistryType;
  riskTier?: RiskTier;
  gapType?: CareGapType;
  status?: string;
  regionId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PopulationMember {
  memberId: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  facilityId: string;
  primaryCondition?: string;
  riskTier: RiskTier;
  openGaps: number;
  lastVisit?: string;
  registryIds: string[];
  regionId?: string;
}

export interface DiseaseRegistry {
  registryId: string;
  name: string;
  type: RegistryType;
  facilityId?: string;
  memberCount: number;
  openGaps: number;
  avgRiskScore: number;
  complianceRate: number;
}

export interface CareGap {
  gapId: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  type: CareGapType;
  title: string;
  status: CareGapStatus;
  dueDate: string;
  daysOverdue: number;
  priority: 'low' | 'medium' | 'high';
  registryType?: RegistryType;
}

export interface RiskScore {
  scoreId: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  scoreType: RiskScoreType;
  score: number;
  tier: RiskTier;
  calculatedAt: string;
  factors: string[];
}

export interface PatientCohort {
  cohortId: string;
  name: string;
  description: string;
  facilityId?: string;
  memberCount: number;
  criteria: string;
  createdAt: string;
  dynamic: boolean;
}

export interface ChronicProgram {
  programId: string;
  name: string;
  type: ChronicProgramType;
  facilityId: string;
  enrolledCount: number;
  activeCount: number;
  completionRate: number;
  avgOutcomeScore: number;
}

export interface PreventiveCareItem {
  preventiveId: string;
  title: string;
  category: 'vaccination' | 'screening' | 'wellness' | 'lifestyle';
  facilityId: string;
  eligibleCount: number;
  completedCount: number;
  complianceRate: number;
}

export interface OutreachCampaign {
  campaignId: string;
  name: string;
  channel: OutreachChannel;
  status: CampaignStatus;
  facilityId?: string;
  targetCount: number;
  sentCount: number;
  responseRate: number;
  scheduledDate: string;
  cohortId?: string;
}

export interface CommunityProgram {
  programId: string;
  name: string;
  facilityId: string;
  regionId: string;
  eventDate: string;
  attendees: number;
  sdohFocus?: string;
  healthEquityScore: number;
}

export interface GeographicRegion {
  regionId: string;
  name: string;
  zipCode: string;
  patientCount: number;
  prevalenceRate: number;
  gapRate: number;
  readmissionRate: number;
}

export interface PhmDashboard {
  facilityId?: string;
  totalPopulation: number;
  openCareGaps: number;
  highRiskCount: number;
  risingRiskCount: number;
  registryEnrollment: number;
  preventiveCompliance: number;
  readmissionRate: number;
  outreachActive: number;
  recentGaps: CareGap[];
  riskDistribution: { tier: RiskTier; count: number }[];
  topRegistries: DiseaseRegistry[];
}

export interface PopulationAnalytics {
  careGaps: number;
  diseasePrevalence: number;
  admissions: number;
  readmissions: number;
  mortalityRate: number;
  utilizationRate: number;
  preventiveCompliance: number;
  gapTrend: { label: string; value: number }[];
  prevalenceByCondition: { label: string; value: number }[];
  riskDistribution: { label: string; value: number }[];
  geographicTrend: { label: string; value: number }[];
  providerPerformance: { label: string; value: number }[];
}

export interface PhmPermissions {
  canView: boolean;
  canWrite: boolean;
  canManageRegistries: boolean;
  canManageGaps: boolean;
  canManageRisk: boolean;
  canManageCohorts: boolean;
  canManageOutreach: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface PhmFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'registry' | 'cohort' | 'campaign' | 'gap';
  entityId: string;
  createdAt: string;
}

export interface CreateCohortInput {
  name: string;
  description: string;
  criteria: string;
  facilityId?: string;
  dynamic?: boolean;
}

export interface LaunchCampaignInput {
  name: string;
  channel: OutreachChannel;
  facilityId?: string;
  targetCount: number;
  scheduledDate: string;
  cohortId?: string;
}

export interface CloseCareGapInput {
  gapId: string;
  closedBy: string;
  notes?: string;
}
