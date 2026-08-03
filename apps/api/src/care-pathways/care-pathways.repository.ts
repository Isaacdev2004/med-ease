import { Injectable } from '@nestjs/common';

import type {
  AssignTaskInput,
  CarePlan,
  CarePlanBoardResult,
  CarePlanBoardSummary,
  CarePlanFilters,
  CarePlanListResult,
  CarePlanStep,
  CarePathwaysRepositoryContract,
  CareTask,
  ClinicalPathway,
  CompleteStepInput,
  CompleteTaskInput,
  CreateCarePlanInput,
} from '@medease/care-pathways-contract';
import {
  normalizePagination,
  PrismaService,
  TenantAwareRepository,
  toPaginatedResult,
} from '@medease/prisma';
import { ValidationError } from '@workspace/repository-transport/errors';
import { newId } from '@medease/uuid';

import { RequestContextService } from '../tenant/request-context.service';
import {
  assertCarePlanFound,
  assertPathwayFound,
  assertStepFound,
  assertTaskFound,
  computeProgress,
  mapCarePathwaysRepositoryError,
  toContractPaginated,
} from './care-pathways.helpers';
import {
  mapCarePlan,
  mapPathway,
  mapStep,
  mapTask,
} from './mappers/care-pathway.mapper';
import { buildCarePlanListWhere } from './queries/care-pathway.queries';

