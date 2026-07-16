export type ReportStatus = 'draft' | 'published' | 'archived';
export type InstanceStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
export type ScheduleStatus = 'active' | 'paused' | 'disabled';
export type ExportFormat = 'pdf' | 'xlsx' | 'csv';
export type ExportStatus = 'queued' | 'processing' | 'completed' | 'failed';
export type ReportCategory =
  | 'clinical'
  | 'finance'
  | 'audit'
  | 'moh'
  | 'insurance'
  | 'hospital'
  | 'patient'
  | 'research';

export interface ReportFilters {
  q?: string;
  tenantId?: string;
  facilityId?: string;
  category?: ReportCategory;
  status?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReportDefinition {
  reportId: string;
  name: string;
  description: string;
  category: ReportCategory;
  version: number;
  status: ReportStatus;
  fieldCount: number;
  chartCount: number;
  publishedAt?: string;
  updatedAt: string;
}

export interface ReportInstance {
  instanceId: string;
  reportId: string;
  reportName: string;
  category: ReportCategory;
  status: InstanceStatus;
  generatedBy: string;
  generatedAt: string;
  completedAt?: string;
  facilityId?: string;
  rowCount?: number;
}

export interface ReportTemplate {
  templateId: string;
  name: string;
  category: ReportCategory;
  subcategory: string;
  usageCount: number;
}

export interface ReportSchedule {
  scheduleId: string;
  reportId: string;
  name: string;
  cron: string;
  format: ExportFormat;
  recipients: string[];
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt: string;
}

export interface ReportExport {
  exportId: string;
  reportId: string;
  reportName: string;
  format: ExportFormat;
  status: ExportStatus;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  recordCount?: number;
  fileSizeKb?: number;
}

export interface ReportDesigner {
  designerId: string;
  reportId: string;
  canvasElements: number;
  dataSourceCount: number;
  lastEditedBy: string;
  lastEditedAt: string;
}

export interface ReportField {
  fieldId: string;
  reportId: string;
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  source: string;
}

export interface ReportChart {
  chartId: string;
  reportId: string;
  type: 'bar' | 'line' | 'pie' | 'table';
  title: string;
}

export interface ReportDataSource {
  sourceId: string;
  reportId: string;
  name: string;
  module: string;
  query: string;
}

export interface ComplianceReport {
  complianceId: string;
  name: string;
  category: ReportCategory;
  regulatoryBody: string;
  dueDate: string;
  status: 'compliant' | 'pending' | 'overdue';
  lastSubmittedAt?: string;
}

export interface ReportAudit {
  auditId: string;
  reportId: string;
  action: string;
  actorId: string;
  outcome: 'success' | 'failure';
  timestamp: string;
}

export interface ReportDashboard {
  totalDefinitions: number;
  activeInstances: number;
  pendingExports: number;
  scheduledReports: number;
  complianceDue: number;
  exportsToday: number;
  categoryBreakdown: { label: string; value: number }[];
  generationTrend: { label: string; value: number }[];
  recentExports: ReportExport[];
}

export interface ReportAnalytics {
  generationSuccessRate: number;
  avgGenerationTimeMinutes: number;
  scheduleComplianceRate: number;
  exportVolumeDaily: number;
  templateReuseRate: number;
  complianceOnTimeRate: number;
  generationTrend: { label: string; value: number }[];
  categoryThroughput: { label: string; value: number }[];
  formatBreakdown: { label: string; value: number }[];
}

export interface ReportPermissions {
  canView: boolean;
  canWrite: boolean;
  canDesign: boolean;
  canSchedule: boolean;
  canExport: boolean;
  canAnalytics: boolean;
  canAdmin: boolean;
}

export interface ReportFavorite {
  userId: string;
  entityType: 'report' | 'instance' | 'template';
  entityId: string;
  createdAt: string;
}

export interface CreateReportInput {
  name: string;
  description: string;
  category: ReportCategory;
  tenantId: string;
  facilityId?: string;
}

export interface PublishReportInput {
  reportId: string;
  publishedBy: string;
}

export interface RunReportInput {
  reportId: string;
  generatedBy: string;
  facilityId?: string;
}

export interface ScheduleReportInput {
  reportId: string;
  name: string;
  cron: string;
  format: ExportFormat;
  recipients: string[];
}

export interface ExportReportInput {
  reportId: string;
  format: ExportFormat;
  requestedBy: string;
}

export interface ShareReportInput {
  reportId: string;
  sharedWith: string[];
  message?: string;
}

export interface UpdateDesignerInput {
  reportId: string;
  editedBy: string;
  canvasElements?: number;
  dataSourceCount?: number;
}
