export function notifyTaskAssigned(taskId: string, assigneeId: string) {
  return { type: 'task_assigned', taskId, assigneeId, sentAt: new Date().toISOString() };
}

export function notifyApprovalRequired(approvalId: string, approverId: string) {
  return { type: 'approval_required', approvalId, approverId, sentAt: new Date().toISOString() };
}

export function notifySlaBreach(instanceId: string) {
  return { type: 'sla_breach', instanceId, sentAt: new Date().toISOString() };
}
