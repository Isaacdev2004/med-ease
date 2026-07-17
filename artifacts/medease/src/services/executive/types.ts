export type KpiCategory =
  | 'clinical'
  | 'operational'
  | 'financial'
  | 'quality'
  | 'workforce'
  | 'population'
  | 'strategic';
export type KpiTrend = 'up' | 'down' | 'stable';
export type AlertSeverity = 'info' | 'warning' | 'critical';
export type InitiativeStatus =
  'planning' | 'active' | 'on_track' | 'at_risk' | 'completed';
export type DashboardStatus = 'active' | 'archived' | 'draft';
export type ForecastHorizon = '30d' | '90d' | '180d' | '365d';

export interface ExecutiveFilters {
  q?: string;
  facilityId?: string;
  departmentId?: string;
  category?: KpiCategory;
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

export interface EnterpriseKpi {
  kpiId: string;
  name: string;
  category: KpiCategory;
  facilityId?: string;
  departmentId?: string;
  value: number;
  target: number;
  unit: string;
  trend: KpiTrend;
  changePercent: number;
  measuredAt: string;
}

export interface ExecutiveDashboardConfig {
  dashboardId: string;
  name: string;
  facilityId?: string;
  ownerId: string;
  status: DashboardStatus;
  widgetCount: number;
  lastViewedAt: string;
  createdAt: string;
}

export interface OperationalMetric {
  metricId: string;
  name: string;
  facilityId: string;
  departmentId?: string;
  value: number;
  unit: string;
  benchmark: number;
  measuredAt: string;
}

export interface DepartmentScorecard {
  scorecardId: string;
  departmentId: string;
  departmentName: string;
  facilityId: string;
  overallScore: number;
  clinicalScore: number;
  operationalScore: number;
  financialScore: number;
  qualityScore: number;
  period: string;
}

export interface BenchmarkReport {
  reportId: string;
  metric: string;
  facilityId: string;
  internalValue: number;
  peerAverage: number;
  nationalBenchmark: number;
  percentile: number;
  generatedAt: string;
}

export interface ExecutiveForecast {
  forecastId: string;
  metric: string;
  facilityId: string;
  horizon: ForecastHorizon;
  predictedValue: number;
  confidenceInterval: { lower: number; upper: number };
  trend: { label: string; value: number }[];
  generatedAt: string;
}

export interface StrategicInitiative {
  initiativeId: string;
  name: string;
  facilityId?: string;
  ownerId: string;
  status: InitiativeStatus;
  progress: number;
  targetDate: string;
  budget: number;
  spent: number;
  description: string;
}

export interface EnterpriseAlert {
  alertId: string;
  facilityId: string;
  category: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  sourceModule: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface CapacitySnapshot {
  snapshotId: string;
  facilityId: string;
  unit: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyRate: number;
  capturedAt: string;
}

export interface PerformanceReport {
  reportId: string;
  name: string;
  facilityId: string;
  category: string;
  score: number;
  period: string;
  generatedAt: string;
}

export interface HospitalOperations {
  facilityId: string;
  edWaitMinutes: number;
  orUtilization: number;
  bedOccupancy: number;
  dischargeRate: number;
  admissionRate: number;
  throughputIndex: number;
  activeAlerts: number;
}

export interface PatientFlowMetrics {
  facilityId: string;
  arrivalsToday: number;
  dischargesToday: number;
  transfersToday: number;
  avgLengthOfStay: number;
  readmissionRate: number;
  flowTrend: { label: string; value: number }[];
}

export interface RevenueDashboard {
  facilityId: string;
  revenueMtd: number;
  revenueYtd: number;
  collectionRate: number;
  denialRate: number;
  netMargin: number;
  revenueTrend: { label: string; value: number }[];
}

export interface QualityDashboard {
  facilityId: string;
  overallScore: number;
  patientSatisfaction: number;
  infectionRate: number;
  mortalityIndex: number;
  complianceRate: number;
  qualityTrend: { label: string; value: number }[];
}

export interface WorkforceDashboard {
  facilityId: string;
  totalStaff: number;
  vacancyRate: number;
  overtimeHours: number;
  turnoverRate: number;
  satisfactionScore: number;
  staffingTrend: { label: string; value: number }[];
}

export interface PopulationDashboard {
  facilityId: string;
  attributedLives: number;
  riskScore: number;
  gapClosureRate: number;
  preventiveCareRate: number;
  chronicDiseaseRate: number;
  populationTrend: { label: string; value: number }[];
}

export interface ExecutiveCommandCenter {
  totalKpis: number;
  activeAlerts: number;
  bedOccupancy: number;
  revenueMtd: number;
  qualityScore: number;
  initiativesOnTrack: number;
  kpiTrend: { label: string; value: number }[];
  alertDistribution: { label: string; value: number }[];
  recentAlerts: EnterpriseAlert[];
  topKpis: EnterpriseKpi[];
}

export interface ExecutiveAnalytics {
  kpiAchievementRate: number;
  operationalEfficiency: number;
  financialPerformance: number;
  qualityIndex: number;
  workforceUtilization: number;
  populationHealthIndex: number;
  benchmarkPercentile: number;
  kpiTrend: { label: string; value: number }[];
  moduleContributions: { label: string; value: number }[];
  forecastAccuracy: number;
  initiativeProgress: { label: string; value: number }[];
}

export interface ExecutivePermissions {
  canView: boolean;
  canWrite: boolean;
  canKpis: boolean;
  canOperations: boolean;
  canCapacity: boolean;
  canAnalytics: boolean;
  canBenchmarking: boolean;
  canForecasting: boolean;
  canExport: boolean;
  canShare: boolean;
  canAdmin: boolean;
}

export interface ExecutiveFavorite {
  userId: string;
  entityType: 'dashboard' | 'kpi' | 'initiative' | 'report';
  entityId: string;
  createdAt: string;
}

export interface CreateStrategicInitiativeInput {
  name: string;
  facilityId?: string;
  ownerId: string;
  targetDate: string;
  budget: number;
  description: string;
}

export interface UpdateKpiTargetInput {
  kpiId: string;
  target: number;
}

export interface AcknowledgeAlertInput {
  alertId: string;
}

export interface ArchiveDashboardInput {
  dashboardId: string;
}

export interface ShareExecutiveInput {
  entityType: ExecutiveFavorite['entityType'];
  entityId: string;
  recipientIds: string[];
}

export interface ExecutiveAuditLog {
  auditId: string;
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
  facilityId?: string;
  outcome: 'success' | 'failure';
}
