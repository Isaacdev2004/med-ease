export type TrialPhase = 'I' | 'II' | 'III' | 'IV' | 'observational';
export type TrialStatus =
  | 'planning'
  | 'recruiting'
  | 'active'
  | 'completed'
  | 'suspended'
  | 'terminated';
export type ParticipantStatus =
  | 'screening'
  | 'enrolled'
  | 'active'
  | 'completed'
  | 'withdrawn'
  | 'screen_failed';
export type VisitStatus =
  'scheduled' | 'completed' | 'missed' | 'cancelled' | 'in_progress';
export type ConsentStatus = 'pending' | 'signed' | 'withdrawn' | 'expired';
export type DeviationStatus = 'open' | 'under_review' | 'closed';
export type AdverseEventSeverity =
  'mild' | 'moderate' | 'severe' | 'life_threatening' | 'fatal';
export type AdverseEventStatus =
  'reported' | 'under_review' | 'submitted' | 'closed';
export type BiospecimenStatus =
  'collected' | 'processed' | 'stored' | 'shipped' | 'analyzed' | 'disposed';
export type PublicationStatus =
  'draft' | 'submitted' | 'under_review' | 'accepted' | 'published';
export type InnovationStatus =
  'ideation' | 'pilot' | 'scaling' | 'deployed' | 'archived';
export type GrantStatus =
  'draft' | 'submitted' | 'under_review' | 'awarded' | 'rejected';
export type RegulatoryStatus =
  'draft' | 'submitted' | 'approved' | 'rejected' | 'amended';

