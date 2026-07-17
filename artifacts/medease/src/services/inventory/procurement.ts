import type {
  CreatePurchaseOrderInput,
  PurchaseOrder,
  PurchaseOrderStatus,
} from '@/services/inventory/types';
import { MOCK_SUPPLIERS } from '@/services/inventory/mock-data';

export function createPurchaseOrder(
  input: CreatePurchaseOrderInput,
  poId: string,
  poNumber: string,
): PurchaseOrder {
  const supplier = MOCK_SUPPLIERS.find(
    (s) => s.supplierId === input.supplierId,
  );
  const items = input.items.map((li, i) => ({
    lineId: `${poId}-line-${i}`,
    sku: li.sku,
    itemName: li.itemName,
    quantity: li.quantity,
    unitPrice: li.unitPrice,
    receivedQuantity: 0,
  }));
  const subtotal = items.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const tax = Math.round(subtotal * 0.1);
  const now = new Date().toISOString();
  return {
    purchaseOrderId: poId,
    poNumber,
    supplierId: input.supplierId,
    supplierName: supplier?.name ?? 'Unknown Supplier',
    department: input.department,
    status: 'draft',
    items,
    subtotal,
    tax,
    total: subtotal + tax,
    requestedBy: 'current-user',
    createdAt: now,
    updatedAt: now,
  };
}

export function approvePurchaseOrder(
  po: PurchaseOrder,
  approvedBy: string,
): PurchaseOrder {
  return {
    ...po,
    status: 'approved',
    approvedBy,
    orderDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function receivePurchaseOrder(po: PurchaseOrder): PurchaseOrder {
  const items = po.items.map((li) => ({
    ...li,
    receivedQuantity: li.quantity,
  }));
  return {
    ...po,
    status: 'received' as PurchaseOrderStatus,
    items,
    receivedDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
