import type {
  InventoryItem,
  ReceiveStockInput,
  IssueStockInput,
} from '@/services/inventory/types';

export function receiveStock(
  item: InventoryItem,
  input: ReceiveStockInput,
): InventoryItem {
  const qty = item.quantityOnHand + input.quantity;
  return {
    ...item,
    quantityOnHand: qty,
    availableQuantity: qty - item.reservedQuantity,
    batchNumber: input.batchNumber ?? item.batchNumber,
    expiryDate: input.expiryDate ?? item.expiryDate,
    status:
      qty === 0
        ? 'out_of_stock'
        : qty <= item.reorderLevel
          ? 'low_stock'
          : 'active',
    updatedAt: new Date().toISOString(),
  };
}

export function issueStock(
  item: InventoryItem,
  input: IssueStockInput,
): InventoryItem {
  const qty = Math.max(0, item.quantityOnHand - input.quantity);
  return {
    ...item,
    quantityOnHand: qty,
    availableQuantity: Math.max(0, qty - item.reservedQuantity),
    status:
      qty === 0
        ? 'out_of_stock'
        : qty <= item.reorderLevel
          ? 'low_stock'
          : 'active',
    updatedAt: new Date().toISOString(),
  };
}

export function adjustStock(
  item: InventoryItem,
  quantity: number,
): InventoryItem {
  return {
    ...item,
    quantityOnHand: quantity,
    availableQuantity: Math.max(0, quantity - item.reservedQuantity),
    status:
      quantity === 0
        ? 'out_of_stock'
        : quantity <= item.reorderLevel
          ? 'low_stock'
          : 'active',
    updatedAt: new Date().toISOString(),
  };
}

export function checkReorder(item: InventoryItem) {
  return item.availableQuantity <= item.reorderLevel;
}

export function applyFifo(items: InventoryItem[]) {
  return [...items].sort((a, b) =>
    (a.manufactureDate ?? '').localeCompare(b.manufactureDate ?? ''),
  );
}

export function applyFefo(items: InventoryItem[]) {
  return [...items].sort((a, b) =>
    (a.expiryDate ?? '9999').localeCompare(b.expiryDate ?? '9999'),
  );
}
