export function notifyWorkflowStarted(
  instanceId: string,
  workflowName: string,
) {
  return {
    type: 'workflow_started',
    instanceId,
    workflowName,
    sentAt: new Date().toISOString(),
  };
}
