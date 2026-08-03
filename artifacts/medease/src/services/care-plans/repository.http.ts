import { httpTransport } from '@workspace/repository-transport';
import type {
  AssignTaskInput,
  CarePlanFilters,
  CompleteTaskInput,
  CreateCarePlanInput,
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
import { carePlanMockRepository } from '@/services/care-plans/repository.mock';

const PATHWAYS = '/api/care-pathways';
const PLANS = '/api/care-plans';

class CarePlanHttpRepository {
  private readonly transport = httpTransport;
  private readonly mock = carePlanMockRepository;

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

  async getGoals(carePlanId?: string, patientId?: string) {
    return this.mock.getGoals(carePlanId, patientId);
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

  async getTeam(carePlanId: string) {
    return this.mock.getTeam(carePlanId);
  }

  async getRisks(patientId: string, carePlanId?: string) {
    return this.mock.getRisks(patientId, carePlanId);
  }

  async getTimeline(patientId: string) {
    return this.mock.getTimeline(patientId);
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

  async getActivity(carePlanId?: string) {
    return this.mock.getActivity(carePlanId);
  }

  async createPlan(input: CreateCarePlanInput) {
    return mapCarePlan(
      await this.transport.post(PLANS, { body: input }),
    );
  }

  async updateGoal(input: UpdateGoalInput) {
    return this.mock.updateGoal(input);
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
