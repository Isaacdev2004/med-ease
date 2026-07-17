export function parseBpmnStageCount(stages: string[]): number {
  return stages.length;
}

export function validateBpmnTransition(
  from: string,
  to: string,
  allowed: [string, string][],
): boolean {
  return allowed.some(([a, b]) => a === from && b === to);
}

export function bpmnStageLabel(stageId: string): string {
  return stageId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
