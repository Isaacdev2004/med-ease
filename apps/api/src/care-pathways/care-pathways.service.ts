import { Injectable } from '@nestjs/common';

import type {
  AssignTaskInput,
  CarePlanFilters,
  CompleteStepInput,
  CompleteTaskInput,
  CreateCarePlanInput,
} from '@medease/care-pathways-contract';

import { CarePathwaysRepository } from './care-pathways.repository';

@Injectable()
export class CarePathwaysService {
  constructor(private readonly repository: CarePathwaysRepository) {}

  listPathways() {
    return this.repository.listPathways();
  }

  getPathway(code: string) {
    return this.repository.getPathway(code);
  }

  search(filters?: CarePlanFilters) {
    return this.repository.search(filters);
  }

  getAll(filters?: CarePlanFilters) {
    return this.repository.getAll(filters);
  }

  getById(id: string) {
    return this.repository.getById(id);
  }

  getActiveForPatient(patientId: string) {
    return this.repository.getActiveForPatient(patientId);
  }

  getBoard(filters?: CarePlanFilters) {
    return this.repository.getBoard(filters);
  }

  getSteps(carePlanId: string) {
    return this.repository.getSteps(carePlanId);
  }

  getTasks(carePlanId?: string, patientId?: string) {
    return this.repository.getTasks(carePlanId, patientId);
  }

  enroll(input: CreateCarePlanInput) {
    return this.repository.enroll(input);
  }

  activate(id: string) {
    return this.repository.activate(id);
  }

  suspend(id: string, notes?: string) {
    return this.repository.suspend(id, notes);
  }

  archive(id: string, notes?: string) {
    return this.repository.archive(id, notes);
  }

  complete(id: string, notes?: string) {
    return this.repository.complete(id, notes);
  }

  completeStep(carePlanId: string, stepId: string, input?: CompleteStepInput) {
    return this.repository.completeStep(carePlanId, stepId, input);
  }

  completeTask(input: CompleteTaskInput) {
    return this.repository.completeTask(input);
  }

  assignTask(input: AssignTaskInput) {
    return this.repository.assignTask(input);
  }
}
