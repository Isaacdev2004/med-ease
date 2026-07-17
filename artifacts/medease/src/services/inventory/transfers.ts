import type { StockTransfer, TransferStatus } from '@/services/inventory/types';

export function createTransfer(
  fromWarehouseId: string,
  toWarehouseId: string,
  fromName: string,
  toName: string,
  items: StockTransfer['items'],
  transferId: string,
): StockTransfer {
  return {
    transferId,
    fromWarehouseId,
    toWarehouseId,
    fromWarehouseName: fromName,
    toWarehouseName: toName,
    items,
    status: 'pending',
    requestedBy: 'current-user',
    createdAt: new Date().toISOString(),
  };
}

export function completeTransfer(transfer: StockTransfer): StockTransfer {
  return {
    ...transfer,
    status: 'completed' as TransferStatus,
    completedAt: new Date().toISOString(),
  };
}
