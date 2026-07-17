import { useMutation, useQueryClient } from '@tanstack/react-query';

import { appToast } from '@/services/api/toast';
import { queryKeys } from '@/services/api/query-keys';
import { billingOfflineQueue } from '@/services/billing/offline-sync';
import { billingService } from '@/services/billing/billing.service';
import type {
  CreateInvoiceInput,
  RecordPaymentInput,
  RefundPaymentInput,
  SubmitClaimInput,
  UpdateInvoiceInput,
} from '@/services/billing/types';

function runOrQueue(label: string, execute: () => Promise<unknown>) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    billingOfflineQueue.enqueue({
      label,
      execute: () => execute().then(() => undefined),
    });
    appToast.offline('Billing update queued until you are back online.');
    return Promise.resolve(null);
  }
  return execute();
}

function invalidateAll(client: ReturnType<typeof useQueryClient>) {
  void client.invalidateQueries({ queryKey: queryKeys.billing.all });
}

export function useBillingMutations() {
  const client = useQueryClient();

  const createInvoice = useMutation({
    mutationFn: (input: CreateInvoiceInput) =>
      runOrQueue('Create invoice', () => billingService.createInvoice(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Invoice created.' });
    },
  });

  const updateInvoice = useMutation({
    mutationFn: (input: UpdateInvoiceInput) =>
      runOrQueue('Update invoice', () => billingService.updateInvoice(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Invoice updated.' });
    },
  });

  const submitClaim = useMutation({
    mutationFn: (input: SubmitClaimInput) =>
      runOrQueue('Submit claim', () => billingService.submitClaim(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Claim submitted.' });
    },
  });

  const approveClaim = useMutation({
    mutationFn: ({
      claimId,
      approvedAmount,
    }: {
      claimId: string;
      approvedAmount?: number;
    }) =>
      runOrQueue('Approve claim', () =>
        billingService.approveClaim(claimId, approvedAmount),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Claim approved.' });
    },
  });

  const denyClaim = useMutation({
    mutationFn: ({ claimId, reason }: { claimId: string; reason: string }) =>
      runOrQueue('Deny claim', () => billingService.denyClaim(claimId, reason)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.info({ title: 'Claim denied.' });
    },
  });

  const recordPayment = useMutation({
    mutationFn: (input: RecordPaymentInput) =>
      runOrQueue('Record payment', () => billingService.recordPayment(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Payment recorded.' });
    },
  });

  const refundPayment = useMutation({
    mutationFn: (input: RefundPaymentInput) =>
      runOrQueue('Refund payment', () => billingService.refundPayment(input)),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Refund processed.' });
    },
  });

  const exportReport = useMutation({
    mutationFn: (format: 'csv' | 'pdf' | 'xlsx') =>
      runOrQueue('Export report', () =>
        billingService.exportFinancialReport(format),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Report exported.' });
    },
  });

  const shareInvoice = useMutation({
    mutationFn: ({
      invoiceId,
      sharedWith,
    }: {
      invoiceId: string;
      sharedWith: string;
    }) =>
      runOrQueue('Share invoice', () =>
        billingService.shareInvoice(invoiceId, sharedWith),
      ),
    onSuccess: () => {
      invalidateAll(client);
      appToast.success({ title: 'Invoice shared.' });
    },
  });

  const favoriteInvoice = useMutation({
    mutationFn: ({
      invoiceId,
      patientId,
    }: {
      invoiceId: string;
      patientId: string;
    }) =>
      runOrQueue('Favorite invoice', () =>
        billingService.favoriteInvoice(invoiceId, patientId),
      ),
    onSuccess: () => invalidateAll(client),
  });

  return {
    createInvoice,
    updateInvoice,
    submitClaim,
    approveClaim,
    denyClaim,
    recordPayment,
    refundPayment,
    exportReport,
    shareInvoice,
    favoriteInvoice,
  };
}
