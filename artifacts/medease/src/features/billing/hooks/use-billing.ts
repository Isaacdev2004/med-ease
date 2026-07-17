import { useQuery } from '@tanstack/react-query';

import { billingQueries } from '@/features/billing/queries/billing.queries';
import { useAuth } from '@/services/auth/auth-context';
import { billingService } from '@/services/billing/billing.service';
import type { BillingFilters } from '@/services/billing/types';

export function useBillingContext() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['billing', 'context', user?.id],
    queryFn: () => billingService.resolvePatientId(user?.id ?? ''),
    enabled: Boolean(user?.id),
  });
}

export function useBillingDashboard(
  patientId?: string,
  providerId?: string,
  facilityId?: string,
) {
  return useQuery(billingQueries.dashboard(patientId, providerId, facilityId));
}

export function useInvoices(filters?: BillingFilters) {
  return useQuery(billingQueries.invoices(filters));
}

export function useInvoice(invoiceId: string) {
  return useQuery(billingQueries.invoice(invoiceId));
}

export function useClaims(filters?: BillingFilters) {
  return useQuery(billingQueries.claims(filters));
}

export function useClaim(claimId: string) {
  return useQuery(billingQueries.claim(claimId));
}

export function usePayments(filters?: BillingFilters) {
  return useQuery(billingQueries.payments(filters));
}

export function useReceipts(filters?: BillingFilters) {
  return useQuery(billingQueries.receipts(filters));
}

export function useInsurance(patientId?: string) {
  return useQuery(billingQueries.insurance(patientId));
}

export function useRevenueAnalytics() {
  return useQuery(billingQueries.analytics());
}

export function useOutstandingBalances(patientId?: string) {
  return useQuery(billingQueries.outstanding(patientId));
}

export function useRefunds(filters?: BillingFilters) {
  return useQuery(billingQueries.refunds(filters));
}

export function usePaymentTimeline(invoiceId: string) {
  return useQuery(billingQueries.timeline(invoiceId));
}

export function useBillingSearch(query: string, patientId?: string) {
  return useQuery(billingQueries.search(query, patientId));
}
