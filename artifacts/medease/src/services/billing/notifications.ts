export type BillingNotificationType =
  | 'invoice_created'
  | 'payment_received'
  | 'payment_failed'
  | 'claim_submitted'
  | 'claim_approved'
  | 'claim_denied'
  | 'refund_completed'
  | 'authorization_approved'
  | 'balance_reminder'
  | 'receipt_available';

export function buildBillingNotification(
  type: BillingNotificationType,
  context: Record<string, string>,
) {
  const templates: Record<BillingNotificationType, string> = {
    invoice_created: `Invoice ${context.invoiceNumber} has been created. Amount due: ${context.amount}.`,
    payment_received: `Payment of ${context.amount} received for invoice ${context.invoiceNumber}.`,
    payment_failed: `Payment failed for invoice ${context.invoiceNumber}. Please retry.`,
    claim_submitted: `Insurance claim ${context.claimId} submitted to ${context.payer}.`,
    claim_approved: `Claim ${context.claimId} approved. Approved amount: ${context.amount}.`,
    claim_denied: `Claim ${context.claimId} denied. Reason: ${context.reason}.`,
    refund_completed: `Refund of ${context.amount} processed for payment ${context.paymentId}.`,
    authorization_approved: `Pre-authorization ${context.authNumber} approved.`,
    balance_reminder: `Outstanding balance reminder: ${context.amount} due by ${context.dueDate}.`,
    receipt_available: `Receipt ${context.receiptNumber} is available for download.`,
  };
  return {
    type,
    message: templates[type],
    context,
    createdAt: new Date().toISOString(),
  };
}
