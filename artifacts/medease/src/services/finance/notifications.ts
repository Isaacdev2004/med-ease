export type FinanceNotificationType =
  | 'journal_approval'
  | 'payment_due'
  | 'budget_alert'
  | 'reconciliation_required'
  | 'collection_reminder';

export function buildFinanceNotification(type: FinanceNotificationType, context: Record<string, string>) {
  const templates: Record<FinanceNotificationType, string> = {
    journal_approval: `Journal ${context.entry ?? 'entry'} pending approval`,
    payment_due: `Payment due: ${context.vendor ?? 'vendor'} — €${context.amount ?? '0'}`,
    budget_alert: `Budget variance alert: ${context.budget ?? 'budget'} at ${context.percent ?? '0'}%`,
    reconciliation_required: `Bank reconciliation required: ${context.account ?? 'account'}`,
    collection_reminder: `Outstanding receivable: ${context.customer ?? 'customer'} — €${context.amount ?? '0'}`,
  };
  return { type, message: templates[type], context, createdAt: new Date().toISOString() };
}
