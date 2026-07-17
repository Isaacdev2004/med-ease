export { carePlanService } from '@/services/care-plans/care-plan.service';
export { carePlanOfflineQueue } from '@/services/care-plans/offline-sync';
export { computeGoalCompletionRate } from '@/services/care-plans/goal-engine';
export {
  computeOverallRisk,
  getRiskSeverityColor,
} from '@/services/care-plans/risk-engine';
export {
  categorizeTasks,
  sortTasksByDueDate,
} from '@/services/care-plans/task-engine';
export {
  toFhirCarePlan,
  toFhirGoal,
  toFhirTask,
} from '@/services/care-plans/mapper';
export { CARE_PLAN_TEMPLATES } from '@/services/care-plans/templates';
export { carePlanRepository } from '@/services/care-plans/repository';
export {
  MOCK_CARE_PLANS,
  MOCK_GOALS,
  MOCK_TASKS,
  MOCK_TEAM,
  MOCK_RISKS,
  MOCK_PATHWAYS,
  MOCK_ACTIVITY,
  buildDashboard,
  buildProgress,
  buildAnalytics,
  generateGoals,
  generateTasks,
} from '@/services/care-plans/mock-data';
export type {
  CarePlan,
  CareGoal,
  CareTask,
  CareTeamMember,
  CareTimelineEntry,
  CarePlanDashboard,
  CareProgressTracking,
  CareAnalytics,
  CarePlanFilters,
  ClinicalPathway,
  RiskAssessment,
  CreateCarePlanInput,
  UpdateGoalInput,
  CompleteTaskInput,
  AssignTaskInput,
} from '@/services/care-plans/types';
export { AUTH_USER_PATIENT_MAP } from '@/services/care-plans/types';
