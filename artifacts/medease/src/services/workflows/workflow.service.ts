import { workflowRepository } from '@/services/workflows/repository';
import type {
  ApproveInput,
  AssignTaskInput,
  CompleteTaskInput,
  CreateRuleInput,
  CreateWorkflowInput,
  EscalateInput,
  RejectInput,
  ScheduleWorkflowInput,
  ShareWorkflowInput,
  StartWorkflowInput,
  WorkflowFilters,
} from '@/services/workflows/types';

const DELAY = 250;
async function delay(ms = DELAY) {
  await new Promise((r) => setTimeout(r, ms));
}

export const workflowService = {
  async dashboard(facilityId?: string) {
    await delay();
    return workflowRepository.dashboard(facilityId);
  },
  async analytics(facilityId?: string) {
    await delay();
    return workflowRepository.analytics(facilityId);
  },
  async getDefinitions(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getDefinitions(filters);
  },
  async getDefinition(workflowId: string) {
    await delay();
    return workflowRepository.getDefinition(workflowId);
  },
  async getInstances(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getInstances(filters);
  },
  async getInstance(instanceId: string) {
    await delay();
    return workflowRepository.getInstance(instanceId);
  },
  async getTasks(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getTasks(filters);
  },
  async getApprovals(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getApprovals(filters);
  },
  async getRules(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getRules(filters);
  },
  async getSchedules(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getSchedules(filters);
  },
  async getJobs(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getJobs(filters);
  },
  async getEvents(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getEvents(filters);
  },
  async getEventQueues() {
    await delay();
    return workflowRepository.getEventQueues();
  },
  async getSlas(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getSlas(filters);
  },
  async getEscalations(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getEscalations(filters);
  },
  async getTemplates(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getTemplates(filters);
  },
  async getTriggers(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getTriggers(filters);
  },
  async getAudits(filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.getAudits(filters);
  },

  async createWorkflow(input: CreateWorkflowInput) {
    await delay();
    return workflowRepository.createWorkflow(input);
  },
  async publishWorkflow(workflowId: string) {
    await delay();
    return workflowRepository.publishWorkflow(workflowId);
  },
  async startWorkflow(input: StartWorkflowInput) {
    await delay();
    return workflowRepository.startWorkflow(input);
  },
  async pauseWorkflow(instanceId: string) {
    await delay();
    return workflowRepository.pauseWorkflow(instanceId);
  },
  async resumeWorkflow(instanceId: string) {
    await delay();
    return workflowRepository.resumeWorkflow(instanceId);
  },
  async cancelWorkflow(instanceId: string) {
    await delay();
    return workflowRepository.cancelWorkflow(instanceId);
  },
  async completeTask(input: CompleteTaskInput) {
    await delay();
    return workflowRepository.completeTask(input);
  },
  async assignTask(input: AssignTaskInput) {
    await delay();
    return workflowRepository.assignTask(input);
  },
  async approve(input: ApproveInput) {
    await delay();
    return workflowRepository.approve(input);
  },
  async reject(input: RejectInput) {
    await delay();
    return workflowRepository.reject(input);
  },
  async escalate(input: EscalateInput) {
    await delay();
    return workflowRepository.escalate(input);
  },
  async createRule(input: CreateRuleInput) {
    await delay();
    return workflowRepository.createRule(input);
  },
  async scheduleWorkflow(input: ScheduleWorkflowInput) {
    await delay();
    return workflowRepository.scheduleWorkflow(input);
  },

  async search(query: string, filters?: WorkflowFilters) {
    await delay();
    return workflowRepository.search(query, filters);
  },
  async exportData(format: 'csv' | 'pdf' | 'xlsx') {
    await delay();
    return workflowRepository.exportData(format);
  },
  async favorite(
    userId: string,
    entityType: 'workflow' | 'instance' | 'template',
    entityId: string,
  ) {
    await delay();
    return workflowRepository.favorite(userId, entityType, entityId);
  },
  async getFavorites(userId: string) {
    await delay();
    return workflowRepository.getFavorites(userId);
  },
  async share(input: ShareWorkflowInput) {
    await delay();
    return workflowRepository.share(input);
  },
};
