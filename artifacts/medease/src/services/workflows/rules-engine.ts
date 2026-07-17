import type { BusinessRule } from '@/services/workflows/types';

export function evaluateRule(
  rule: BusinessRule,
  context: Record<string, unknown>,
): boolean {
  if (!rule.enabled) return false;
  const fieldValue = context[rule.condition.split(' ')[0] ?? ''];
  if (fieldValue === undefined) return false;
  return String(fieldValue).includes(
    rule.condition.split(' ').slice(-1)[0] ?? '',
  );
}

export function matchingRules(
  rules: BusinessRule[],
  context: Record<string, unknown>,
): BusinessRule[] {
  return rules
    .filter((r) => evaluateRule(r, context))
    .sort((a, b) => b.priority - a.priority);
}
