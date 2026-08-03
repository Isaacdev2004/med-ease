import type { QueryParams } from '@workspace/repository-transport';
import type {
  CarePlan,
  CarePlanFilters,
  CareTask,
  ClinicalPathway,
  PathwayId,
  TaskStatus,
  TaskType,
  TaskPriority,
  CarePlanStatus,
  CarePlanType,
  RiskSeverity,
} from '@/services/care-plans/types';

export type CarePlanListResult = {
  items: CarePlan[];
  total: number;
  page: number;
  pageSize: number;
};

export type CarePlanStep = {
  id: string;
  carePlanId: string;
  sortOrder: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: string;
  notes?: string;
};

export function carePlanFiltersToQuery(
  filters?: CarePlanFilters,
): QueryParams | undefined {
  if (!filters) return undefined;
  return {
    patientId: filters.patientId,
    status: filters.status,
    type: filters.type,
    pathwayId: filters.pathwayId,
    q: filters.q,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object'
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === 'string')
    : [];
}

function asBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function mapPathway(dto: unknown): ClinicalPathway {
  const row = asRecord(dto);
  const milestonesRaw = Array.isArray(row.milestones) ? row.milestones : [];
  return {
    id: asString(row.id) as PathwayId,
    name: asString(row.name),
    description: asString(row.description),
    milestones: milestonesRaw.map((m) => {
      const milestone = asRecord(m);
      return {
        id: asString(milestone.id),
        title: asString(milestone.title),
        completed: asBoolean(milestone.completed),
      };
    }),
    mandatoryTasks: asStringArray(row.mandatoryTasks),
    requiredAppointments: asNumber(row.requiredAppointments),
    requiredLabs: asNumber(row.requiredLabs),
    medicationProtocols: asStringArray(row.medicationProtocols),
    completionCriteria: asString(row.completionCriteria),
  };
}

export function mapPathwayArray(dto: unknown): ClinicalPathway[] {
  return Array.isArray(dto) ? dto.map(mapPathway) : [];
}

export function mapCarePlan(dto: unknown): CarePlan {
  const row = asRecord(dto);
  const pathwayId = asOptionalString(row.pathwayId);
  return {
    id: asString(row.id),
    patientId: asString(row.patientId),
    patientName: asString(row.patientName),
    title: asString(row.title),
    description: asString(row.description),
    type: asString(row.type, 'chronic_disease') as CarePlanType,
    status: asString(row.status, 'draft') as CarePlanStatus,
    pathwayId: pathwayId as PathwayId | undefined,
    primaryDiagnosis: asOptionalString(row.primaryDiagnosis),
    diagnosisCode: asOptionalString(row.diagnosisCode),
    startDate: asString(row.startDate),
    endDate: asOptionalString(row.endDate),
    reviewDate: asString(row.reviewDate),
    completionPercent: asNumber(row.completionPercent),
    progressPercent: asNumber(row.progressPercent),
    healthScore: asNumber(row.healthScore, 70),
    riskLevel: asString(row.riskLevel, 'moderate') as RiskSeverity,
    assignedPhysician: asString(row.assignedPhysician),
    assignedPhysicianId: asString(row.assignedPhysicianId),
    facilityId: asOptionalString(row.facilityId),
    facilityName: asOptionalString(row.facilityName),
    isShared: asBoolean(row.isShared),
    isCollaborative: asBoolean(row.isCollaborative),
    version: asNumber(row.version, 1),
    versionHistory: [],
    linkedMedicationIds: asStringArray(row.linkedMedicationIds),
    linkedAppointmentIds: asStringArray(row.linkedAppointmentIds),
    linkedProviderIds: asStringArray(row.linkedProviderIds),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapCarePlanArray(dto: unknown): CarePlan[] {
  return Array.isArray(dto) ? dto.map(mapCarePlan) : [];
}

export function mapPaginatedCarePlans(dto: unknown): CarePlanListResult {
  const row = asRecord(dto);
  return {
    items: mapCarePlanArray(row.items),
    total: asNumber(row.total),
    page: asNumber(row.page, 1),
    pageSize: asNumber(row.pageSize, 25),
  };
}

export function mapTask(dto: unknown): CareTask {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    carePlanId: asString(row.carePlanId),
    patientId: asString(row.patientId),
    title: asString(row.title),
    description: asOptionalString(row.description),
    type: asString(row.type, 'custom') as TaskType,
    priority: asString(row.priority, 'medium') as TaskPriority,
    owner: asString(row.owner),
    ownerId: asOptionalString(row.ownerId),
    dueDate: asString(row.dueDate),
    status: asString(row.status, 'pending') as TaskStatus,
    completionNotes: asOptionalString(row.completionNotes),
    createdAt: asString(row.createdAt),
    updatedAt: asString(row.updatedAt),
  };
}

export function mapTaskArray(dto: unknown): CareTask[] {
  return Array.isArray(dto) ? dto.map(mapTask) : [];
}

export function mapStep(dto: unknown): CarePlanStep {
  const row = asRecord(dto);
  return {
    id: asString(row.id),
    carePlanId: asString(row.carePlanId),
    sortOrder: asNumber(row.sortOrder),
    title: asString(row.title),
    description: asOptionalString(row.description),
    status: asString(row.status, 'pending') as CarePlanStep['status'],
    completedAt: asOptionalString(row.completedAt),
    notes: asOptionalString(row.notes),
  };
}

export function mapStepArray(dto: unknown): CarePlanStep[] {
  return Array.isArray(dto) ? dto.map(mapStep) : [];
}
