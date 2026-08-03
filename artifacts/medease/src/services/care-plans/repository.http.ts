import { httpTransport } from '@workspace/repository-transport';
import type {
  AssignTaskInput,
  CareActivityItem,
  CareGoal,
  CarePlanFilters,
  CareTeamMember,
  CareTimelineEntry,
  CompleteTaskInput,
  CreateCarePlanInput,
  RiskAssessment,
  UpdateGoalInput,
} from '@/services/care-plans/types';
import {
  carePlanFiltersToQuery,
  mapCarePlan,
  mapCarePlanArray,
  mapPaginatedCarePlans,
  mapPathway,
  mapPathwayArray,
  mapStep,
  mapStepArray,
  mapTask,
  mapTaskArray,
} from '@/services/care-plans/dto-mappers';

const PATHWAYS = '/api/care-pathways';
const PLANS = '/api/care-plans';

class CarePlanHttpRepository {
  private readonly transport = httpTransport;

  async listPlans(filters?: CarePlanFilters) {
    return mapPaginatedCarePlans(
      await this.transport.get(PLANS, {
        query: carePlanFiltersToQuery(filters),
      }),
    );
  }

  async getAllPlans(filters?: CarePlanFilters) {
    return mapCarePlanArray(
      await this.transport.get(`${PLANS}/all`, {
        query: carePlanFiltersToQuery(filters),
      }),
    );
  }

  async getPlan(id: string) {
    try {
      return mapCarePlan(await this.transport.get(`${PLANS}/${id}`));
    } catch {
      return null;
    }
  }

  async getActivePlan(patientId: string) {
    const result = await this.transport.get(
      `${PLANS}/patient/${patientId}/active`,
    );
    if (result == null) return null;
    return mapCarePlan(result);
  }

  /** Goals table not live yet — derive soft goals from open tasks. */
  async getGoals(carePlanId?: string, patientId?: string): Promise<CareGoal[]> {
    const tasks = await this.getTasks(carePlanId, patientId);
    return tasks
      .filter((t) => t.status !== 'completed' && t.status !== 'cancelled')
      .map((t) => ({
        id: `goal-from-${t.id}`,
        carePlanId: t.carePlanId,
        patientId: t.patientId,
        title: t.title,
        description: t.description,
        category: 'clinical' as const,
        target: t.title,
        priority:
          t.priority === 'urgent'
            ? ('critical' as const)
            : t.priority === 'high'
              ? ('high' as const)
              : t.priority === 'low'
                ? ('low' as const)
                : ('medium' as const),
        owner: t.owner,
        ownerId: t.ownerId,
        deadline: t.dueDate,
        status:
          t.status === 'in_progress'
            ? ('in_progress' as const)
            : t.status === 'overdue' || t.status === 'missed'
              ? ('missed' as const)
              : ('not_started' as const),
        progressPercent: t.status === 'in_progress' ? 50 : 0,
        notes: t.completionNotes,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      }));
  }

  async getTasks(carePlanId?: string, patientId?: string) {
    return mapTaskArray(
      await this.transport.get(`${PLANS}/tasks`, {
        query: {
          carePlanId,
          patientId,
        },
      }),
    );
  }

  async getSteps(carePlanId: string) {
    return mapStepArray(
      await this.transport.get(`${PLANS}/${carePlanId}/steps`),
    );
  }

  /** Team roster not persisted yet — surface assigned physician from the plan. */
  async getTeam(carePlanId: string): Promise<CareTeamMember[]> {
    const plan = await this.getPlan(carePlanId);
    if (!plan?.assignedPhysicianId && !plan?.assignedPhysician) return [];
    return [
      {
        id: plan.assignedPhysicianId || `physician-${carePlanId}`,
        carePlanId,
        name: plan.assignedPhysician || 'Assigned physician',
        role: 'primary_physician',
        permissions: ['care_plans.read', 'care_plans.write'],
        responsibilities: ['Care plan oversight'],
        isPrimary: true,
      },
    ];
  }

