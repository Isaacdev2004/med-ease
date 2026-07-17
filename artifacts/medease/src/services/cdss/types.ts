export type AlertSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type AlertStatus =
  'active' | 'acknowledged' | 'overridden' | 'resolved' | 'expired';
export type AlertType =
  | 'abnormal_lab'
  | 'allergy'
  | 'interaction'
  | 'contraindication'
  | 'duplicate_therapy'
  | 'dosing'
  | 'preventive'
  | 'care_gap'
  | 'guideline'
  | 'diagnostic';
export type GuidelineSource =
  'nice' | 'who' | 'cdc' | 'aha' | 'esc' | 'ada' | 'kdigo' | 'idsa' | 'local';
export type GuidelineStatus = 'draft' | 'published' | 'archived' | 'superseded';
export type RecommendationStatus =
  'pending' | 'accepted' | 'declined' | 'deferred';
export type OrderSetCategory =
  | 'sepsis'
  | 'stroke'
  | 'stemi'
  | 'nstemi'
  | 'pneumonia'
  | 'diabetes'
  | 'copd'
  | 'asthma'
  | 'heart_failure'
  | 'surgery'
  | 'icu'
  | 'emergency';
export type CalculatorType =
  | 'chads_vasc'
  | 'has_bled'
  | 'wells'
  | 'curb65'
  | 'news2'
  | 'mews'
  | 'ascvd'
  | 'framingham'
  | 'bmi'
  | 'bsa'
  | 'creatinine_clearance'
  | 'egfr';
export type DrugSafetyType =
  | 'interaction'
  | 'allergy'
  | 'contraindication'
  | 'duplicate_therapy'
  | 'black_box'
  | 'pregnancy'
  | 'breastfeeding';
export type PreventiveCategory =
  'vaccine' | 'screening' | 'wellness' | 'chronic_review' | 'follow_up';

export interface CdssFilters {
  q?: string;
  facilityId?: string;
  patientId?: string;
  providerId?: string;
  severity?: AlertSeverity;
  status?: string;
  alertType?: AlertType;
  guidelineSource?: GuidelineSource;
  orderSetCategory?: OrderSetCategory;
  calculatorType?: CalculatorType;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClinicalAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  providerId?: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  triggeredAt: string;
  ruleId?: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface ClinicalRecommendation {
  recommendationId: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  title: string;
  rationale: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  guidelineId?: string;
  status: RecommendationStatus;
  createdAt: string;
  priority: AlertSeverity;
}

export interface GuidelineVersion {
  versionId: string;
  version: string;
  publishedAt: string;
  summary: string;
  changeNotes?: string;
}

export interface Guideline {
  guidelineId: string;
  title: string;
  source: GuidelineSource;
  condition: string;
  status: GuidelineStatus;
  facilityId?: string;
  currentVersion: string;
  versions: GuidelineVersion[];
  complianceRate: number;
  lastReviewed: string;
}

export interface DiagnosticSuggestion {
  suggestionId: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  presentingComplaint: string;
  suggestedDiagnosis: string;
  probability: number;
  suggestedLabs: string[];
  suggestedImaging: string[];
  createdAt: string;
}

export interface DifferentialDiagnosis {
  differentialId: string;
  patientId: string;
  diagnoses: { name: string; probability: number; icd10?: string }[];
  suggestedInvestigations: string[];
  createdAt: string;
}

export interface OrderSetItem {
  itemId: string;
  type: 'medication' | 'lab' | 'imaging' | 'nursing' | 'consult';
  label: string;
  optional?: boolean;
}

export interface OrderSet {
  orderSetId: string;
  name: string;
  category: OrderSetCategory;
  facilityId?: string;
  evidenceSource: GuidelineSource;
  itemCount: number;
  items: OrderSetItem[];
  usageCount: number;
  lastUpdated: string;
}

export interface ClinicalProtocol {
  protocolId: string;
  name: string;
  condition: string;
  facilityId: string;
  status: 'draft' | 'active' | 'retired';
  steps: string[];
  complianceRate: number;
  version: string;
}

export interface PreventiveReminder {
  reminderId: string;
  patientId: string;
  patientName: string;
  facilityId: string;
  category: PreventiveCategory;
  title: string;
  dueDate: string;
  status: 'due' | 'overdue' | 'completed' | 'scheduled';
  guidelineRef?: string;
}

export interface DrugInteractionAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  drugA: string;
  drugB: string;
  severity: AlertSeverity;
  mechanism: string;
  recommendation: string;
}

export interface AllergyAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  allergen: string;
  medication: string;
  severity: AlertSeverity;
  reaction: string;
}

export interface DuplicateTherapyAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  medications: string[];
  therapeuticClass: string;
  recommendation: string;
}

export interface ContraindicationAlert {
  alertId: string;
  patientId: string;
  patientName: string;
  medication: string;
  condition: string;
  severity: AlertSeverity;
  recommendation: string;
}