export interface ResearchFilters {
  q?: string;
  facilityId?: string;
  trialId?: string;
  patientId?: string;
  providerId?: string;
  siteId?: string;
  phase?: TrialPhase;
  status?: string;
  severity?: AdverseEventSeverity;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClinicalTrial {
  trialId: string;
  nctId?: string;
  title: string;
  phase: TrialPhase;
  status: TrialStatus;
  facilityId: string;
  principalInvestigatorId: string;
  sponsor: string;
  therapeuticArea: string;
  targetEnrollment: number;
  currentEnrollment: number;
  startDate: string;
  endDate?: string;
  carePlanId?: string;
  fhirResearchStudyId?: string;
}

export interface ResearchParticipant {
  participantId: string;
  trialId: string;
  patientId: string;
  facilityId: string;
  status: ParticipantStatus;
  enrolledAt?: string;
  randomizationArm?: string;
  consentStatus: ConsentStatus;
  providerId?: string;
  appointmentId?: string;
}

export interface StudyVisit {
  visitId: string;
  trialId: string;
  participantId: string;
  facilityId: string;
  visitNumber: number;
  visitName: string;
  scheduledAt: string;
  completedAt?: string;
  status: VisitStatus;
  appointmentId?: string;
  providerId?: string;
}

export interface Investigator {
  investigatorId: string;
  name: string;
  specialty: string;
  facilityId: string;
  providerId: string;
  activeTrials: number;
  email: string;
}

export interface Coordinator {
  coordinatorId: string;
  name: string;
  facilityId: string;
  activeTrials: number;
  email: string;
}

export interface StudySite {
  siteId: string;
  name: string;
  facilityId: string;
  trialIds: string[];
  coordinatorId: string;
  enrollmentTarget: number;
  currentEnrollment: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface ConsentRecord {
  consentId: string;
  participantId: string;
  trialId: string;
  facilityId: string;
  version: string;
  status: ConsentStatus;
  signedAt?: string;
  method: 'paper' | 'econsent' | 'verbal';
}

export interface ProtocolDeviation {
  deviationId: string;
  trialId: string;
  participantId?: string;
  facilityId: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  status: DeviationStatus;
  reportedAt: string;
  closedAt?: string;
}

export interface AdverseEvent {
  eventId: string;
  trialId: string;
  participantId: string;
  facilityId: string;
  description: string;
  severity: AdverseEventSeverity;
  serious: boolean;
  status: AdverseEventStatus;
  reportedAt: string;
  medicationId?: string;
  labResultId?: string;
}

export interface Biospecimen {
  specimenId: string;
  trialId: string;
  participantId: string;
  facilityId: string;
  type: string;
  status: BiospecimenStatus;
  collectedAt: string;
  storageLocation: string;
  labResultId?: string;
}

export interface Publication {
  publicationId: string;
  trialId?: string;
  title: string;
  journal?: string;
  authors: string[];
  status: PublicationStatus;
  submittedAt?: string;
  publishedAt?: string;
  doi?: string;
}

export interface InnovationProject {
  projectId: string;
  name: string;
  facilityId: string;
  category: string;
  status: InnovationStatus;
  leadInvestigatorId: string;
  budget: number;
  startDate: string;
}

export interface GrantApplication {
  grantId: string;
  title: string;
  facilityId: string;
  trialId?: string;
  funder: string;
  amount: number;
  status: GrantStatus;
  submittedAt?: string;
}

export interface RegulatorySubmission {
  submissionId: string;
  trialId: string;
  facilityId: string;
  type: 'IRB' | 'FDA' | 'EMA' | 'DSMB' | 'IND' | 'IDE';
  status: RegulatoryStatus;
  submittedAt: string;
  approvedAt?: string;
}

export interface ResearchAuditLog {
  auditId: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  facilityId?: string;
  outcome: 'success' | 'failure';
}

export interface ResearchDashboard {
  activeTrials: number;
  totalParticipants: number;
  enrolledThisMonth: number;
  openDeviations: number;
  pendingConsents: number;
  seriousAdverseEvents: number;
  biospecimensStored: number;
  publicationsThisYear: number;
  topTrials: ClinicalTrial[];
  enrollmentTrend: { label: string; value: number }[];
}

export interface ResearchAnalytics {
  enrollmentRate: number;
  protocolCompliance: number;
  consentCompletionRate: number;
  saeRate: number;
  activeTrials: number;
  totalPublications: number;
  enrollmentTrend: { label: string; value: number }[];
  phaseDistribution: { label: string; value: number }[];
  topTrials: { label: string; value: number }[];
  adverseEventTrend: { label: string; value: number }[];
}

export interface ResearchPermissions {
  canView: boolean;
  canWrite: boolean;
  canTrials: boolean;
  canParticipants: boolean;
  canConsent: boolean;
  canProtocol: boolean;
  canSafety: boolean;
  canPublications: boolean;
  canAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface ResearchFavorite {
  userId: string;
  entityType: 'trial' | 'participant' | 'publication' | 'innovation' | 'grant';
  entityId: string;
  createdAt: string;
}

export interface CreateTrialInput {
  title: string;
  phase: TrialPhase;
  facilityId: string;
  principalInvestigatorId: string;
  sponsor: string;
  therapeuticArea: string;
  targetEnrollment: number;
}

export interface EnrollParticipantInput {
  trialId: string;
  patientId: string;
  facilityId: string;
  providerId?: string;
}

export interface RecordConsentInput {
  participantId: string;
  trialId: string;
  facilityId: string;
  version: string;
  method: ConsentRecord['method'];
}

export interface ScheduleVisitInput {
  trialId: string;
  participantId: string;
  facilityId: string;
  visitName: string;
  scheduledAt: string;
  appointmentId?: string;
}

export interface RecordAdverseEventInput {
  trialId: string;
  participantId: string;
  facilityId: string;
  description: string;
  severity: AdverseEventSeverity;
  serious: boolean;
}

export interface CloseDeviationInput {
  deviationId: string;
}

export interface SubmitPublicationInput {
  title: string;
  trialId?: string;
  authors: string[];
  journal?: string;
}

export interface RegisterBiospecimenInput {
  trialId: string;
  participantId: string;
  facilityId: string;
  type: string;
  storageLocation: string;
}

export interface CreateInnovationInput {
  name: string;
  facilityId: string;
  category: string;
  leadInvestigatorId: string;
  budget: number;
}

export interface ShareResearchInput {
  entityType: ResearchFavorite['entityType'];
  entityId: string;
  recipientIds: string[];
}
