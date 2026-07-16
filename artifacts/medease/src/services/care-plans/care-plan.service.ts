import { buildAnalytics } from '@/services/care-plans/analytics';
import { computeGoalCompletionRate } from '@/services/care-plans/goal-engine';
import { getPatientIdForUser, buildDashboard, buildProgress } from '@/services/care-plans/mock-data';
import { carePlanRepository } from '@/services/care-plans/repository';
import { computeOverallRisk } from '@/services/care-plans/risk-engine';
import { categorizeTasks, sortTasksByDueDate } from '@/services/care-plans/task-engine';
import type {
  AssignTaskInput,
  CarePlanFilters,
  CompleteTaskInput,
  CreateCarePlanInput,
  UpdateGoalInput,
} from '@/services/care-plans/types';

const DELAY = 250;
const delay = (ms = DELAY) => new Promise((r) => setTimeout(r, ms));

export const carePlanService = {
  async resolvePatientId(userId: string, explicitId?: string) {
    await delay(50);
    return explicitId ?? getPatientIdForUser(userId);
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
    return sortTasksByDueDate(carePlanRepository.getTasks(carePlanId, patientId));
  },

  async getTodayTasks(patientId: string) {
    await delay(100);
    const tasks = carePlanRepository.getTasks(undefined, patientId);
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
    const risks = carePlanRepository.getRisks(patientId, carePlanId);
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
    return buildDashboard(patientId);
  },

  async getProgressTracking(patientId: string) {
    await delay();
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
    const plans = carePlanRepository.getAllPlans(filters);
    return {
      totalPatients: new Set(plans.map((p) => p.patientId)).size,
      activePlans: plans.filter((p) => p.status === 'active').length,
      averageCompletion: Math.round(plans.reduce((s, p) => s + p.completionPercent, 0) / Math.max(plans.length, 1)),
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
    const goals = carePlanRepository.getGoals(undefined, patientId);
    return computeGoalCompletionRate(goals);
  },
};
