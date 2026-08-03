import { useApiAuth } from '@/services/auth/auth-service';
import { buildAnalytics } from '@/services/care-plans/analytics';
import { computeGoalCompletionRate } from '@/services/care-plans/goal-engine';
import { getPatientIdForUser } from '@/services/care-plans/mock-data';
import { carePlanRepository } from '@/services/care-plans/repository';
import { computeOverallRisk } from '@/services/care-plans/risk-engine';
import {
  categorizeTasks,
  sortTasksByDueDate,
} from '@/services/care-plans/task-engine';
import { resolveClinicalPatientId } from '@/services/patients/resolve-patient-id';
import type {
  AssignTaskInput,
  CarePlanDashboard,
  CarePlanFilters,
  CompleteTaskInput,
  CreateCarePlanInput,
  UpdateGoalInput,
} from '@/services/care-plans/types';

const DELAY = useApiAuth ? 0 : 250;
const delay = (ms = DELAY) =>
  DELAY <= 0 ? Promise.resolve() : new Promise((r) => setTimeout(r, ms));

async function buildLiveDashboard(patientId: string): Promise<CarePlanDashboard> {
  const [plans, tasks] = await Promise.all([
    carePlanRepository.getAllPlans({ patientId }),
    carePlanRepository.getTasks(undefined, patientId),
  ]);
  const activePlan =
    plans.find((p) => p.status === 'active') ?? plans[0] ?? undefined;
  const now = Date.now();

  return {
    patientId,
    activePlan,
    healthScore: activePlan?.healthScore ?? 0,
    completionPercent: activePlan?.completionPercent ?? 0,
    progressPercent: activePlan?.progressPercent ?? 0,
    riskLevel: activePlan?.riskLevel ?? 'moderate',
    pendingTasks: tasks.filter((t) => t.status === 'pending').length,
    upcomingTasks: tasks.filter(
      (t) => t.status === 'pending' && new Date(t.dueDate).getTime() > now,
    ).length,
    completedTasks: tasks.filter((t) => t.status === 'completed').length,
    overdueTasks: tasks.filter((t) => t.status === 'overdue').length,
    missedTasks: tasks.filter((t) => t.status === 'missed').length,
    assignedProfessionals: activePlan ? 1 : 0,
    upcomingAppointments: activePlan?.linkedAppointmentIds.length ?? 0,
    activeMedications: activePlan?.linkedMedicationIds.length ?? 0,
    outstandingLabs: 0,
    outstandingImaging: 0,
    recentActivity: plans.slice(0, 5).map((p) => ({
      id: p.id,
      title: p.title,
      date: p.updatedAt,
    })),
  };
}

export const carePlanService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return resolveClinicalPatientId(userId, {
      explicitId,
      demoFallback: getPatientIdForUser,
    });
  },

  async searchCarePlans(filters?: CarePlanFilters) {
    await delay();
    return carePlanRepository.listPlans(filters);
  },

  async getCarePlans(filters?: CarePlanFilters) {
    await delay();
    return carePlanRepository.getAllPlans(filters);
  },

  async getCarePlan(id: string) {
    await delay(150);
    return carePlanRepository.getPlan(id);
  },

  async getPatientCarePlan(patientId: string) {
    await delay();
    return carePlanRepository.getActivePlan(patientId);
  },

  async getGoals(patientId?: string, carePlanId?: string) {
    await delay();
    return carePlanRepository.getGoals(carePlanId, patientId);
  },

  async getTasks(patientId?: string, carePlanId?: string) {
    await delay();
    return sortTasksByDueDate(
      await carePlanRepository.getTasks(carePlanId, patientId),
    );
  },

  async getSteps(carePlanId: string) {
    await delay();
    return carePlanRepository.getSteps(carePlanId);
  },

  async getTodayTasks(patientId: string) {
    await delay(100);
    const tasks = await carePlanRepository.getTasks(undefined, patientId);
    return categorizeTasks(tasks).today;
  },

  async getTimeline(patientId: string) {
    await delay();
    return carePlanRepository.getTimeline(patientId);
  },

  async getCareTeam(carePlanId: string) {
    await delay();
    return carePlanRepository.getTeam(carePlanId);
  },

  async getRiskAssessment(patientId: string, carePlanId?: string) {
    await delay(150);
    const risks = await carePlanRepository.getRisks(patientId, carePlanId);
    return { risks, overall: computeOverallRisk(risks) };
  },

  async getClinicalPathways() {
    await delay();
    return carePlanRepository.getPathways();
  },

  async getClinicalPathway(id: string) {
    await delay();
    return carePlanRepository.getPathway(id);
  },

  async getDashboard(patientId: string) {
    await delay();
    if (useApiAuth) return buildLiveDashboard(patientId);
    const { buildDashboard } = await import('@/services/care-plans/mock-data');
    return buildDashboard(patientId);
  },

  async getProgressTracking(patientId: string) {
    await delay();
    if (useApiAuth) {
      const dashboard = await buildLiveDashboard(patientId);
      return {
        patientId,
        daily: dashboard.progressPercent,
        weekly: dashboard.progressPercent,
        monthly: dashboard.completionPercent,
        quarterly: dashboard.completionPercent,
        yearly: dashboard.completionPercent,
        goalCompletion: dashboard.completionPercent,
        medicationCompliance: 0,
        appointmentAttendance: 0,
        clinicalImprovement: dashboard.healthScore,
        healthScoreTrend: [] as { label: string; value: number }[],
        riskTrend: [] as { label: string; value: number }[],
      };
    }
    const { buildProgress } = await import('@/services/care-plans/mock-data');
    return buildProgress(patientId);
  },

  async getAnalytics(filters?: CarePlanFilters) {
    await delay();
    void filters;
    return buildAnalytics();
  },

  async getActivity(carePlanId?: string) {
    await delay();
    return carePlanRepository.getActivity(carePlanId);
  },

  async getPopulationCare(filters?: CarePlanFilters) {
    await delay();
    const plans = await carePlanRepository.getAllPlans(filters);
    return {
      totalPatients: new Set(plans.map((p) => p.patientId)).size,
      activePlans: plans.filter((p) => p.status === 'active').length,
      averageCompletion: Math.round(
        plans.reduce((s, p) => s + p.completionPercent, 0) /
          Math.max(plans.length, 1),
      ),
    };
  },

  async createCarePlan(input: CreateCarePlanInput) {
    await delay();
    return carePlanRepository.createPlan(input);
  },

  async updateGoal(input: UpdateGoalInput) {
    await delay();
    return carePlanRepository.updateGoal(input);
  },

  async completeTask(input: CompleteTaskInput) {
    await delay();
    return carePlanRepository.completeTask(input);
  },

  async assignTask(input: AssignTaskInput) {
    await delay();
    return carePlanRepository.assignTask(input);
  },

  async completeStep(carePlanId: string, stepId: string, notes?: string) {
    await delay();
    return carePlanRepository.completeStep(carePlanId, stepId, notes);
  },

  async suspendCarePlan(id: string) {
    await delay();
    return carePlanRepository.suspendPlan(id);
  },

  async archiveCarePlan(id: string) {
    await delay();
    return carePlanRepository.archivePlan(id);
  },

  async getGoalCompletion(patientId: string) {
    await delay(50);
    const goals = await carePlanRepository.getGoals(undefined, patientId);
    return computeGoalCompletionRate(goals);
  },
};
