import type {
  AssignTaskInput,
  CareGoal,
  CarePlan,
  CarePlanFilters,
  CareTask,
  CompleteTaskInput,
  CreateCarePlanInput,
  UpdateGoalInput,
} from '@/services/care-plans/types';
import {
  MOCK_ACTIVITY,
  MOCK_CARE_PLANS,
  MOCK_GOALS,
  MOCK_PATHWAYS,
  MOCK_RISKS,
  MOCK_TASKS,
  MOCK_TEAM,
  buildCareTimeline,
  generateCarePlan,
  generateGoals,
  generateTasks,
} from '@/services/care-plans/mock-data';

function matchesPlan(plan: CarePlan, filters: CarePlanFilters): boolean {
  if (filters.patientId && plan.patientId !== filters.patientId) return false;
  if (filters.status && plan.status !== filters.status) return false;
  if (filters.type && plan.type !== filters.type) return false;
  if (filters.pathwayId && plan.pathwayId !== filters.pathwayId) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (
      !`${plan.title} ${plan.primaryDiagnosis} ${plan.patientName}`
        .toLowerCase()
        .includes(q)
    )
      return false;
  }
  return true;
}

class CarePlanRepository {
  private plans: CarePlan[] = [...MOCK_CARE_PLANS];
  private goals: CareGoal[] = [...MOCK_GOALS];
  private tasks: CareTask[] = [...MOCK_TASKS];

  listPlans(filters?: CarePlanFilters) {
    const filtered = this.plans.filter((p) => matchesPlan(p, filters ?? {}));
    const page = filters?.page ?? 1;
    const pageSize = filters?.pageSize ?? 25;
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
    };
  }

  getAllPlans(filters?: CarePlanFilters) {
    return this.plans.filter((p) => matchesPlan(p, filters ?? {}));
  }

  getPlan(id: string) {
    return this.plans.find((p) => p.id === id) ?? null;
  }

  getActivePlan(patientId: string) {
    return (
      this.plans.find(
        (p) => p.patientId === patientId && p.status === 'active',
      ) ?? null
    );
  }

  getGoals(carePlanId?: string, patientId?: string) {
    return this.goals.filter((g) => {
      if (carePlanId && g.carePlanId !== carePlanId) return false;
      if (patientId && g.patientId !== patientId) return false;
      return true;
    });
  }

  getTasks(carePlanId?: string, patientId?: string) {
    return this.tasks.filter((t) => {
      if (carePlanId && t.carePlanId !== carePlanId) return false;
      if (patientId && t.patientId !== patientId) return false;
      return true;
    });
  }

  getTeam(carePlanId: string) {
    return MOCK_TEAM.filter((m) => m.carePlanId === carePlanId);
  }

  getRisks(patientId: string, carePlanId?: string) {
    return MOCK_RISKS.filter((r) => {
      if (r.patientId !== patientId) return false;
      if (carePlanId && r.carePlanId !== carePlanId) return false;
      return r.active;
    });
  }

  getTimeline(patientId: string) {
    return buildCareTimeline(patientId);
  }

  getPathways() {
    return MOCK_PATHWAYS;
  }

  getPathway(id: string) {
    return MOCK_PATHWAYS.find((p) => p.id === id) ?? null;
  }

  getActivity(carePlanId?: string) {
    if (!carePlanId) return MOCK_ACTIVITY;
    return MOCK_ACTIVITY.filter((a) => a.carePlanId === carePlanId);
  }

  createPlan(input: CreateCarePlanInput) {
    const idx = this.plans.length;
    const plan = generateCarePlan(idx, idx % 40);
    const created: CarePlan = {
      ...plan,
      ...input,
      id: `cp-new-${Date.now()}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.plans.unshift(created);
    this.goals.unshift(...generateGoals(created, idx));
    this.tasks.unshift(...generateTasks(created, idx));
    return created;
  }

  updateGoal(input: UpdateGoalInput) {
    const idx = this.goals.findIndex((g) => g.id === input.goalId);
    if (idx < 0) return null;
    this.goals[idx] = {
      ...this.goals[idx]!,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return this.goals[idx]!;
  }

  completeTask(input: CompleteTaskInput) {
    const idx = this.tasks.findIndex((t) => t.id === input.taskId);
    if (idx < 0) return null;
    this.tasks[idx] = {
      ...this.tasks[idx]!,
      status: 'completed',
      completionNotes: input.completionNotes,
      updatedAt: new Date().toISOString(),
    };
    return this.tasks[idx]!;
  }

  assignTask(input: AssignTaskInput) {
    const idx = this.tasks.findIndex((t) => t.id === input.taskId);
    if (idx < 0) return null;
    this.tasks[idx] = {
      ...this.tasks[idx]!,
      owner: input.owner,
      ownerId: input.ownerId,
      updatedAt: new Date().toISOString(),
    };
    return this.tasks[idx]!;
  }

  suspendPlan(id: string) {
    const idx = this.plans.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    this.plans[idx] = {
      ...this.plans[idx]!,
      status: 'suspended',
      updatedAt: new Date().toISOString(),
    };
    return this.plans[idx]!;
  }

  archivePlan(id: string) {
    const idx = this.plans.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    this.plans[idx] = {
      ...this.plans[idx]!,
      status: 'archived',
      updatedAt: new Date().toISOString(),
    };
    return this.plans[idx]!;
  }
}

export const carePlanRepository = new CarePlanRepository();
