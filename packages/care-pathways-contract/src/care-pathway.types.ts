export type CarePlanStatus =
  | 'draft'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'
  | 'archived'
  | 'suspended';

export type CarePlanType =
  | 'chronic_disease'
  | 'rehabilitation'
  | 'preventive'
  | 'post_operative'
  | 'home_care'
  | 'palliative'
  | 'goal_based'
  | 'collaborative'
  | 'shared';

export type CareStepStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'skipped';

export type CareTaskStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'overdue'
  | 'missed'
  | 'cancelled';

export interface ClinicalPathwayMilestone {
  id: string;
  title: string;
  completed: boolean;
}

/** Pathway definition. `id` is the stable code slug (e.g. diabetes). */
export interface ClinicalPathway {
  id: string;
  definitionId: string;
  name: string;
  description: string;
  milestones: ClinicalPathwayMilestone[];
  mandatoryTasks: string[];
  requiredAppointments: number;
  requiredLabs: number;
  medicationProtocols: string[];
  completionCriteria: string;
  active: boolean;
}

export interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  type: CarePlanType;
  status: CarePlanStatus;
  /** Pathway code slug when enrolled from a definition. */
  pathwayId?: string;
  pathwayDefinitionId?: string;
  admissionId?: string;
  primaryDiagnosis?: string;
  diagnosisCode?: string;
  startDate: string;
  endDate?: string;
  reviewDate: string;
  completionPercent: number;
  progressPercent: number;
  healthScore: number;
  riskLevel: string;
  assignedPhysician: string;
  assignedPhysicianId: string;
  facilityId?: string;
  facilityName?: string;
  isShared: boolean;
  isCollaborative: boolean;
  version: number;
  versionHistory: Array<{
    version: number;
    changedAt: string;
    changedBy: string;
    summary: string;
  }>;
  linkedMedicationIds: string[];
  linkedAppointmentIds: string[];
  linkedProviderIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarePlanStep {
  id: string;
  carePlanId: string;
  sortOrder: number;
  title: string;
  description?: string;
  status: CareStepStatus;
  completedAt?: string;
  notes?: string;
}

export interface CareTask {
  id: string;
  carePlanId: string;
  patientId: string;
  title: string;
  description?: string;
  type: string;
  priority: string;
  owner: string;
  ownerId?: string;
  dueDate: string;
  status: CareTaskStatus;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarePlanFilters {
  patientId?: string;
  status?: CarePlanStatus;
  type?: CarePlanType;
  /** Pathway code slug. */
  pathwayId?: string;
  admissionId?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export interface CarePlanListResult {
  items: CarePlan[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CarePlanBoardSummary {
  total: number;
  draft: number;
  active: number;
  onHold: number;
  completed: number;
  suspended: number;
  archived: number;
  averageProgress: number;
}

export interface CarePlanBoardResult {
  summary: CarePlanBoardSummary;
  plans: CarePlan[];
}

export interface CreateCarePlanInput {
  patientId: string;
  title: string;
  description?: string;
  type: CarePlanType;
  /** Pathway code slug (e.g. diabetes). */
  pathwayId?: string;
  admissionId?: string;
  primaryDiagnosis?: string;
  diagnosisCode?: string;
  assignedPhysician?: string;
  assignedPhysicianId?: string;
  facilityId?: string;
  facilityName?: string;
  /** Activate immediately (default true when pathway provided). */
  activate?: boolean;
  notes?: string;
}

export interface CompleteTaskInput {
  taskId: string;
  completionNotes?: string;
}

export interface AssignTaskInput {
  taskId: string;
  owner: string;
  ownerId?: string;
}

export interface CompleteStepInput {
  notes?: string;
}
