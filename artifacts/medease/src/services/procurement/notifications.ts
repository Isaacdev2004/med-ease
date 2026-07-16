export type ProcurementNotificationType =
  | 'new_requisition'
  | 'approval_needed'
  | 'po_approved'
  | 'delivery_delayed'
  | 'invoice_mismatch'
  | 'contract_expiring'
  | 'supplier_risk'
  | 'budget_exceeded';

export function buildProcurementNotification(type: ProcurementNotificationType, context: Record<string, string>) {
  const templates: Record<ProcurementNotificationType, { title: string; body: string; severity: 'info' | 'warning' | 'critical' }> = {
    new_requisition: { title: 'New requisition', body: `${context.requestNumber ?? 'Requisition'} submitted by ${context.requester ?? 'user'}.`, severity: 'info' },
    approval_needed: { title: 'Approval required', body: `${context.entityType ?? 'Item'} ${context.entityId ?? ''} awaits your approval.`, severity: 'warning' },
    po_approved: { title: 'PO approved', body: `Purchase order ${context.poNumber ?? ''} has been approved.`, severity: 'info' },
    delivery_delayed: { title: 'Delivery delayed', body: `Shipment ${context.trackingNumber ?? ''} for PO ${context.poNumber ?? ''} is delayed.`, severity: 'warning' },
    invoice_mismatch: { title: 'Invoice mismatch', body: `Invoice ${context.invoiceNumber ?? ''} has a variance of ${context.variance ?? '0'}.`, severity: 'critical' },
    contract_expiring: { title: 'Contract expiring', body: `Contract ${context.contractNumber ?? ''} expires ${context.expiryDate ?? 'soon'}.`, severity: 'warning' },
    supplier_risk: { title: 'Supplier risk alert', body: `Supplier ${context.supplierName ?? ''} risk level: ${context.risk ?? 'elevated'}.`, severity: 'critical' },
    budget_exceeded: { title: 'Budget exceeded', body: `Cost center ${context.costCenter ?? ''} has exceeded ${context.threshold ?? '80%'} of budget.`, severity: 'critical' },
  };
  return { id: `proc-notif-${Date.now()}`, type, ...templates[type], context, createdAt: new Date().toISOString() };
}

export function generateProcurementNotifications() {
  return [
    buildProcurementNotification('approval_needed', { entityType: 'Requisition', entityId: 'PR-20250100' }),
    buildProcurementNotification('delivery_delayed', { poNumber: 'PO-20250200', trackingNumber: 'TRK202500100' }),
    buildProcurementNotification('contract_expiring', { contractNumber: 'CON-20250300', expiryDate: 'in 15 days' }),
    buildProcurementNotification('invoice_mismatch', { invoiceNumber: 'PINV-20250400', variance: '€250' }),
    buildProcurementNotification('budget_exceeded', { costCenter: 'CC-0010', threshold: '90%' }),
  ];
}
