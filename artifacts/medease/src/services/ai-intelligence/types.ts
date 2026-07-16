export type PredictionType =
  | 'deterioration'
  | 'sepsis'
  | 'readmission'
  | 'length_of_stay'
  | 'mortality'
  | 'fall_risk'
  | 'medication_adherence'
  | 'no_show';

export type ForecastType =
  | 'resource'
  | 'bed_occupancy'
  | 'operating_room'
  | 'financial';

export type ModelStatus = 'draft' | 'staging' | 'production' | 'archived';
export type RecommendationStatus = 'pending' | 'accepted' | 'rejected' | 'overridden';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type CopilotRole = 'user' | 'assistant' | 'system';

export interface AiIntelligenceFilters {
  q?: string;
  facilityId?: string;
  patientId?: string;
  providerId?: string;
  predictionType?: PredictionType;
  forecastType?: ForecastType;
  modelId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AiPrediction {
  predictionId: string;
  patientId: string;
  facilityId: string;
  type: PredictionType;
  score: number;
  confidence: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  generatedAt: string;
  modelVersion: string;
  providerId?: string;
  encounterId?: string;
}

export interface RiskAssessment {
  assessmentId: string;
  patientId: string;
  facilityId: string;
  category: string;
  score: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  assessedAt: string;
  factors: string[];
  modelVersion: string;
}

export interface ClinicalRecommendation {
  recommendationId: string;
  patientId: string;
  facilityId: string;
  category: string;
  title: string;
  rationale: string;
  status: RecommendationStatus;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  modelVersion: string;
  rating?: number;
}

export interface CopilotMessage {
  messageId: string;
  role: CopilotRole;
  content: string;
  timestamp: string;
}

export interface CopilotSession {
  sessionId: string;
  patientId?: string;
  facilityId: string;
  providerId: string;
  title: string;
  startedAt: string;
  lastMessageAt: string;
  messages: CopilotMessage[];
}

export interface ClinicalSummary {
  summaryId: string;
  patientId: string;
  facilityId: string;
  sourceType: 'note' | 'encounter' | 'discharge';
  sourceId: string;
  summary: string;
  keyFindings: string[];
  generatedAt: string;
  modelVersion: string;
}

export interface OperationalForecast {
  forecastId: string;
  facilityId: string;
  type: ForecastType;
  metric: string;
  horizonDays: number;
  predictedValue: number;
  confidenceInterval: { lower: number; upper: number };
  generatedAt: string;
  trend: { label: string; value: number }[];
}

export interface AiAlert {
  alertId: string;
  facilityId: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  createdAt: string;
  acknowledged: boolean;
  modelId?: string;
}

export interface ModelVersion {
  modelId: string;
  name: string;
  version: string;
  type: PredictionType | ForecastType | 'nlp' | 'copilot' | 'recommendation';
  status: ModelStatus;
  accuracy: number;
  deployedAt?: string;
  createdAt: string;
  facilityId?: string;
}

export interface ModelEvaluation {
  evaluationId: string;
  modelId: string;
  metric: string;
  value: number;
  threshold: number;
  passed: boolean;
  evaluatedAt: string;
}

export interface ExplainabilityReport {
  reportId: string;
  predictionId: string;
  patientId: string;
  facilityId: string;
  topFeatures: { feature: string; contribution: number }[];
  narrative: string;
  generatedAt: string;
}

export interface BiasMetric {
  metricId: string;
  modelId: string;
  demographic: string;
  disparityIndex: number;
  sampleSize: number;
  status: 'within_threshold' | 'monitoring' | 'action_required';
  measuredAt: string;
}

export interface AiAuditLog {
  auditId: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  facilityId?: string;
  outcome: 'success' | 'failure';
}

export interface AiIntelligenceDashboard {
  activePredictions: number;
  highRiskPatients: number;
  pendingRecommendations: number;
  activeCopilotSessions: number;
  modelAccuracy: number;
  alertsOpen: number;
  predictionTrend: { label: string; value: number }[];
  riskDistribution: { label: string; value: number }[];
  recentAlerts: AiAlert[];
}

export interface AiAnalytics {
  predictionVolume: number;
  recommendationAcceptanceRate: number;
  copilotUsageHours: number;
  modelDriftScore: number;
  biasAlerts: number;
  forecastAccuracy: number;
  predictionTrend: { label: string; value: number }[];
  modelPerformance: { label: string; value: number }[];
  recommendationTrend: { label: string; value: number }[];
  usageByModule: { label: string; value: number }[];
}

export interface AiPermissions {
  canView: boolean;
  canWrite: boolean;
  canPredictions: boolean;
  canCopilot: boolean;
  canModels: boolean;
  canAnalytics: boolean;
  canGovernance: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface AiFavorite {
  userId: string;
  entityType: 'prediction' | 'recommendation' | 'model' | 'summary' | 'forecast';
  entityId: string;
  createdAt: string;
}

export interface GeneratePredictionInput {
  patientId: string;
  facilityId: string;
  type: PredictionType;
  providerId?: string;
}

export interface CreateClinicalSummaryInput {
  patientId: string;
  facilityId: string;
  sourceType: ClinicalSummary['sourceType'];
  sourceId: string;
}

export interface StartCopilotSessionInput {
  facilityId: string;
  providerId: string;
  patientId?: string;
  initialPrompt?: string;
}

export interface RateRecommendationInput {
  recommendationId: string;
  rating: number;
  feedback?: string;
}

export interface ApproveModelDeploymentInput {
  modelId: string;
  approvedBy: string;
}

export interface ArchiveModelInput {
  modelId: string;
}

export interface ShareAiInput {
  entityType: AiFavorite['entityType'];
  entityId: string;
  recipientIds: string[];
}
