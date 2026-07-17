export type InventoryNotificationType =
  | 'low_stock'
  | 'out_of_stock'
  | 'po_approved'
  | 'goods_received'
  | 'transfer_completed'
  | 'expiry_warning'
  | 'recall_notice'
  | 'maintenance_due'
  | 'cold_chain_failure'
  | 'asset_service_overdue';

export function buildInventoryNotification(
  type: InventoryNotificationType,
  context: Record<string, string>,
) {
  const templates: Record<InventoryNotificationType, string> = {
    low_stock: `Low stock alert: ${context.itemName} (${context.quantity} remaining).`,
    out_of_stock: `Out of stock: ${context.itemName}.`,
    po_approved: `Purchase order ${context.poNumber} approved.`,
    goods_received: `Goods received for PO ${context.poNumber}.`,
    transfer_completed: `Transfer ${context.transferId} completed.`,
    expiry_warning: `${context.itemName} expires in ${context.days} days.`,
    recall_notice: `Recall notice for batch ${context.batchNumber}.`,
    maintenance_due: `Maintenance due for ${context.assetName}.`,
    cold_chain_failure: `Cold chain failure detected for ${context.itemName}.`,
    asset_service_overdue: `Asset ${context.assetName} overdue for service.`,
  };
  return {
    type,
    message: templates[type],
    context,
    createdAt: new Date().toISOString(),
  };
}
