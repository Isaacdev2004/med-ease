import { useQuery } from '@tanstack/react-query';

import { procurementQueries } from '@/features/procurement/queries/procurement.queries';
import type { ProcurementFilters } from '@/services/procurement/types';

export function useProcurementDashboard(department?: string) {
  return useQuery(procurementQueries.dashboard(department));
}

export function usePurchaseRequests(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.requests(filters));
}

export function usePurchaseRequest(requestId: string) {
  return useQuery(procurementQueries.request(requestId));
}

export function usePurchaseOrders(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.purchaseOrders(filters));
}

export function usePurchaseOrder(purchaseOrderId: string) {
  return useQuery(procurementQueries.purchaseOrder(purchaseOrderId));
}

export function useRFQs(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.rfqs(filters));
}

export function useSuppliers(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.suppliers(filters));
}

export function useSupplier(supplierId: string) {
  return useQuery(procurementQueries.supplier(supplierId));
}

export function useContracts(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.contracts(filters));
}

export function useBudgets(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.budgets(filters));
}

export function useReceiving(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.receiving(filters));
}

export function useDeliveries(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.deliveries(filters));
}

export function useInvoices(filters?: ProcurementFilters) {
  return useQuery(procurementQueries.invoices(filters));
}

export function useProcurementAnalytics() {
  return useQuery(procurementQueries.analytics());
}

export function useSupplierPerformance() {
  return useQuery(procurementQueries.supplierPerformance());
}

export function useSpendAnalysis(department?: string) {
  return useQuery(procurementQueries.spendAnalysis(department));
}

export function useForecast(department?: string) {
  return useQuery(procurementQueries.forecast(department));
}

export function useApprovalQueue() {
  return useQuery(procurementQueries.approvalQueue());
}

export function useFavorites(userId?: string) {
  return useQuery(procurementQueries.favorites(userId));
}

export function useProcurementSearch(query: string, department?: string) {
  return useQuery(procurementQueries.search(query, department));
}
