import { CACHE_TIMES } from '@/services/api/cache-config';
import { queryKeys } from '@/services/api/query-keys';
import { billingService } from '@/services/billing/billing.service';
import type { BillingFilters } from '@/services/billing/types';

export const billingQueries = {
  dashboard: (patientId?: string, providerId?: string, facilityId?: string) => ({
    queryKey: queryKeys.billing.dashboard(patientId, providerId, facilityId),
    queryFn: () => billingService.getDashboard(patientId, providerId, facilityId),
    staleTime: CACHE_TIMES.dashboard,
  }),
  invoices: (filters?: BillingFilters) => ({
    queryKey: queryKeys.billing.invoices(filters as Record<string, unknown> | undefined),
    queryFn: () => billingService.searchInvoices(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  invoice: (invoiceId: string) => ({
    queryKey: queryKeys.billing.invoice(invoiceId),
    queryFn: () => billingService.getInvoice(invoiceId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(invoiceId),
  }),
  claims: (filters?: BillingFilters) => ({
    queryKey: queryKeys.billing.claims(filters as Record<string, unknown> | undefined),
    queryFn: () => billingService.searchClaims(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  claim: (claimId: string) => ({
    queryKey: queryKeys.billing.claim(claimId),
    queryFn: () => billingService.getClaim(claimId),
    staleTime: CACHE_TIMES.default,
    enabled: Boolean(claimId),
  }),
  payments: (filters?: BillingFilters) => ({
    queryKey: queryKeys.billing.payments(filters as Record<string, unknown> | undefined),
    queryFn: () => billingService.getPayments(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  receipts: (filters?: BillingFilters) => ({
    queryKey: queryKeys.billing.receipts(filters as Record<string, unknown> | undefined),
    queryFn: () => billingService.getReceipts(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  insurance: (patientId?: string) => ({
    queryKey: queryKeys.billing.insurance(patientId),
    queryFn: () => billingService.getInsurance(patientId),
    staleTime: CACHE_TIMES.default,
  }),
  analytics: () => ({
    queryKey: queryKeys.billing.analytics(),
    queryFn: () => billingService.getAnalytics(),
    staleTime: CACHE_TIMES.dashboard,
  }),
  outstanding: (patientId?: string) => ({
    queryKey: queryKeys.billing.outstanding(patientId),
    queryFn: () => billingService.getOutstandingBalances(patientId),
    staleTime: CACHE_TIMES.patientList,
  }),
  refunds: (filters?: BillingFilters) => ({
    queryKey: queryKeys.billing.refunds(filters as Record<string, unknown> | undefined),
    queryFn: () => billingService.getRefunds(filters),
    staleTime: CACHE_TIMES.patientList,
  }),
  timeline: (invoiceId: string) => ({
    queryKey: queryKeys.billing.timeline(invoiceId),
    queryFn: () => billingService.getPaymentTimeline(invoiceId),
    staleTime: CACHE_TIMES.patientTimeline,
    enabled: Boolean(invoiceId),
  }),
  search: (query: string, patientId?: string) => ({
    queryKey: queryKeys.billing.search(query, patientId),
    queryFn: () => billingService.search(query, patientId),
    staleTime: CACHE_TIMES.patientList,
    enabled: query.length >= 2,
  }),
};