function emptyBoardSummary(): CarePlanBoardSummary {
  return {
    total: 0,
    draft: 0,
    active: 0,
    onHold: 0,
    completed: 0,
    suspended: 0,
    archived: 0,
    averageProgress: 0,
  };
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

@Injectable()
export class CarePathwaysRepository
  extends TenantAwareRepository
  implements CarePathwaysRepositoryContract
{
  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService,
  ) {
    super();
  }

  listPathways(): Promise<ClinicalPathway[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const rows = await tx.carePathwayDefinition.findMany({
        where: { tenantId: this.tenantId, active: true },
        include: { steps: true },
        orderBy: [{ name: 'asc' }],
      });
      return rows.map(mapPathway);
    });
  }

  async getPathway(code: string): Promise<ClinicalPathway> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.carePathwayDefinition.findFirst({
        where: { tenantId: this.tenantId, code },
        include: { steps: true },
      });
      assertPathwayFound(row, code);
      return mapPathway(row);
    });
  }

  search(filters: CarePlanFilters = {}): Promise<CarePlanListResult> {
    const { page, pageSize, skip, take } = normalizePagination(filters);
    const where = buildCarePlanListWhere(this.tenantId, filters);

    return this.prisma.runInTransaction(async (tx) => {
      const [items, total] = await Promise.all([
        tx.carePlan.findMany({
          where,
          skip,
          take,
          orderBy: [{ updatedAt: 'desc' }],
        }),
        tx.carePlan.count({ where }),
      ]);

      return toContractPaginated(
        toPaginatedResult(items.map(mapCarePlan), total, page, pageSize),
      );
    });
  }

  getAll(filters: CarePlanFilters = {}): Promise<CarePlan[]> {
    const where = buildCarePlanListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const items = await tx.carePlan.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }],
      });
      return items.map(mapCarePlan);
    });
  }

  async getById(id: string): Promise<CarePlan> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.carePlan.findFirst({
        where: { id, tenantId: this.tenantId },
      });
      assertCarePlanFound(row, id);
      return mapCarePlan(row);
    });
  }

  getActiveForPatient(patientId: string): Promise<CarePlan | null> {
    return this.prisma.runInTransaction(async (tx) => {
      const row = await tx.carePlan.findFirst({
        where: {
          tenantId: this.tenantId,
          patientId,
          status: 'active',
        },
        orderBy: [{ updatedAt: 'desc' }],
      });
      return row ? mapCarePlan(row) : null;
    });
  }

  getBoard(filters: CarePlanFilters = {}): Promise<CarePlanBoardResult> {
    const where = buildCarePlanListWhere(this.tenantId, filters);
    return this.prisma.runInTransaction(async (tx) => {
      const plans = await tx.carePlan.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }],
        take: 100,
      });

      const summary = emptyBoardSummary();
      summary.total = plans.length;
      let progressSum = 0;
      for (const plan of plans) {
        progressSum += plan.progressPercent;
        switch (plan.status) {
          case 'draft':
            summary.draft += 1;
            break;
          case 'active':
            summary.active += 1;
            break;
          case 'on_hold':
            summary.onHold += 1;
            break;
          case 'completed':
            summary.completed += 1;
            break;
          case 'suspended':
            summary.suspended += 1;
            break;
          case 'archived':
            summary.archived += 1;
            break;
          default:
            break;
        }
      }
      summary.averageProgress =
        plans.length > 0 ? Math.round(progressSum / plans.length) : 0;

      return { summary, plans: plans.map(mapCarePlan) };
    });
  }

  getSteps(carePlanId: string): Promise<CarePlanStep[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const plan = await tx.carePlan.findFirst({
        where: { id: carePlanId, tenantId: this.tenantId },
        select: { id: true },
      });
      assertCarePlanFound(plan, carePlanId);

      const steps = await tx.carePlanStep.findMany({
        where: { tenantId: this.tenantId, carePlanId },
        orderBy: [{ sortOrder: 'asc' }],
      });
      return steps.map(mapStep);
    });
  }

  getTasks(carePlanId?: string, patientId?: string): Promise<CareTask[]> {
    return this.prisma.runInTransaction(async (tx) => {
      const tasks = await tx.carePlanTask.findMany({
        where: {
          tenantId: this.tenantId,
          ...(carePlanId ? { carePlanId } : {}),
          ...(patientId ? { patientId } : {}),
        },
        orderBy: [{ dueDate: 'asc' }],
      });
      return tasks.map(mapTask);
    });
  }

  async enroll(input: CreateCarePlanInput): Promise<CarePlan> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const patient = await tx.patient.findFirst({
          where: {
            id: input.patientId,
            tenantId: this.tenantId,
            deletedAt: null,
          },
        });
        if (!patient) {
          throw new ValidationError('Patient not found for care plan', {
            details: { patientId: input.patientId },
          });
        }

        const pathway = input.pathwayId
          ? await tx.carePathwayDefinition.findFirst({
              where: {
                tenantId: this.tenantId,
                code: input.pathwayId,
                active: true,
              },
              include: { steps: { orderBy: { sortOrder: 'asc' } } },
            })
          : null;

        if (input.pathwayId && !pathway) {
          throw new ValidationError('Care pathway not found', {
            details: { pathwayId: input.pathwayId },
          });
        }

        if (input.admissionId) {
          const admission = await tx.admission.findFirst({
            where: {
              id: input.admissionId,
              tenantId: this.tenantId,
              patientId: patient.id,
            },
          });
          if (!admission) {
            throw new ValidationError(
              'Admission not found for patient enrollment',
              { details: { admissionId: input.admissionId } },
            );
          }
        }

        const now = new Date();
        const activate = input.activate ?? Boolean(input.pathwayId);
        const actorId = this.actorId();
        const planId = newId();

        const physicianId =
          input.assignedPhysicianId ?? actorId;
        const physicianName =
          input.assignedPhysician ?? 'Care team';

        const row = await tx.carePlan.create({
          data: {
            id: planId,
            tenantId: this.tenantId,
            patientId: patient.id,
            patientName: patient.fullName,
            pathwayId: pathway?.id,
            pathwayCode: pathway?.code ?? input.pathwayId,
            admissionId: input.admissionId,
            title: input.title,
            description: input.description ?? pathway?.description ?? '',
            type: input.type,
            status: activate ? 'active' : 'draft',
            primaryDiagnosis: input.primaryDiagnosis,
            diagnosisCode: input.diagnosisCode,
            startDate: now,
            reviewDate: addDays(now, 30),
            assignedPhysician: physicianName,
            assignedPhysicianId: physicianId,
            facilityId: input.facilityId,
            facilityName: input.facilityName,
            notes: input.notes,
            createdBy: actorId,
          },
        });

        const stepDefs = pathway?.steps ?? [];
        if (stepDefs.length > 0) {
          await tx.carePlanStep.createMany({
            data: stepDefs.map((step, index) => ({
              id: newId(),
              tenantId: this.tenantId,
              carePlanId: planId,
              sortOrder: step.sortOrder ?? index,
              title: step.title,
              description: step.description,
              status: index === 0 ? 'in_progress' : 'pending',
            })),
          });
        }

        const mandatory = pathway?.mandatoryTasks ?? [];
        if (mandatory.length > 0) {
          await tx.carePlanTask.createMany({
            data: mandatory.map((title, index) => ({
              id: newId(),
              tenantId: this.tenantId,
              carePlanId: planId,
              patientId: patient.id,
              title,
              type: 'custom',
              priority: index === 0 ? 'high' : 'medium',
              owner: physicianName,
              dueDate: addDays(now, 7 + index * 7),
              status: 'pending',
            })),
          });
        }

        return mapCarePlan(row);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  async activate(id: string): Promise<CarePlan> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.carePlan.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertCarePlanFound(existing, id);

        if (existing.status === 'archived' || existing.status === 'completed') {
          throw new ValidationError('Care plan cannot be activated', {
            details: { id, status: existing.status },
          });
        }

        const row = await tx.carePlan.update({
          where: { id },
          data: {
            status: 'active',
            updatedBy: this.actorId(),
          },
        });
        return mapCarePlan(row);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  async suspend(id: string, notes?: string): Promise<CarePlan> {
    return this.setStatus(id, 'suspended', notes);
  }

  async archive(id: string, notes?: string): Promise<CarePlan> {
    return this.setStatus(id, 'archived', notes);
  }

  async complete(id: string, notes?: string): Promise<CarePlan> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.carePlan.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertCarePlanFound(existing, id);

        const row = await tx.carePlan.update({
          where: { id },
          data: {
            status: 'completed',
            completionPercent: 100,
            progressPercent: 100,
            endDate: new Date(),
            notes: notes ?? existing.notes,
            updatedBy: this.actorId(),
          },
        });
        return mapCarePlan(row);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  async completeStep(
    carePlanId: string,
    stepId: string,
    input: CompleteStepInput = {},
  ): Promise<CarePlanStep> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const plan = await tx.carePlan.findFirst({
          where: { id: carePlanId, tenantId: this.tenantId },
        });
        assertCarePlanFound(plan, carePlanId);

        const step = await tx.carePlanStep.findFirst({
          where: {
            id: stepId,
            carePlanId,
            tenantId: this.tenantId,
          },
        });
        assertStepFound(step, stepId);

        const updated = await tx.carePlanStep.update({
          where: { id: stepId },
          data: {
            status: 'completed',
            completedAt: new Date(),
            notes: input.notes ?? step.notes,
          },
        });

        // Advance next pending step
        const next = await tx.carePlanStep.findFirst({
          where: {
            tenantId: this.tenantId,
            carePlanId,
            status: 'pending',
          },
          orderBy: [{ sortOrder: 'asc' }],
        });
        if (next) {
          await tx.carePlanStep.update({
            where: { id: next.id },
            data: { status: 'in_progress' },
          });
        }

        const allSteps = await tx.carePlanStep.findMany({
          where: { tenantId: this.tenantId, carePlanId },
        });
        const completed = allSteps.filter((s) => s.status === 'completed').length;
        const progress = computeProgress(completed, allSteps.length);

        await tx.carePlan.update({
          where: { id: carePlanId },
          data: {
            progressPercent: progress,
            completionPercent: progress,
            updatedBy: this.actorId(),
          },
        });

        return mapStep(updated);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  async completeTask(input: CompleteTaskInput): Promise<CareTask> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const task = await tx.carePlanTask.findFirst({
          where: { id: input.taskId, tenantId: this.tenantId },
        });
        assertTaskFound(task, input.taskId);

        const updated = await tx.carePlanTask.update({
          where: { id: input.taskId },
          data: {
            status: 'completed',
            completionNotes: input.completionNotes,
            completedAt: new Date(),
          },
        });

        const allTasks = await tx.carePlanTask.findMany({
          where: {
            tenantId: this.tenantId,
            carePlanId: task.carePlanId,
          },
        });
        const completed = allTasks.filter((t) => t.status === 'completed').length;
        const progress = computeProgress(completed, allTasks.length);

        await tx.carePlan.update({
          where: { id: task.carePlanId },
          data: {
            completionPercent: progress,
            updatedBy: this.actorId(),
          },
        });

        return mapTask(updated);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  async assignTask(input: AssignTaskInput): Promise<CareTask> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const task = await tx.carePlanTask.findFirst({
          where: { id: input.taskId, tenantId: this.tenantId },
        });
        assertTaskFound(task, input.taskId);

        const updated = await tx.carePlanTask.update({
          where: { id: input.taskId },
          data: {
            owner: input.owner,
          },
        });
        return mapTask(updated);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  private async setStatus(
    id: string,
    status: 'suspended' | 'archived',
    notes?: string,
  ): Promise<CarePlan> {
    try {
      return await this.prisma.runInTransaction(async (tx) => {
        const existing = await tx.carePlan.findFirst({
          where: { id, tenantId: this.tenantId },
        });
        assertCarePlanFound(existing, id);

        const row = await tx.carePlan.update({
          where: { id },
          data: {
            status,
            notes: notes ?? existing.notes,
            updatedBy: this.actorId(),
          },
        });
        return mapCarePlan(row);
      });
    } catch (error) {
      mapCarePathwaysRepositoryError(error);
    }
  }

  private actorId(): string {
    return (
      this.requestContext.require().userId ??
      '00000000-0000-0000-0000-000000000000'
    );
  }
}
