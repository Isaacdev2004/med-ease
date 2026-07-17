import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { inventoryOfflineQueue } from '@/services/inventory/offline-sync';
import { inventoryService } from '@/services/inventory/inventory.service';
import type {
  AdjustInventoryInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  IssueStockInput,
  ReceiveStockInput,
  TransferStockInput,
} from '@/services/inventory/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    inventoryOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Inventory update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.inventory.all });
}

export function useInventoryMutations() {
  const client = useQueryClient();

  const createItem = useMutation({
    mutationFn: (input: CreateInventoryInput) =>
      runOrQueue('Create item', () =>
        inventoryService.createInventoryItem(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Item created.' });
    },
  });

  const receiveStock = useMutation({
    mutationFn: (input: ReceiveStockInput) =>
      runOrQueue('Receive stock', () => inventoryService.receiveStock(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Stock received.' });
    },
  });

  const issueStock = useMutation({
    mutationFn: (input: IssueStockInput) =>
      runOrQueue('Issue stock', () => inventoryService.issueStock(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Stock issued.' });
    },
  });

  const transferStock = useMutation({
    mutationFn: (input: TransferStockInput) =>
      runOrQueue('Transfer stock', () => inventoryService.transferStock(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Transfer completed.' });
    },
  });

  const adjustInventory = useMutation({
    mutationFn: (input: AdjustInventoryInput) =>
      runOrQueue('Adjust inventory', () =>
        inventoryService.adjustInventory(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Inventory adjusted.' });
    },
  });

  const createPurchaseOrder = useMutation({
    mutationFn: (input: CreatePurchaseOrderInput) =>
      runOrQueue('Create PO', () =>
        inventoryService.createPurchaseOrder(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Purchase order created.' });
    },
  });

  const approvePurchaseOrder = useMutation({
    mutationFn: (poId: string) =>
      runOrQueue('Approve PO', () =>
        inventoryService.approvePurchaseOrder(poId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Purchase order approved.' });
    },
  });

  const receivePurchaseOrder = useMutation({
    mutationFn: (poId: string) =>
      runOrQueue('Receive PO', () =>
        inventoryService.receivePurchaseOrder(poId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Purchase order received.' });
    },
  });

  const scanBarcode = useMutation({
    mutationFn: (code: string) => inventoryService.scanBarcode(code),
    onSuccess: (result) => {
      invalidateAll(client);
      if (result?.found)
        appToast.success({ title: `Found: ${result.itemName}` });
      else appToast.warning({ title: 'Item not found.' });
    },
  });

  const exportInventory = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export', () => inventoryService.exportInventory(format)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export ready.' });
    },
  });

  const favoriteItem = useMutation({
    mutationFn: ({
      inventoryId,
      userId,
    }: {
      inventoryId: string;
      userId: string;
    }) =>
      runOrQueue('Favorite', () =>
        inventoryService.favoriteItem(inventoryId, userId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  return {
    createItem,
    receiveStock,
    issueStock,
    transferStock,
    adjustInventory,
    createPurchaseOrder,
    approvePurchaseOrder,
    receivePurchaseOrder,
    scanBarcode,
    exportInventory,
    favoriteItem,
  };
}
