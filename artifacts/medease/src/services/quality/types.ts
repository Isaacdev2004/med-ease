export type IncidentType =
  | 'patient_safety'
  | 'near_miss'
  | 'medication_error'
  | 'fall'
  | 'sentinel'
  | 'never_event'
  | 'equipment'
  | 'security'
  | 'other';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus =
  'reported' | 'investigating' | 'escalated' | 'resolved' | 'closed';
export type RiskCategory =
  | 'clinical'
  | 'operational'
  | 'financial'
  | 'it'
  | 'cybersecurity'
  | 'regulatory';
export type RiskLevel = 'low' | 'medium' | 'high' | 'extreme';
export type RiskStatus =
  'identified' | 'assessed' | 'mitigating' | 'monitoring' | 'closed';
export type CapaType = 'corrective' | 'preventive';
export type CapaStatus =
  'open' | 'in_progress' | 'verification' | 'effectiveness_review' | 'closed';
export type AuditType = 'internal' | 'external' | 'regulatory' | 'inspection';
export type AuditStatus =
  'scheduled' | 'in_progress' | 'findings' | 'follow_up' | 'closed';
export type PolicyType = 'policy' | 'sop' | 'guideline' | 'protocol';
export type PolicyStatus =
  'draft' | 'review' | 'approved' | 'published' | 'archived' | 'expired';
export type InfectionType = 'clabsi' | 'cauti' | 'ssi' | 'vap' | 'other_hai';
export type AccreditationFramework =
  'jci' | 'nabh' | 'iso_9001' | 'iso_15189' | 'iso_27001' | 'cap' | 'moh';
export type ComplianceDomain =
  'hipaa' | 'gdpr' | 'hds' | 'fhir' | 'audit_log' | 'consent' | 'documentation';

export interface QualityFilters {
  q?: string;
  facilityId?: string;
  departmentId?: string;
  status?: string;
  severity?: string;
  category?: string;
  type?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IncidentReport {
  incidentId: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  facilityId: string;
  departmentId?: string;
  patientId?: string;
  reportedBy: string;
  reportedAt: string;
  anonymous: boolean;
  escalated: boolean;
  equipmentId?: string;
  carePlanId?: string;
  appointmentId?: string;
}

export interface Risk {
  riskId: string;
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: number;
  impact: number;
  riskScore: number;
  level: RiskLevel;
  status: RiskStatus;
  facilityId: string;
  departmentId?: string;
  ownerId: string;
  mitigationPlan?: string;
  reviewDate: string;
}

export interface CapaRecord {
  capaId: string;
  title: string;
  type: CapaType;
  status: CapaStatus;
  incidentId?: string;
  riskId?: string;
  facilityId: string;
  assignedTo: string;
  dueDate: string;
  rootCause?: string;
  actionPlan: string;
  verificationNotes?: string;
  effectivenessScore?: number;
}

export interface RootCauseAnalysis {
  rcaId: string;
  capaId: string;
  method: 'fishbone' | 'five_whys' | 'timeline';
  summary: string;
  categories?: string[];
  whys?: string[];
  createdAt: string;
}

export interface AuditRecord {
  auditId: string;
  title: string;
  type: AuditType;
  status: AuditStatus;
  facilityId: string;
  departmentId?: string;
  scheduledDate: string;
  completedDate?: string;
  auditorId: string;
  score?: number;
  findingsCount: number;
}

export interface AuditFinding {
  findingId: string;
  auditId: string;
  title: string;
  severity: IncidentSeverity;
  recommendation: string;
  status: 'open' | 'in_progress' | 'closed';
  evidenceAttached: boolean;
}

export interface PolicyDocument {
  policyId: string;
  title: string;
  type: PolicyType;
  version: string;
  status: PolicyStatus;
  facilityId?: string;
  departmentId?: string;
  ownerId: string;
  effectiveDate: string;
  reviewDate: string;
  expiryDate?: string;
  approvedBy?: string;
  contentSummary: string;
}

export interface AccreditationStandard {
  standardId: string;
  framework: AccreditationFramework;
  code: string;
  title: string;
  description: string;
  complianceScore: number;
  evidenceCount: number;
  gapCount: number;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_assessed';
}

export interface ComplianceRecord {
  complianceId: string;
  domain: ComplianceDomain;
  title: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  score: number;
  facilityId: string;
  lastReviewed: string;
  findings: number;
}

export interface InfectionRecord {
  infectionId: string;
  type: InfectionType;
  facilityId: string;
  departmentId?: string;
  patientId?: string;
  detectedDate: string;
  isolated: boolean;
  outbreakId?: string;
  organism?: string;
}

export interface QualityIndicator {
  indicatorId: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  facilityId: string;
  period: string;
}

export interface QualityDashboard {
  facilityId?: string;
  openIncidents: number;
  escalatedIncidents: number;
  openRisks: number;
  highRisks: number;
  openCapa: number;
  capaCompletionRate: number;
  auditScore: number;
  openFindings: number;
  infectionRate: number;
  accreditationReadiness: number;
  compliancePercent: number;
  policyCompliance: number;
  recentIncidents: IncidentReport[];
  recentCapa: CapaRecord[];
  riskHeatMap: {
    label: string;
    likelihood: number;
    impact: number;
    count: number;
  }[];
}

export interface QualityAnalytics {
  incidents: number;
  risks: number;
  capaCompletion: number;
  auditScores: number;
  infectionRate: number;
  accreditationReadiness: number;
  compliancePercent: number;
  policyCompliance: number;
  openFindings: number;
  incidentTrend: { label: string; value: number }[];
  riskByCategory: { label: string; value: number }[];
  capaTrend: { label: string; value: number }[];
  departmentRisk: { label: string; value: number }[];
  indicatorSummary: { label: string; value: number }[];
}

export interface QualityPermissions {
  canView: boolean;
  canWrite: boolean;
  canManageIncidents: boolean;
  canManageRisks: boolean;
  canManageCapa: boolean;
  canManageAudits: boolean;
  canManageDocuments: boolean;
  canManageAccreditation: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface QualityFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'incident' | 'risk' | 'capa' | 'policy' | 'audit';
  entityId: string;
  createdAt: string;
}

export interface CreateIncidentInput {
  title: string;
  description: string;
  type: IncidentType;
  severity: IncidentSeverity;
  facilityId: string;
  departmentId?: string;
  patientId?: string;
  reportedBy: string;
  anonymous?: boolean;
  equipmentId?: string;
}

export interface CreateRiskInput {
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: number;
  impact: number;
  facilityId: string;
  departmentId?: string;
  ownerId: string;
  mitigationPlan?: string;
}

export interface CreateCapaInput {
  title: string;
  type: CapaType;
  facilityId: string;
  assignedTo: string;
  dueDate: string;
  actionPlan: string;
  incidentId?: string;
  riskId?: string;
  rootCause?: string;
}

export interface ScheduleAuditInput {
  title: string;
  type: AuditType;
  facilityId: string;
  departmentId?: string;
  scheduledDate: string;
  auditorId: string;
}

export interface PublishPolicyInput {
  title: string;
  type: PolicyType;
  facilityId?: string;
  departmentId?: string;
  ownerId: string;
  contentSummary: string;
  effectiveDate: string;
  reviewDate: string;
}
