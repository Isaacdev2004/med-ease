import type { Prisma } from '@medease/prisma';
import type {
  CarePlan,
  CarePlanStatus,
  CarePlanStep,
  CarePlanType,
  CareStepStatus,
  CareTask,
  CareTaskStatus,
  ClinicalPathway,
} from '@medease/care-pathways-contract';

type PathwayWithSteps = Prisma.CarePathwayDefinitionGetPayload<{
  include: { steps: true };
}>;

export function mapCarePlanStatus(status: string): CarePlanStatus {
  switch (status) {
    case 'draft':
    case 'active':
    case 'on_hold':
    case 'completed':
    case 'cancelled':
    case 'archived':
    case 'suspended':
      return status;
    default:
      return 'draft';
  }
}

export function mapCarePlanType(type: string): CarePlanType {
  switch (type) {
    case 'chronic_disease':
    case 'rehabilitation':
    case 'preventive':
    case 'post_operative':
    case 'home_care':
    case 'palliative':
    case 'goal_based':
    case 'collaborative':
    case 'shared':
      return type;
    default:
      return 'chronic_disease';
  }
}

export function mapStepStatus(status: string): CareStepStatus {
  switch (status) {
    case 'pending':
    case 'in_progress':
    case 'completed':
    case 'skipped':
      return status;
    default:
      return 'pending';
  }
}

export function mapTaskStatus(status: string): CareTaskStatus {
  switch (status) {
    case 'pending':
    case 'in_progress':
    case 'completed':
    case 'overdue':
    case 'missed':
    case 'cancelled':
      return status;
    default:
      return 'pending';
  }
}

function dateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function mapPathway(row: PathwayWithSteps): ClinicalPathway {
  const milestones = [...row.steps]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((step) => ({
      id: step.id,
      title: step.title,
      completed: false,
    }));

  return {
    id: row.code,
    definitionId: row.id,
    name: row.name,
    description: row.description,
    milestones,
    mandatoryTasks: row.mandatoryTasks,
    requiredAppointments: row.requiredAppointments,
    requiredLabs: row.requiredLabs,
    medicationProtocols: row.medicationProtocols,
    completionCriteria: row.completionCriteria,
    active: row.active,
  };
}

export function mapCarePlan(row: Prisma.CarePlanGetPayload<object>): CarePlan {
  return {
    id: row.id,
    patientId: row.patientId,
    patientName: row.patientName,
    title: row.title,
    description: row.description,
    type: mapCarePlanType(row.type),
    status: mapCarePlanStatus(row.status),
    pathwayId: row.pathwayCode ?? undefined,
    pathwayDefinitionId: row.pathwayId ?? undefined,
    admissionId: row.admissionId ?? undefined,
    primaryDiagnosis: row.primaryDiagnosis ?? undefined,
    diagnosisCode: row.diagnosisCode ?? undefined,
    startDate: dateOnly(row.startDate),
    endDate: row.endDate ? dateOnly(row.endDate) : undefined,
    reviewDate: dateOnly(row.reviewDate),
    completionPercent: row.completionPercent,
    progressPercent: row.progressPercent,
    healthScore: row.healthScore,
    riskLevel: row.riskLevel,
    assignedPhysician: row.assignedPhysician,
    assignedPhysicianId: row.assignedPhysicianId,
    facilityId: row.facilityId ?? undefined,
    facilityName: row.facilityName ?? undefined,
    isShared: row.type === 'shared',
    isCollaborative: row.type === 'collaborative',
    version: row.version,
    versionHistory: [],
    linkedMedicationIds: [],
    linkedAppointmentIds: [],
    linkedProviderIds: [],
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function mapStep(
  row: Prisma.CarePlanStepGetPayload<object>,
): CarePlanStep {
  return {
    id: row.id,
    carePlanId: row.carePlanId,
    sortOrder: row.sortOrder,
    title: row.title,
    description: row.description ?? undefined,
    status: mapStepStatus(row.status),
    completedAt: row.completedAt?.toISOString(),
    notes: row.notes ?? undefined,
  };
}

export function mapTask(
  row: Prisma.CarePlanTaskGetPayload<object>,
): CareTask {
  return {
    id: row.id,
    carePlanId: row.carePlanId,
    patientId: row.patientId,
    title: row.title,
    description: row.description ?? undefined,
    type: row.type,
    priority: row.priority,
    owner: row.owner,
    dueDate: row.dueDate.toISOString(),
    status: mapTaskStatus(row.status),
    completionNotes: row.completionNotes ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
