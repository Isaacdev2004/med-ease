import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { financeOfflineQueue } from '@/services/finance/offline-sync';
import { financeService } from '@/services/finance/finance.service';
import type {
  CreateBudgetInput,
  CreateJournalInput,
  FixedAsset,
  ReconcileBankInput,
  RecordPaymentInput,
  VendorBill,
} from '@/services/finance/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    financeOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Finance update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.finance.all });
}

export function useFinanceMutations() {
  const client = useQueryClient();

  const createJournal = useMutation({
    mutationFn: (input: CreateJournalInput) =>
      runOrQueue('Create journal', () => financeService.createJournal(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Journal created.' });
    },
  });

  const approveJournal = useMutation({
    mutationFn: (journalId: string) =>
      runOrQueue('Approve journal', () =>
        financeService.approveJournal(journalId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Journal approved.' });
    },
  });

  const postJournal = useMutation({
    mutationFn: (journalId: string) =>
      runOrQueue('Post journal', () => financeService.postJournal(journalId)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Journal posted.' });
    },
  });

  const reverseJournal = useMutation({
    mutationFn: (journalId: string) =>
      runOrQueue('Reverse journal', () =>
        financeService.reverseJournal(journalId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Journal reversed.' });
    },
  });

  const createBudget = useMutation({
    mutationFn: (input: CreateBudgetInput) =>
      runOrQueue('Create budget', () => financeService.createBudget(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Budget created.' });
    },
  });

  const approveBudget = useMutation({
    mutationFn: (budgetId: string) =>
      runOrQueue('Approve budget', () =>
        financeService.approveBudget(budgetId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Budget approved.' });
    },
  });

  const createVendorBill = useMutation({
    mutationFn: (bill: Omit<VendorBill, 'billId' | 'matched' | 'agingDays'>) =>
      runOrQueue('Create vendor bill', () =>
        financeService.createVendorBill(bill),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Vendor bill created.' });
    },
  });

  const recordPayment = useMutation({
    mutationFn: (input: RecordPaymentInput) =>
      runOrQueue('Record payment', () => financeService.recordPayment(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Payment recorded.' });
    },
  });

  const reconcileBank = useMutation({
    mutationFn: (input: ReconcileBankInput) =>
      runOrQueue('Reconcile bank', () => financeService.reconcileBank(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Bank reconciled.' });
    },
  });

  const createAsset = useMutation({
    mutationFn: (
      input: Omit<
        FixedAsset,
        'assetId' | 'accumulatedDepreciation' | 'netBookValue' | 'status'
      >,
    ) => runOrQueue('Create asset', () => financeService.createAsset(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Asset created.' });
    },
  });

  const disposeAsset = useMutation({
    mutationFn: ({
      assetId,
      disposalProceeds,
    }: {
      assetId: string;
      disposalProceeds: number;
    }) =>
      runOrQueue('Dispose asset', () =>
        financeService.disposeAsset(assetId, disposalProceeds),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Asset disposed.' });
    },
  });

  const exportData = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export finance', () => financeService.exportData(format)),
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
      entityType: 'account' | 'journal' | 'budget' | 'asset';
      entityId: string;
    }) =>
      runOrQueue('Favorite', () =>
        financeService.favorite(userId, entityType, entityId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  const archiveJournal = useMutation({
    mutationFn: (journalId: string) =>
      runOrQueue('Archive journal', () =>
        financeService.archiveJournal(journalId),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Journal archived.' });
    },
  });

  return {
    createJournal,
    approveJournal,
    postJournal,
    reverseJournal,
    createBudget,
    approveBudget,
    createVendorBill,
    recordPayment,
    reconcileBank,
    createAsset,
    disposeAsset,
    exportData,
    favorite,
    archiveJournal,
  };
}
