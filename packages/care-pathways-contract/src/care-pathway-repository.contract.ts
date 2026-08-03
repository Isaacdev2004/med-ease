import type {
  AssignTaskInput,
  CarePlan,
  CarePlanBoardResult,
  CarePlanFilters,
  CarePlanListResult,
  CarePlanStep,
  CareTask,
  ClinicalPathway,
  CompleteStepInput,
  CompleteTaskInput,
  CreateCarePlanInput,
} from './care-pathway.types';

export interface CarePathwaysRepositoryContract {
  listPathways(): Promise<ClinicalPathway[]>;
  getPathway(code: string): Promise<ClinicalPathway>;

  search(filters?: CarePlanFilters): Promise<CarePlanListResult>;
  getAll(filters?: CarePlanFilters): Promise<CarePlan[]>;
  getById(id: string): Promise<CarePlan>;
  getActiveForPatient(patientId: string): Promise<CarePlan | null>;
  getBoard(filters?: CarePlanFilters): Promise<CarePlanBoardResult>;

  getSteps(carePlanId: string): Promise<CarePlanStep[]>;
  getTasks(carePlanId?: string, patientId?: string): Promise<CareTask[]>;

  enroll(input: CreateCarePlanInput): Promise<CarePlan>;
  activate(id: string): Promise<CarePlan>;
  suspend(id: string, notes?: string): Promise<CarePlan>;
  archive(id: string, notes?: string): Promise<CarePlan>;
  complete(id: string, notes?: string): Promise<CarePlan>;

  completeStep(
    carePlanId: string,
    stepId: string,
    input?: CompleteStepInput,
  ): Promise<CarePlanStep>;
  completeTask(input: CompleteTaskInput): Promise<CareTask>;
  assignTask(input: AssignTaskInput): Promise<CareTask>;
}