export interface VaccineRecommendation {
  recommendationId: string;
  patientId: string;
  patientName: string;
  vaccine: string;
  dueDate: string;
  rationale: string;
}

export interface ScreeningRecommendation {
  recommendationId: string;
  patientId: string;
  patientName: string;
  screening: string;
  interval: string;
  dueDate: string;
  guidelineSource: GuidelineSource;
}

export interface RiskCalculator {
  calculatorId: string;
  name: string;
  type: CalculatorType;
  description: string;
  inputs: {
    key: string;
    label: string;
    type: 'number' | 'boolean' | 'select';
    options?: string[];
  }[];
  interpretationBands: { label: string; min: number; max: number }[];
}

export interface CalculatorResult {
  resultId: string;
  calculatorId: string;
  calculatorType: CalculatorType;
  patientId?: string;
  score: number;
  interpretation: string;
  inputs: Record<string, number | boolean | string>;
  calculatedAt: string;
}

export interface EvidenceArticle {
  articleId: string;
  title: string;
  source: string;
  pubDate: string;
  evidenceLevel: 'A' | 'B' | 'C' | 'D';
  summary: string;
  pmid?: string;
  guidelineIds: string[];
}

export interface ClinicalRule {
  ruleId: string;
  name: string;
  category: AlertType;
  facilityId?: string;
  enabled: boolean;
  priority: AlertSeverity;
  triggerCount: number;
  lastTriggered?: string;
  description: string;
}

export interface CDSIntervention {
  interventionId: string;
  ruleId: string;
  patientId: string;
  type: AlertType;
  outcome: 'accepted' | 'overridden' | 'ignored';
  providerId: string;
  timestamp: string;
}

export interface ClinicalPathway {
  pathwayId: string;
  name: string;
  condition: string;
  facilityId?: string;
  stageCount: number;
  adherenceRate: number;
  avgDurationDays: number;
}

export interface DecisionTreeNode {
  nodeId: string;
  question?: string;
  yesBranch?: string;
  noBranch?: string;
  recommendation?: string;
}

export interface DecisionTree {
  treeId: string;
  name: string;
  condition: string;
  rootNodeId: string;
  nodes: DecisionTreeNode[];
}

export interface AlertOverride {
  overrideId: string;
  alertId: string;
  providerId: string;
  reason: string;
  overriddenAt: string;
}

export interface AlertAudit {
  auditId: string;
  alertId: string;
  action: 'triggered' | 'acknowledged' | 'overridden' | 'resolved';
  providerId?: string;
  timestamp: string;
  notes?: string;
}

export interface ProviderResponse {
  responseId: string;
  recommendationId: string;
  providerId: string;
  response: RecommendationStatus;
  notes?: string;
  respondedAt: string;
}

export interface CdssAnalytics {
  alertVolume: number;
  acceptanceRate: number;
  overrideRate: number;
  guidelineCompliance: number;
  orderSetUsage: number;
  alertTrend: { label: string; value: number }[];
  alertsByType: { label: string; value: number }[];
  recommendationsByStatus: { label: string; value: number }[];
  topGuidelines: { label: string; value: number }[];
}

export interface CdssDashboard {
  facilityId?: string;
  activeAlerts: number;
  criticalAlerts: number;
  pendingRecommendations: number;
  guidelineCompliance: number;
  orderSetsApplied: number;
  preventiveDue: number;
  recentAlerts: ClinicalAlert[];
  recentRecommendations: ClinicalRecommendation[];
  topOrderSets: OrderSet[];
}

export interface CdssTimelineEvent {
  eventId: string;
  timestamp: string;
  type: 'alert' | 'recommendation' | 'override' | 'guideline' | 'order_set';
  title: string;
  patientId?: string;
  providerId?: string;
}

export interface CdssPermissions {
  canView: boolean;
  canWrite: boolean;
  canManageAlerts: boolean;
  canManageGuidelines: boolean;
  canManageProtocols: boolean;
  canManageOrderSets: boolean;
  canViewAnalytics: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface CdssFavorite {
  favoriteId: string;
  userId: string;
  entityType: 'guideline' | 'order_set' | 'calculator' | 'pathway' | 'rule';
  entityId: string;
  createdAt: string;
}

export interface AcknowledgeAlertInput {
  alertId: string;
  providerId: string;
  notes?: string;
}

export interface OverrideAlertInput {
  alertId: string;
  providerId: string;
  reason: string;
}

export interface ApplyRecommendationInput {
  recommendationId: string;
  providerId: string;
  notes?: string;
}

export interface CreateGuidelineInput {
  title: string;
  source: GuidelineSource;
  condition: string;
  facilityId?: string;
  summary: string;
}

export interface UpdateRuleInput {
  ruleId: string;
  enabled?: boolean;
  priority?: AlertSeverity;
  description?: string;
}

export interface PublishProtocolInput {
  protocolId: string;
  publishedBy: string;
}

export interface CalculateRiskInput {
  calculatorType: CalculatorType;
  inputs: Record<string, number | boolean | string>;
  patientId?: string;
}
