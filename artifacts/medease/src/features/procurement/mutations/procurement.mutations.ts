import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { procurementOfflineQueue } from '@/services/procurement/offline-sync';
import { procurementService } from '@/services/procurement/procurement.service';
import type {
  CreateInvoiceInput,
  CreatePOInput,
  CreateRequisitionInput,
  CreateRFQInput,
  ReceiveGoodsInput,
} from '@/services/procurement/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    procurementOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Procurement update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.procurement.all });
}

export function useProcurementMutations() {
  const client = useQueryClient();

  const createRequisition = useMutation({
    mutationFn: (input: CreateRequisitionInput) =>
      runOrQueue('Create requisition', () =>
        procurementService.createRequisition(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Requisition submitted.' });
    },
  });

  const approveRequest = useMutation({
    mutationFn: ({
      requestId,
      approverId,
      approverName,
    }: {
      requestId: string;
      approverId: string;
      approverName: string;
    }) =>
      runOrQueue('Approve requisition', () =>
        procurementService.approveRequest(requestId, approverId, approverName),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Requisition approved.' });
    },
  });

  const rejectRequest = useMutation({
    mutationFn: ({
      requestId,
      approverId,
      approverName,
      reason,
    }: {
      requestId: string;
      approverId: string;
      approverName: string;
      reason?: string;
    }) =>
      runOrQueue('Reject requisition', () =>
        procurementService.rejectRequest(
          requestId,
          approverId,
          approverName,
          reason,
        ),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Requisition rejected.' });
    },
  });

  const createRFQ = useMutation({
    mutationFn: (input: CreateRFQInput) =>
      runOrQueue('Create RFQ', () => procurementService.createRFQ(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'RFQ created.' });
    },
  });

  const awardRFQ = useMutation({
    mutationFn: ({
      rfqId,
      responseId,
    }: {
      rfqId: string;
      responseId: string;
    }) =>
      runOrQueue('Award RFQ', () =>
        procurementService.awardRFQ(rfqId, responseId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Supplier awarded.' });
    },
  });

  const createPO = useMutation({
    mutationFn: (input: CreatePOInput) =>
      runOrQueue('Create PO', () => procurementService.createPO(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Purchase order created.' });
    },
  });

  const approvePO = useMutation({
    mutationFn: ({
      purchaseOrderId,
      approverId,
      approverName,
    }: {
      purchaseOrderId: string;
      approverId: string;
      approverName: string;
    }) =>
      runOrQueue('Approve PO', () =>
        procurementService.approvePO(purchaseOrderId, approverId, approverName),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Purchase order approved.' });
    },
  });

  const receiveGoods = useMutation({
    mutationFn: (input: ReceiveGoodsInput) =>
      runOrQueue('Receive goods', () => procurementService.receiveGoods(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Goods received.' });
    },
  });

  const createInvoice = useMutation({
    mutationFn: (input: CreateInvoiceInput) =>
      runOrQueue('Create invoice', () =>
        procurementService.createInvoice(input),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Invoice created.' });
    },
  });

  const approveInvoice = useMutation({
    mutationFn: (invoiceId: string) =>
      runOrQueue('Approve invoice', () =>
        procurementService.approveInvoice(invoiceId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Invoice approved.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export procurement', () =>
        procurementService.exportData(format),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Export complete.' });
    },
  });

  const favorite = useMutation({
    mutationFn: ({
      userId,
      entityType,
      entityId,
    }: {
      userId: string;
      entityType: 'supplier' | 'request' | 'order' | 'contract';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        procurementService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const archiveRequest = useMutation({
    mutationFn: (requestId: string) =>
      runOrQueue('Archive request', () =>
        procurementService.archiveRequest(requestId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Request archived.' });
    },
  });

  return {
    createRequisition,
    approveRequest,
    rejectRequest,
    createRFQ,
    awardRFQ,
    createPO,
    approvePO,
    receiveGoods,
    createInvoice,
    approveInvoice,
    exportData,
    favorite,
    archiveRequest,
  };
}
