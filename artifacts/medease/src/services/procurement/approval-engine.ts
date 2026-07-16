import type { ApprovalWorkflow, ApprovalStep, CreateRequisitionInput, PurchaseOrder } from '@/services/procurement/types';

const THRESHOLDS = { department: 1000, finance: 5000, ceo: 50000 };

export function buildApprovalWorkflow(
  entityType: ApprovalWorkflow['entityType'],
  entityId: string,
  totalAmount: number,
): ApprovalWorkflow {
  const steps: ApprovalStep[] = [
    { stepId: 'dept', role: 'Department Head', status: 'pending', threshold: THRESHOLDS.department },
  ];
  if (totalAmount >= THRESHOLDS.finance) {
    steps.push({ stepId: 'finance', role: 'Finance', status: 'pending', threshold: THRESHOLDS.finance });
  }
  if (totalAmount >= THRESHOLDS.ceo) {
    steps.push({ stepId: 'ceo', role: 'CEO', status: 'pending', threshold: THRESHOLDS.ceo });
  }
  return {
    workflowId: `wf-${Date.now()}`,
    entityType,
    entityId,
    steps,
    currentStep: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function approveStep(workflow: ApprovalWorkflow, approverId: string, approverName: string, comments?: string): ApprovalWorkflow {
  const step = workflow.steps[workflow.currentStep];
  if (!step) return workflow;
  step.status = 'approved';
  step.approverId = approverId;
  step.approverName = approverName;
  step.signedAt = new Date().toISOString();
  step.comments = comments;
  const next = workflow.currentStep + 1;
  const allApproved = next >= workflow.steps.length;
  return {
    ...workflow,
    currentStep: allApproved ? workflow.currentStep : next,
    status: allApproved ? 'approved' : 'pending',
    updatedAt: new Date().toISOString(),
  };
}

export function rejectStep(workflow: ApprovalWorkflow, approverId: string, approverName: string, comments?: string): ApprovalWorkflow {
  const step = workflow.steps[workflow.currentStep];
  if (step) {
    step.status = 'rejected';
    step.approverId = approverId;
    step.approverName = approverName;
    step.comments = comments;
  }
  return { ...workflow, status: 'rejected', updatedAt: new Date().toISOString() };
}

export function delegateStep(workflow: ApprovalWorkflow, delegateToId: string, delegateToName: string): ApprovalWorkflow {
  const step = workflow.steps[workflow.currentStep];
  if (step) {
    step.status = 'delegated';
    step.approverId = delegateToId;
    step.approverName = delegateToName;
  }
  return { ...workflow, status: 'delegated', updatedAt: new Date().toISOString() };
}

export function escalateStep(workflow: ApprovalWorkflow): ApprovalWorkflow {
  const step = workflow.steps[workflow.currentStep];
  if (step) step.status = 'escalated';
  const next = Math.min(workflow.currentStep + 1, workflow.steps.length - 1);
  return { ...workflow, currentStep: next, status: 'escalated', updatedAt: new Date().toISOString() };
}

export function requiresBudgetApproval(amount: number, budgetRemaining: number): boolean {
  return amount > budgetRemaining * 0.8;
}

export function buildRequisitionFromInput(input: CreateRequisitionInput, requestId: string, requisitionNumber: string) {
  const lineItems = input.lineItems.map((l, i) => ({
    ...l,
    lineId: `${requestId}-line-${i}`,
    total: l.quantity * l.unitPrice,
  }));
  const totalEstimate = lineItems.reduce((s, l) => s + l.total, 0);
  return {
    requestId,
    requisitionNumber,
    title: input.title,
    department: input.department,
    requesterId: input.requesterId,
    requesterName: input.requesterName,
    costCenterId: input.costCenterId,
    priority: input.priority ?? 'normal',
    status: 'submitted' as const,
    lineItems,
    totalEstimate,
    currency: 'EUR' as const,
    justification: input.justification,
    neededBy: input.neededBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function canApprovePO(order: PurchaseOrder, role: string): boolean {
  if (role === 'platform_admin') return true;
  if (order.total >= THRESHOLDS.ceo && role === 'ceo') return true;
  if (order.total >= THRESHOLDS.finance && role === 'finance') return true;
  if (role === 'department_head') return order.total < THRESHOLDS.finance;
  return false;
}