  async getRisks(
    patientId: string,
    carePlanId?: string,
  ): Promise<RiskAssessment[]> {
    const plans = carePlanId
      ? ([await this.getPlan(carePlanId)].filter(
          (p): p is NonNullable<typeof p> => p != null,
        ))
      : await this.getAllPlans({ patientId });
    return plans
      .filter((p) => p.riskLevel && p.riskLevel !== 'low')
      .map((plan) => ({
        id: `risk-${plan.id}`,
        carePlanId: plan.id,
        patientId: plan.patientId,
        category: 'clinical' as const,
        severity: plan.riskLevel,
        score:
          plan.riskLevel === 'critical'
            ? 90
            : plan.riskLevel === 'high'
              ? 70
              : 40,
        title: `${plan.title} risk`,
        recommendation: `Review care plan ${plan.title}`,
        assessedAt: plan.updatedAt,
        active: plan.status === 'active' || plan.status === 'on_hold',
      }));
  }

  async getTimeline(patientId: string): Promise<CareTimelineEntry[]> {
    const [plans, tasks] = await Promise.all([
      this.getAllPlans({ patientId }),
      this.getTasks(undefined, patientId),
    ]);
    const entries: CareTimelineEntry[] = [
      ...plans.map((p) => ({
        id: `tl-plan-${p.id}`,
        patientId,
        carePlanId: p.id,
        date: p.startDate || p.createdAt,
        title: p.title,
        description: p.status,
        category: 'provider' as const,
        linkedEntityId: p.id,
        linkedEntityType: 'care_plan',
      })),
      ...tasks.map((t) => ({
        id: `tl-task-${t.id}`,
        patientId,
        carePlanId: t.carePlanId,
        date: t.dueDate || t.updatedAt,
        title: t.title,
        description: t.status,
        category: 'task' as const,
        linkedEntityId: t.id,
        linkedEntityType: 'care_task',
      })),
    ];
    return entries.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getPathways() {
    return mapPathwayArray(await this.transport.get(PATHWAYS));
  }

  async getPathway(id: string) {
    try {
      return mapPathway(await this.transport.get(`${PATHWAYS}/${id}`));
    } catch {
      return null;
    }
  }

  async getActivity(carePlanId?: string): Promise<CareActivityItem[]> {
    if (!carePlanId) return [];
    const tasks = await this.getTasks(carePlanId);
    return tasks
      .map((t) => ({
        id: `act-${t.id}`,
        type: 'task' as const,
        title: t.title,
        actor: t.owner,
        timestamp: t.updatedAt,
        carePlanId: t.carePlanId,
      }))
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  async createPlan(input: CreateCarePlanInput) {
    return mapCarePlan(
      await this.transport.post(PLANS, { body: input }),
    );
  }

  /** Goal entities are not persisted yet. */
  async updateGoal(_input: UpdateGoalInput) {
    return null;
  }

  async completeTask(input: CompleteTaskInput) {
    return mapTask(
      await this.transport.post(`${PLANS}/tasks/complete`, { body: input }),
    );
  }

  async assignTask(input: AssignTaskInput) {
    return mapTask(
      await this.transport.post(`${PLANS}/tasks/assign`, { body: input }),
    );
  }

  async completeStep(carePlanId: string, stepId: string, notes?: string) {
    return mapStep(
      await this.transport.post(
        `${PLANS}/${carePlanId}/steps/${stepId}/complete`,
        { body: { notes } },
      ),
    );
  }

  async suspendPlan(id: string) {
    return mapCarePlan(
      await this.transport.post(`${PLANS}/${id}/suspend`, { body: {} }),
    );
  }

  async archivePlan(id: string) {
    return mapCarePlan(
      await this.transport.post(`${PLANS}/${id}/archive`, { body: {} }),
    );
  }
}

export const carePlanHttpRepository = new CarePlanHttpRepository();
